import React, { useState } from "react";
import {
  User,
  Mail,
  Copy,
  Check,
  Building,
  Sparkles,
  Calendar,
  AlertTriangle,
  FileCheck2,
  RefreshCw,
  Send,
  MessageSquare,
  Users,
  Lightbulb,
} from "lucide-react";
import { ExtractionResult } from "../types";

interface ResultDisplayProps {
  result: ExtractionResult | null;
  isLoading: boolean;
  onCopy: (text: string, label: string) => void;
  onOpenRegenerateSubject: () => void;
  onOpenQuickReply: () => void;
  onSelectSamplePrompt: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  isLoading,
  onCopy,
  onOpenRegenerateSubject,
  onOpenQuickReply,
  onSelectSamplePrompt,
}) => {
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<
    "standard" | "concise" | "actionOriented"
  >("standard");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopy(text, label);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
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

  const { recipient, subject, sender, metadata } = result;

  const currentSubjectText =
    selectedSubjectTab === "standard"
      ? subject.variations.standard
      : selectedSubjectTab === "concise"
      ? subject.variations.concise
      : subject.variations.actionOriented;

  const urgencyBadgeColor =
    metadata.urgency === "高"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : metadata.urgency === "中"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="flex flex-col gap-4">
      {/* CARD 1: 宛先情報 (Recipient) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              宛先情報 (To)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  recipient.fullName,
                  "recipient-name",
                  "宛先の氏名をコピーしました"
                )
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors"
              title="氏名のみコピー"
            >
              {copiedKey === "recipient-name" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>氏名コピー</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  recipient.formattedAddressing,
                  "recipient-full",
                  "正式な宛名行をコピーしました"
                )
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
              title="会社名・役職付きの正式な宛名表記をコピー"
            >
              {copiedKey === "recipient-full" ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>正式宛名コピー</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          {/* Main Full Name */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {recipient.fullName}
            </span>
            {recipient.honorific && (
              <span className="text-base font-semibold text-slate-600">
                {recipient.honorific}
              </span>
            )}
          </div>

          {/* Org & Dept */}
          {(recipient.organization || recipient.department) && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {recipient.organization && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {recipient.organization}
                </span>
              )}
              {recipient.department && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                  {recipient.department}
                </span>
              )}
            </div>
          )}

          {/* Formatted Addressing Preview */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
            <div className="text-slate-500">
              <span className="font-semibold text-slate-700">正式宛名表記:</span>{" "}
              <span className="text-slate-800 font-mono">
                {recipient.formattedAddressing}
              </span>
            </div>
          </div>

          {/* Context Snippet */}
          {recipient.rawTextSnippet && (
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <span className="font-medium text-slate-500">本文抽出箇所:</span>
              <span className="italic truncate bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-600">
                「{recipient.rawTextSnippet}」
              </span>
            </div>
          )}

          {/* Co-recipients if any */}
          {recipient.coRecipients && recipient.coRecipients.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">その他の宛先・CC:</span>
              <div className="flex flex-wrap gap-1">
                {recipient.coRecipients.map((co, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                  >
                    {co}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: 件名 (Subject Line) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              件名 (Subject)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200/50">
              {subject.isExtractedFromHeader
                ? "文頭より抽出・最適化"
                : "本文からAI自動生成"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenRegenerateSubject}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="トーンを変えて再生成"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">再生成</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  currentSubjectText,
                  "subject-text",
                  "選択中の件名をコピーしました"
                )
              }
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
            >
              {copiedKey === "subject-text" ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>件名をコピー</span>
            </button>
          </div>
        </div>

        {/* Primary Subject Line Highlight */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/80">
          <div className="text-[11px] font-semibold text-blue-700 tracking-wider uppercase mb-1">
            選択された件名:
          </div>
          <div className="text-lg font-bold text-slate-900 tracking-tight select-all">
            {currentSubjectText}
          </div>
          {subject.reasoning && (
            <div className="mt-2 text-xs text-slate-600 flex items-start gap-1.5 pt-2 border-t border-blue-100/60">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{subject.reasoning}</span>
            </div>
          )}
        </div>

        {/* 3 Variations Tabs */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            シチュエーション別バリエーション:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Standard */}
            <button
              type="button"
              onClick={() => setSelectedSubjectTab("standard")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSubjectTab === "standard"
                  ? "bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700 mb-1">
                <span>① 標準ビジネス</span>
                {selectedSubjectTab === "standard" && (
                  <Check className="w-3 h-3 text-indigo-600" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800 line-clamp-2">
                {subject.variations.standard}
              </div>
            </button>

            {/* Concise */}
            <button
              type="button"
              onClick={() => setSelectedSubjectTab("concise")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSubjectTab === "concise"
                  ? "bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-700 mb-1">
                <span>② 簡潔・要件直球</span>
                {selectedSubjectTab === "concise" && (
                  <Check className="w-3 h-3 text-blue-600" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800 line-clamp-2">
                {subject.variations.concise}
              </div>
            </button>

            {/* Action Oriented */}
            <button
              type="button"
              onClick={() => setSelectedSubjectTab("actionOriented")}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedSubjectTab === "actionOriented"
                  ? "bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-700 mb-1">
                <span>③ アクション・要返信</span>
                {selectedSubjectTab === "actionOriented" && (
                  <Check className="w-3 h-3 text-amber-600" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800 line-clamp-2">
                {subject.variations.actionOriented}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* CARD 3: メール属性・要約・差出人 (Metadata & Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Attributes & Sender */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-slate-400" />
              <span>メール属性・判定</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">種別カテゴリ</span>
                <span className="font-semibold text-slate-800">
                  {metadata.category}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">緊急度</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${urgencyBadgeColor}`}
                >
                  {metadata.urgency === "高" && (
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                  )}
                  {metadata.urgency}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">要返信フラグ</span>
                <span
                  className={`font-semibold ${
                    metadata.replyNeeded ? "text-amber-600" : "text-slate-600"
                  }`}
                >
                  {metadata.replyNeeded ? "● 返信が必要" : "不要 / 共有のみ"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">期日・締め切り</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {metadata.deadline || "明記なし"}
                </span>
              </div>
            </div>

            {/* Sender */}
            {sender?.name && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 block text-[10px]">差出人 (From)</span>
                <div className="font-semibold text-slate-800">
                  {sender.name}
                  {sender.organization && (
                    <span className="font-normal text-slate-500 ml-2">
                      ({sender.organization})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Key Summary Points */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>本文の要約ポイント</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            {metadata.summaryPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ACTION BAR: Quick Reply Draft & Full Export */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">
            返信メールの下書きを作成しますか？
          </div>
          <div className="text-xs text-slate-300">
            抽出した宛名と件名をセットした返信テンプレートをワンクリックで準備
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenQuickReply}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>返信下書きを作成</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const fullBundle = `【宛先】${recipient.formattedAddressing}\n【件名】${currentSubjectText}\n【種別】${metadata.category}\n【要点】\n${metadata.summaryPoints.map((p) => `・${p}`).join("\n")}`;
              handleCopy(fullBundle, "all-bundle", "全抽出データをコピーしました");
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
            title="宛名・件名・要約をまとめてコピー"
          >
            {copiedKey === "all-bundle" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">全情報コピー</span>
          </button>
        </div>
      </div>
    </div>
  );
};
