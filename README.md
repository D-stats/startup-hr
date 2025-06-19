# Startup HR Engagement Platform

スタートアップ向けの社内エンゲージメント・評価システム

## 概要

このプラットフォームは、スタートアップ企業の従業員エンゲージメントを向上させ、チームの成長を支援するために設計されています。Slackとの緊密な連携により、日常業務の中で自然にフィードバックと評価の文化を醸成します。

## 主な機能

- 📊 **ピア評価（Kudos）システム** - チームメンバー間での感謝と評価
- ✅ **週次チェックイン** - 定期的な振り返りと目標設定
- 📈 **パルスサーベイ** - チームの状態を定期的に把握
- 💬 **Slack連携** - `/kudos`コマンドで簡単にフィードバック
- 📱 **リアルタイムダッシュボード** - エンゲージメント状況を可視化

## 技術スタック

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **External Integration**: Slack API

## 開始方法

### 前提条件

- Node.js v18.0.0以上
- Docker（Supabase Local用）
- npm v9.0.0以上

### セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **Supabaseのセットアップ**
   ```bash
   npx supabase init
   npx supabase start
   ```

3. **環境変数の設定**
   ```bash
   cp .env.example .env.local
   # .env.localを編集してSupabaseの認証情報を設定
   ```

4. **データベースのマイグレーション**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

## 開発ガイド

### 重要なドキュメント

- [CLAUDE.md](./CLAUDE.md) - AI開発者向けガイドライン
- [開発計画](./docs/development-plan.md) - 詳細な開発ToDo
- [アーキテクチャ](./docs/architecture.md) - システム設計
- [セットアップガイド](./docs/setup-guide.md) - 詳細な環境構築手順

### コマンド一覧

```bash
# 開発
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動

# コード品質
npm run lint         # ESLint実行
npm run type-check   # TypeScriptチェック
npm run format       # Prettierフォーマット
npm run validate     # 全チェック実行

# データベース
npm run prisma:generate  # Prisma Client生成
npm run prisma:migrate   # マイグレーション実行
npm run prisma:studio    # Prisma Studio起動

# Supabase
npm run supabase:start   # Supabase起動
npm run supabase:stop    # Supabase停止
npm run supabase:status  # 状態確認
```

## プロジェクト構造

```
.
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/             # ユーティリティ関数
│   ├── services/        # ビジネスロジック
│   ├── hooks/           # カスタムフック
│   └── types/           # TypeScript型定義
├── prisma/
│   ├── schema.prisma    # データベーススキーマ
│   └── migrations/      # マイグレーションファイル
├── public/              # 静的ファイル
└── docs/                # ドキュメント
```

## ライセンス

[MIT License](LICENSE)

## コントリビューション

コントリビューションは歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

## サポート

質問や問題がある場合は、[Issues](https://github.com/your-org/startup-hr/issues)でお知らせください。