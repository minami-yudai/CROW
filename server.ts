import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "5mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const extractionSchema = {
  type: Type.OBJECT,
  properties: {
    recipient: {
      type: Type.OBJECT,
      properties: {
        fullName: {
          type: Type.STRING,
          description: "抽出された宛先の氏名（例: 田中 太郎、または 鈴木様、担当者様 等。記載がない場合は '担当者様' 等）",
        },
        honorific: {
          type: Type.STRING,
          description: "敬称（様、殿、先生、さん 等）",
        },
        organization: {
          type: Type.STRING,
          description: "会社名・所属組織名（本文に記載がある場合、なければ空文字）",
        },
        department: {
          type: Type.STRING,
          description: "部署・役職（例: マーケティング部 部長 等、なければ空文字）",
        },
        formattedAddressing: {
          type: Type.STRING,
          description: "メール冒頭に使える正式な宛名行（例: 株式会社〇〇 営業部 田中 太郎 様）",
        },
        rawTextSnippet: {
          type: Type.STRING,
          description: "宛先と判定したメール文面中の該当テキスト箇所",
        },
        coRecipients: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "複数宛先やCCなどで記載されている他の名前（なければ空配列）",
        },
      },
      required: ["fullName", "formattedAddressing", "rawTextSnippet"],
    },
    sender: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: "差出人の氏名（署名や名乗りから抽出、不明なら空文字）",
        },
        organization: {
          type: Type.STRING,
          description: "差出人の会社名・所属組織（不明なら空文字）",
        },
      },
    },
    subject: {
      type: Type.OBJECT,
      properties: {
        primary: {
          type: Type.STRING,
          description: "本文の内容に最もふさわしい、ビジネスに適した推奨件名",
        },
        isExtractedFromHeader: {
          type: Type.BOOLEAN,
          description: "メール文面内の「件名:」「Subject:」等から直接抽出された場合はtrue、本文から生成した場合はfalse",
        },
        variations: {
          type: Type.OBJECT,
          properties: {
            standard: {
              type: Type.STRING,
              description: "標準的で失礼のないビジネス件名（例: 【ご相談】来期システム刷新プロジェクトの進め方について）",
            },
            concise: {
              type: Type.STRING,
              description: "要件が一目でわかる簡潔な件名（例: 来期システム刷新MTGの日程調整）",
            },
            actionOriented: {
              type: Type.STRING,
              description: "相手のアクションを促す件名（例: 【要返信・10/10迄】システム刷新プロジェクト資料ご確認のお願い）",
            },
          },
          required: ["standard", "concise", "actionOriented"],
        },
        reasoning: {
          type: Type.STRING,
          description: "この件名を推薦・抽出した要点と理由の簡単な解説（1〜2文）",
        },
      },
      required: ["primary", "isExtractedFromHeader", "variations", "reasoning"],
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: "メール種別（例: 業務依頼, 日程調整, 報告・連絡, 相談・質問, 挨拶・御礼, 見積・請求, お詫び, その他）",
        },
        urgency: {
          type: Type.STRING,
          description: "緊急度判定 ('高' | '中' | '低')",
        },
        replyNeeded: {
          type: Type.BOOLEAN,
          description: "返信が必要と思われる内容か (true / false)",
        },
        deadline: {
          type: Type.STRING,
          description: "返信期限や提出期日等の記載があれば抽出（なければ空文字）",
        },
        summaryPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "本文の要約ポイント（2〜3項目の箇条書き）",
        },
      },
      required: ["category", "urgency", "replyNeeded", "deadline", "summaryPoints"],
    },
  },
  required: ["recipient", "subject", "metadata"],
};

app.post("/api/extract", async (req: Request, res: Response) => {
  try {
    const { emailText } = req.body;
    if (!emailText || typeof emailText !== "string" || !emailText.trim()) {
      res.status(400).json({ error: "メール本文を入力してください。" });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: "GEMINI_API_KEYが設定されていません。環境変数をご確認ください。",
      });
      return;
    }

    const systemInstruction = `あなたは日本のビジネスメール解析の専門家です。
与えられたメール文面を詳細に読み解き、以下の情報を正確に抽出・導出してください：
1. 宛先情報（宛先氏名、敬称、会社名、部署役職、正式な宛名表記、判定根拠となった本文スニペット）
   - 文頭の「〇〇様」「〇〇部長」等の宛名表記を最優先で特定してください。
   - 複数宛先がある場合は筆頭をrecipientにし、他をcoRecipientsに入れてください。
2. 件名（推奨件名、件名行からの抽出かどうかの判定、3つのバリエーション[標準・簡潔・アクション促進]、導出理由）
   - メール本文内に既に「件名:」や「Subject:」等の指定がある場合、それを認識しつつ、より伝わりやすい表現のバリエーションも提示してください。
   - 件名の記載がない場合は、メールの主旨・目的（依頼、報告、日程調整、確認など）を最も端的に表す魅力的な件名を生成してください。
3. 差出人情報（署名や名乗りから抽出）
4. メタ情報（カテゴリ、緊急度、返信要否、期日、要点箇条書き2〜3行）

必ず指定のJSONスキーマに従って出力してください。`;

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText: string | undefined;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `以下のメール文面から、宛先の人名と件名を自動抽出し、構造化データとして返してください：\n\n${emailText}`,
                },
              ],
            },
          ],
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: extractionSchema,
          },
        });
        responseText = response.text;
        if (responseText) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} call failed:`, err.message || err);
        lastError = err;
        // Continue to fallback model
      }
    }

    if (!responseText) {
      throw lastError || new Error("Gemini APIから応答が得られませんでした。");
    }

    const result = JSON.parse(responseText);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Extraction error:", error);
    res.status(500).json({
      error: error.message || "抽出処理中にエラーが発生しました。",
    });
  }
});

// Subject variation generator endpoint
app.post("/api/regenerate-subject", async (req: Request, res: Response) => {
  try {
    const { emailText, tone } = req.body;
    if (!emailText) {
      res.status(400).json({ error: "メール本文が必要です。" });
      return;
    }

    const prompt = `以下のメール本文に対して、指定のトーン「${tone || "ビジネス標準"}」に合わせた件名候補を3つ提案してください。
【メール本文】:
${emailText}

JSONフォーマットで回答してください:
{
  "candidates": [
    { "title": "件名1", "note": "特徴や使用シチュエーション" },
    { "title": "件名2", "note": "特徴や使用シチュエーション" },
    { "title": "件名3", "note": "特徴や使用シチュエーション" }
  ]
}`;

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText: string | undefined;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                candidates: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                    required: ["title", "note"],
                  },
                },
              },
              required: ["candidates"],
            },
          },
        });
        responseText = response.text;
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("件名候補の生成に失敗しました。");
    }

    const parsed = JSON.parse(responseText);
    res.json({ success: true, candidates: parsed.candidates || [] });
  } catch (error: any) {
    console.error("Subject regeneration error:", error);
    res.status(500).json({
      error: error.message || "件名生成中にエラーが発生しました。",
    });
  }
});

// Dev server or Production static serving
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);

async function startServer() {
  if (!isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
