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
          {/* Sample dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSampleDropdown(!showSampleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60 transition-colors"
            >
              <span>サンプル文面</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showSampleDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSampleDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    試せるサンプル文面
                  </div>
                  {SAMPLE_EMAILS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        onSelectSample(sample);
                        setShowSampleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50/60 flex flex-col transition-colors border-b border-slate-50 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">
                          {sample.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {sample.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {sample.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

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

      {/* Quick sample chips */}
      <div className="px-4 py-2 bg-slate-50/30 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <span className="text-slate-400 shrink-0 text-[11px]">クイック挿入:</span>
        {SAMPLE_EMAILS.slice(0, 3).map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="shrink-0 px-2 py-1 rounded-md text-[11px] font-medium bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 border border-slate-200 transition-all shadow-2xs"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="relative flex-1 p-4">
        <textarea
          value={emailText}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="解析したいメール本文をここに貼り付けるか入力してください...&#10;&#10;例:&#10;株式会社ABC&#10;マーケティング部 田中 太郎 様&#10;&#10;いつも大変お世話になっております。...&#10;&#10;※文頭に件名が無くても、Geminiが本文内容から最適な件名を自動生成します。"
          className="w-full h-80 lg:h-[430px] p-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-none font-mono leading-relaxed"
          disabled={isLoading}
        />
      </div>

      {/* Bottom Footer with Status & Extract CTA */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{charCount.toLocaleString()} 文字</span>
          <span>•</span>
          <span>{lineCount} 行</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-[10px] font-mono">
              ⌘ / Ctrl
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
              <span>宛先と件名を自動抽出する</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
