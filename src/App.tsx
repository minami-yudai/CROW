import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { EmailInput } from "./components/EmailInput";
import { ResultDisplay } from "./components/ResultDisplay";
import { Toast } from "./components/Toast";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { ExtractionResult, ExtractionHistoryItem } from "./types";

const HISTORY_STORAGE_KEY = "crow_history_v1";

export default function App() {
  const [emailText, setEmailText] = useState<string>("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ExtractionHistoryItem[]>([]);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(
            parsed.filter(
              (item) => item && item.result && typeof item.result.replyText === "string"
            )
          );
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (text: string, extResult: ExtractionResult) => {
    try {
      const newItem: ExtractionHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        emailText: text,
        result: extResult,
      };
      const updated = [newItem, ...history.filter((h) => h.emailText !== text)].slice(0, 20);
      setHistory(updated);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleExtract = async () => {
    if (!emailText.trim()) {
      showToast("メール文面を入力してください", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailText }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "処理に失敗しました");
      }

      setResult(data.data);
      saveToHistory(emailText, data.data);
      showToast("メールチェックが完了しました！");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "エラーが発生しました", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setEmailText(text);
        showToast("クリップボードから貼り付けました");
      } else {
        showToast("クリップボードが空です", "error");
      }
    } catch {
      showToast("クリップボードへのアクセスが許可されていません", "error");
    }
  };

  const handleClear = () => {
    setEmailText("");
    setResult(null);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(label);
  };

  const handleSelectHistoryItem = (item: ExtractionHistoryItem) => {
    setEmailText(item.emailText);
    setResult(item.result);
    showToast("履歴から復元しました");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    showToast("履歴をすべて削除しました");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Email Input (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col">
            <EmailInput
              emailText={emailText}
              onChangeText={setEmailText}
              onExtract={handleExtract}
              isLoading={isLoading}
              onPasteClipboard={handlePasteClipboard}
              onClear={handleClear}
            />
          </div>

          {/* Right Column: Result Display (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col">
            <ResultDisplay
              result={result}
              isLoading={isLoading}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <Toast message={toastMessage} type={toastType} />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
