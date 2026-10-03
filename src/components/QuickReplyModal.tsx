import React, { useState } from "react";
import { X, Send, Copy, Check } from "lucide-react";
import { ExtractionResult } from "../types";

interface QuickReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExtractionResult | null;
  onCopy: (text: string, label: string) => void;
}

export const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  isOpen,
  onClose,
  result,
  onCopy,
}) => {
  const [replyType, setReplyType] = useState<"accept" | "confirm" | "reschedule">(
    "accept"
  );
  const [senderName, setSenderName] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const { recipient, subject } = result;
  const replySubject = `Re: ${subject.primary}`;

  const getBodyTemplate = () => {
    const addressing = recipient.formattedAddressing;
    const signOff = senderName.trim() ? `\n\n--------------------\n${senderName}` : "";

    if (replyType === "accept") {
      return `${addressing}\n\nいつも大変お世話になっております。${senderName ? `${senderName}でございます。` : ""}\n\nご連絡いただき誠にありがとうございます。\nご提示いただきました内容・日程にて承知いたしました。\n\n詳細につきましては別途確認の上、改めてご連絡差し上げます。\n引き続き何卒よろしくお願い申し上げます。${signOff}`;
    } else if (replyType === "confirm") {
      return `${addressing}\n\nお世話になっております。${senderName ? `${senderName}です。` : ""}\n\nメールを拝見いたしました。\n内容について社内で確認の上、改めて本日中にご返答申し上げます。\n\n取り急ぎ、受信の確認とお礼まで申し上げます。${signOff}`;
    } else {
      return `${addressing}\n\nいつも大変お世話になっております。${senderName ? `${senderName}でございます。` : ""}\n\nご連絡いただき誠にありがとうございます。\n大変恐縮ながら、ご提示いただきました日程につきましては先約がございまして、調整が難しい状況でございます。\n\n誠に勝手ながら、以下の日程等で再調整をご検討いただくことは可能でしょうか。\n\n【再調整候補日時】\n・〇月〇日（〇）00:00〜00:00\n・〇月〇日（〇）00:00〜00:00\n\nお手数をおかけして誠に申し訳ございませんが、ご検討のほどよろしくお願い申し上げます。${signOff}`;
    }
  };

  const draftBody = getBodyTemplate();
  const fullEmail = `宛先: ${recipient.formattedAddressing}\n件名: ${replySubject}\n\n${draftBody}`;

  const handleCopy = () => {
    onCopy(fullEmail, "返信メール下書きをコピーしました");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                返信メール下書き作成
              </h3>
              <p className="text-xs text-slate-500">
                抽出した宛名と件名をセットした返信テンプレート
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Tone / Type toggle */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              返信タイプ:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReplyType("accept")}
                className={`py-2 px-2 rounded-xl border text-center font-medium transition-all ${
                  replyType === "accept"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                承諾・了承
              </button>
              <button
                type="button"
                onClick={() => setReplyType("confirm")}
                className={`py-2 px-2 rounded-xl border text-center font-medium transition-all ${
                  replyType === "confirm"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                受信確認・確認中
              </button>
              <button
                type="button"
                onClick={() => setReplyType("reschedule")}
                className={`py-2 px-2 rounded-xl border text-center font-medium transition-all ${
                  replyType === "reschedule"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                再調整・検討
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              あなたの氏名・署名（省略可）:
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="例: 山田 太郎（株式会社〇〇）"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Draft Preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono">
            <div>
              <span className="text-slate-400">宛先: </span>
              <span className="font-semibold text-slate-800">
                {recipient.formattedAddressing}
              </span>
            </div>
            <div>
              <span className="text-slate-400">件名: </span>
              <span className="font-semibold text-slate-800">
                {replySubject}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/60 whitespace-pre-wrap text-slate-700 font-sans text-xs leading-relaxed">
              {draftBody}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            閉じる
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>下書きをクリップボードにコピー</span>
          </button>
        </div>
      </div>
    </div>
  );
};
