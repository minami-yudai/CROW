import React from "react";
import {
  Sparkles,
  ClipboardPaste,
  Trash2,
  FileText,
  CornerDownLeft,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { SAMPLE_EMAILS, SampleEmail } from "../data/sampleEmails";

interface EmailInputProps {
  emailText: string;
  onChangeText: (text: string) => void;
  onExtract: () => void;
  isLoading: boolean;
  onSelectSample: (sample: SampleEmail) => void;
  onPasteClipboard: () => void;
  onClear: () => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  emailText,
  onChangeText,
  onExtract,
  isLoading,
  onSelectSample,
  onPasteClipboard,
  onClear,
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = React.useState(false);

  const charCount = emailText.length;
  const lineCount = emailText ? emailText.split("\n").length : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isLoading && emailText.trim()) {
        onExtract();
      }
    }
  };
  

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header bar with sample actions */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800">
            メール文面を入力
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onPasteClipboard}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="クリップボードから貼り付け"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">貼り付け</span>
          </button>

          {emailText && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
              title="クリア"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">クリア</span>
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 p-4">
        <textarea
          value={emailText}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="解析したいメール本文をここに貼り付けるか入力してください..."
          className="w-full h-80 lg:h-[430px] p-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-none font-mono leading-relaxed"
          disabled={isLoading}
        />
      </div>

      {/* Bottom Footer with Status & Extract CTA */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-[10px] font-mono">
              Ctrl
            </kbd>
            +
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-[10px] font-mono">
              Enter
            </kbd>
            で実行
          </span>
        </div>

        <button
          type="button"
          onClick={onExtract}
          disabled={isLoading || !emailText.trim()}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            isLoading || !emailText.trim()
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-500/25 active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>AI解析中...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>メールチェック</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
