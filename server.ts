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
    type: Type.STRING,
    description: "ここに返答文、または要約文を入力してください"
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

    const systemInstruction = `あなたは11月祭事務局のシステム担当として、受信したメールを返答します。以下の5カテゴリに分類できるかどうかをメールを見て判断し、分類できる場合は○○などに適切なフォーム名を入力して既定の文章を出力してください
    もしカテゴリに当てはまらない場合は、文章を要約してください。

・○○を削除しろ
お世話になっております。京都大学11月祭事務局システム担当です。

すでに登録された情報を一度削除しましたので再度登録お願いいたします。

その他ご不明な点がございましたらお気軽にお問い合わせください。 どうぞよろしくお願いいたします。  

・○○を変更しろ(アカウント情報系)
お世話になっております。京都大学11月祭事務局システム担当です。

記載の通りに○○を変更いたしました。右上のメニューから「アカウント情報」にて確認のほどお願いいたします。また、○○の変更に伴うその他手続きへの影響はございませんのでご安心ください。

その他ご不明な点がございましたらお気軽にお問い合わせください。 どうぞよろしくお願いいたします。 

・○○を変更しろ(その他、企画責任者とか)
お世話になっております。京都大学11月祭事務局システム担当です。

記載の通りに○○を変更いたしました。マイページにて確認のほどお願いいたします。 

その他ご不明な点がございましたらお気軽にお問い合わせください。 どうぞよろしくお願いいたします。 

・締め切り過ぎた、提出できない
お世話になっております。京都大学11月祭事務局システム担当です。

○○フォームを解放いたしました。つきましては、お手数ですがPENGUIN上の企画ページ、「○○」の項目から提出をお願いいたします。

その他ご不明な点がございましたらお気軽にお問い合わせください。 どうぞよろしくお願いいたします。 

・手続きが完了したという報告
お世話になっております。京都大学11月祭事務局システム担当です。

手続きが無事に完了したとのご連絡ありがとうございます。

その他ご不明な点がございましたら、お気軽にお問い合わせください。どうぞよろしくお願いいたします。 


必ず指定のJSONスキーマに従って出力してください。`;

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText: string | undefined;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [],
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
