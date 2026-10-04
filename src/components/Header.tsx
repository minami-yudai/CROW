import React from "react";
import { Mail, Sparkles, History, HelpCircle, ShieldCheck } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                CROW
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Check & Reply for Office Webmail
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            title="抽出履歴"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span>履歴</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white leading-tight">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
