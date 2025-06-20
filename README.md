# Startup HR Engagement Platform

スタートアップ向けの社内エンゲージメント・評価システム

## 概要

このプラットフォームは、スタートアップ企業の従業員エンゲージメントを向上させ、チームの成長を支援するために設計されています。Slackとの緊密な連携により、日常業務の中で自然にフィードバックと評価の文化を醸成します。

## 主な機能

- 📊 **ピア評価（Kudos）システム** - チームメンバー間での感謝と評価
- ✅ **カスタマイズ可能なチェックイン** - 頻度とテンプレートを柔軟に設定
- 📝 **評価管理システム** - 自己評価、マネージャーレビュー、360度評価
- 🎯 **OKR管理** - 目標設定と進捗トラッキング
- 💬 **Slack連携** - `/kudos`コマンドで簡単にフィードバック
- 📱 **リアルタイムダッシュボード** - エンゲージメント状況を可視化
- 📊 **ユーザーストーリー駆動開発** - ビジネス価値に基づく機能実装

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
   # 推奨: 事前チェック付き起動
   npm run dev:safe

   # または通常起動
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
npm run dev:safe     # 事前チェック付き開発サーバー起動（推奨）
npm run dev          # 通常の開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run pre-flight   # 環境の事前チェック

# コード品質
npm run lint         # ESLint実行
npm run type-check   # TypeScriptチェック
npm run format       # Prettierフォーマット
npm run validate     # 全チェック実行

# テスト
npm test             # E2Eテスト実行
npm run test:headed  # ブラウザ表示付きテスト
npm run test:stories # ユーザーストーリーテスト

# ユーザーストーリー
npm run validate:stories  # ストーリー検証レポート生成
npm run report:stories    # ストーリーテストレポート

# データベース
npm run prisma:generate  # Prisma Client生成
npm run prisma:migrate   # マイグレーション実行
npm run prisma:studio    # Prisma Studio起動
npm run prisma:reset     # DBリセット（開発環境のみ）

# Supabase
npm run supabase:start   # Supabase起動
npm run supabase:stop    # Supabase停止
npm run supabase:status  # 状態確認

# ユーティリティ
npm run check:ports  # ポート競合チェック
npm run health       # ヘルスチェック
npm run verify       # サーバー検証
```

## プロジェクト構造

```
.
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/             # ユーティリティ関数
│   │   └── user-stories/ # ユーザーストーリー管理
│   ├── services/        # ビジネスロジック
│   ├── stores/          # Zustand状態管理
│   ├── hooks/           # カスタムフック
│   └── types/           # TypeScript型定義
├── tests/
│   └── e2e/
│       └── stories/     # ストーリーベーステスト
├── prisma/
│   ├── schema.prisma    # データベーススキーマ
│   └── migrations/      # マイグレーションファイル
├── scripts/             # ユーティリティスクリプト
├── public/              # 静的ファイル
└── docs/                # ドキュメント
```

## ライセンス

[MIT License](LICENSE)

## コントリビューション

コントリビューションは歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

## 開発上の注意

### スキーマ変更時の手順

1. Prismaスキーマを変更
2. `npx prisma migrate dev --name 変更内容`
3. `npx prisma generate`
4. `npm run type-check`で型エラーを確認
5. 関連するコードを全て更新

詳細は[CLAUDE.md](./CLAUDE.md)の「スキーマ不一致エラーの防止と対処」セクションを参照。

## サポート

質問や問題がある場合は、[Issues](https://github.com/your-org/startup-hr/issues)でお知らせください。
