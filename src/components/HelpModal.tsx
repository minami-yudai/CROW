import React from "react";
import { X, HelpCircle, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                MailExtract AI ガイド &amp; 仕組み
              </h3>
              <p className="text-xs text-slate-500">
                Gemini 3.8 Flashによる高精度メール文面解析
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-indigo-900">
                メール本文から自動で宛名＆件名を抽出・生成
              </div>
              <p className="text-indigo-800 text-[11px] mt-1">
                既存の件名行（Subject:など）がある場合はそれを尊重しつつ洗練し、件名が無い場合でも本文の要件や目的・緊急度からビジネスに最適な件名を導き出します。
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-2">主な抽出項目</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700">宛先の氏名・敬称・役職・会社名</strong>
                  <p className="text-slate-500 text-[11px]">
                    文頭の「田中様」「〇〇株式会社 佐藤部長」などの表記から正式な宛名行までを分解構成。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700">最適な件名（3バリエーション）</strong>
                  <p className="text-slate-500 text-[11px]">
                    ① 標準ビジネス、② 簡潔・要件直球、③ アクション・要返信の3パターンを即時提示。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700">差出人・属性・要返信判定・要約</strong>
                  <p className="text-slate-500 text-[11px]">
                    送信者情報、メール種別、返信期限の有無、重要ポイントを箇条書きで把握。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>安心のセキュリティ設計</span>
            </div>
            <p className="text-[11px] text-slate-500">
              APIキーはブラウザに一切露出せず、安全なサーバーサイド（Express proxy）経由で最新のGeminiモデルへリクエストされます。入力されたメール文面が外部サーバーに無断保存されることはありません。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
