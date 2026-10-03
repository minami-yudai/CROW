import React, { useState } from "react";
import { X, Sparkles, Copy, Check, Loader2, RefreshCw } from "lucide-react";

interface SubjectCandidate {
  title: string;
  note: string;
}

interface SubjectRegeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailText: string;
  onSelectSubject: (subject: string) => void;
  onCopy: (text: string, label: string) => void;
}

const TONES = [
  { id: "business", label: "社外ビジネス標準", desc: "丁寧で礼儀正しい一般的な取引先向け" },
  { id: "internal", label: "社内・チーム向け", desc: "簡潔で要件がパッと伝わる社内連絡向け" },
  { id: "executive", label: "役員・重要決裁者向け", desc: "結論重視・格式の高いエグゼクティブ向け" },
  { id: "urgent", label: "至急・要確認アラート", desc: "期日や対応必要性を最前面に押し出す" },
  { id: "bilingual", label: "英語併記（日・英）", desc: "グローバル案件向け日英ハイブリッド表記" },
];

export const SubjectRegeneratorModal: React.FC<SubjectRegeneratorModalProps> = ({
  isOpen,
  onClose,
  emailText,
  onSelectSubject,
  onCopy,
}) => {
  const [selectedTone, setSelectedTone] = useState("business");
  const [customTone, setCustomTone] = useState("");
  const [candidates, setCandidates] = useState<SubjectCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (toneText?: string) => {
    setIsLoading(true);
    setCandidates([]);
    try {
      const toneLabel =
        toneText ||
        (customTone.trim()
          ? customTone
          : TONES.find((t) => t.id === selectedTone)?.label || "ビジネス標準");

      const res = await fetch("/api/regenerate-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText, tone: toneLabel }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "生成に失敗しました");
      }
      setCandidates(data.candidates || []);
    } catch (err: any) {
      console.error(err);
      onCopy("", `エラー: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCandidate = (candidate: SubjectCandidate, idx: number) => {
    onCopy(candidate.title, "件名をコピーしました");
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                件名のトーン別 再生成
              </h3>
              <p className="text-xs text-slate-500">
                相手やシチュエーションに合わせて異なる切り口の件名を提案します
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
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              希望するトーンを選択:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => {
                    setSelectedTone(tone.id);
                    setCustomTone("");
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedTone === tone.id && !customTone
                      ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 font-semibold text-indigo-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-semibold">{tone.label}</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    {tone.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              または独自のトーンを指定:
            </label>
            <input
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              placeholder="例: 親しみやすい取引先向け、英語表記メイン、など"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>このトーンで件名を提案させる</span>
              </>
            )}
          </button>

          {/* Results list */}
          {candidates.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="text-xs font-bold text-slate-700">
                提案された件名候補:
              </div>
              {candidates.map((cand, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {cand.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyCandidate(cand, idx)}
                        className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="コピー"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSubject(cand.title);
                          onClose();
                        }}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        適用
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500">{cand.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
