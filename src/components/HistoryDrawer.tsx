import React from "react";
import { X, Clock, Trash2, ArrowRight, MessageSquare, FileText } from "lucide-react";
import { ExtractionHistoryItem } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ExtractionHistoryItem[];
  onSelectHistoryItem: (item: ExtractionHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">チェック履歴</h3>
              <p className="text-[11px] text-slate-500">
                最近チェックしたメール（最大20件）
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="履歴をすべて削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
              <Clock className="w-8 h-8 text-slate-300 mb-2" />
              <p>チェック履歴はまだありません</p>
              <p className="text-[11px] text-slate-400 mt-1">
                メールチェック後、自動的にここに保存されます
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group flex flex-col gap-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{formatDate(item.timestamp)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{item.emailText}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{item.result.replyText}</span>
                </div>

                <div className="mt-1 flex items-center justify-end text-[11px] text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>再読み込み</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
