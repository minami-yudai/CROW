import React, { useState } from "react";
import { Mail, Copy, Check, Sparkles, MessageSquare } from "lucide-react";
import { ExtractionResult } from "../types";

interface ResultDisplayProps {
  result: ExtractionResult | null;
  isLoading: boolean;
  onCopy: (text: string, label: string) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  isLoading,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    onCopy(text, "テキストをコピーしました");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-indigo-400/20 blur-md animate-pulse" />
        </div>
        <h3 className="mt-5 text-base font-semibold text-slate-800">
          Gemini がメールを解析中...
        </h3>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100/50">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">
          返信文案がここに表示されます
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 max-w-md leading-relaxed">
          左側の入力欄に本文を貼り付けて「メールチェック」ボタンを押してください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[460px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800">
            返信文案 / 要約
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleCopy(result.replyText)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? "コピー完了" : "全文をコピー"}</span>
        </button>
      </div>

      <div className="p-5 flex-1">
        <div className="w-full h-full min-h-[380px] p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-all font-sans">
          {result.replyText}
        </div>
      </div>
    </div>
  );
};
