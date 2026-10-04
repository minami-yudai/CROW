# MailExtract AI - メール宛先・件名 自動抽出ツール

Gemini APIを活用し、メール本文から宛先の氏名・役職・会社名と、最適な件名（標準・簡潔・要返信など）を高精度に自動抽出・提案するWebアプリケーションです。

---

## 🚀 ローカル環境での動かし方

### 前提条件
- **Node.js**: v18.0.0 以上（v20 以上推奨）
- **npm** または **pnpm / yarn**
- **Google Gemini APIキー**（[Google AI Studio](https://aistudio.google.com/app/apikey) にて無料で取得可能）

---

### ステップ1: 依存関係のインストール

プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
npm install
```

---

### ステップ2: 環境変数の設定（APIキー）

1. `.env.example` をコピーして `.env` ファイルを作成します。

```bash
cp .env.example .env
```

2. 作成した `.env` ファイルを開き、取得したGemini APIキーを設定します。

```env
GEMINI_API_KEY="ここに取得したGemini_APIキーを貼り付け"
```

> **注意**: `.env` ファイルには秘密情報が含まれるため、Gitのコミット（GitHub）には含めないようにしてください（`.gitignore` に記載されています）。

---

### ステップ3: 開発サーバーの起動

以下のコマンドを実行してサーバーを起動します。

```bash
npm run dev
```

起動に成功すると、ターミナルに以下のように表示されます。
```
Server listening on http://0.0.0.0:3000
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリが利用できます。

---

### 本番用ビルドと起動（オプション）

本番モードで動作確認する場合は以下を実行します。

```bash
# ビルド
npm run build

# 本番サーバー起動
npm start
```

---

## 🛠 技術スタック
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, tsx
- **AI Engine**: Google GenAI SDK (`@google/genai`), Gemini 3.8 Flash
