# 会計管理アプリ

Next.js 15を使用して構築された会計管理アプリケーションです。認証にはSupabase、データ管理にはPrismaとPostgreSQLを使用しています。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router, React 19)
- **データベース**: PostgreSQL (Supabase) + Prisma ORM
- **認証**: Supabase Auth with Google OAuth
- **スタイリング**: Tailwind CSS, shadcn/ui
- **Linting/Formatting**: Biome
- **UIライブラリ**: Radix UI primitives, lucide-react icons, sonner, recharts

## はじめに

### 前提条件

- Node.js
- pnpm
- PostgreSQLデータベース

### 環境変数

プロジェクトルートに`.env`ファイルを作成し、以下の変数を設定してください:

```env
DATABASE_URL="your-supabase-pooled-connection-string"
DIRECT_URL="your-supabase-direct-connection-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### インストール

```bash
# 依存関係のインストール
pnpm install

# Prisma Clientの生成
pnpm db:generate

# データベースにスキーマをプッシュ (開発環境)
pnpm db:push

# または、マイグレーションの実行 (本番環境推奨)
pnpm db:migrate
```

### 開発

```bash
# Turbopackで開発サーバーを起動
pnpm dev

# デバッグモードで起動 (SQLクエリを表示)
pnpm dev:debug

# Prisma Studioを開いてデータベースを表示/編集
pnpm db:studio
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 利用可能なスクリプト

### 開発
- `pnpm dev` - Turbopackで開発サーバーを起動
- `pnpm dev:debug` - SQLクエリログ付きで開発サーバーを起動
- `pnpm build` - 本番用ビルド
- `pnpm start` - 本番サーバーを起動
- `pnpm build:check` - ビルドしてローカルで本番環境をテスト

### Linting & Formatting (Biome)
- `pnpm lint` - LintとFormatの問題をチェック
- `pnpm lint:fix` - LintとFormatの問題を自動修正
- `pnpm format` - 全ファイルをフォーマット

### データベース (Prisma)
- `pnpm db:generate` - Prisma Clientを生成
- `pnpm db:push` - スキーマ変更をデータベースにプッシュ (マイグレーションなし)
- `pnpm db:migrate` - 新しいマイグレーションを作成して適用
- `pnpm db:deploy` - マイグレーションをデプロイ (本番環境)
- `pnpm db:status` - マイグレーションステータスを確認
- `pnpm db:studio` - Prisma Studio GUIを開く
- `pnpm db:seed:accounts` - 勘定科目シードスクリプトを実行

## プロジェクト構成

```
app/
  (auth)/                    # 認証ページ
  (dashboard)/               # 認証が必要なページ
  (static)/                  # 静的ページ
  layout.tsx                 # ルートレイアウト
  page.tsx                   # ランディングページ

components/
  ui/                        # shadcn/ui コンポーネント (button, card, dialog, table等)
  AppLayout.tsx              # メインアプリレイアウトラッパー

lib/
  actions.ts                 # CRUD操作用のServer Actions
  db.ts                      # Prismaクライアントシングルトン

utils/
  supabase/                  # Supabaseクライアントユーティリティ

prisma/
  schema.prisma              # データベーススキーマ (Journal, Account, Profileモデル)
  migrations/                # マイグレーションファイル
  seed/                      # シードスクリプト
    accounts.ts              # 勘定科目マスタデータのシード
```

## 機能

### 会計コア機能
- **複式簿記**: 借方/貸方勘定を含む完全な仕訳入力管理
- **勘定科目マスタ管理**: コードとカテゴリを含む包括的な勘定科目表
- **収支追跡**: 取引タイプ(収入/支出)による取引追跡
- **総勘定元帳表示**: 勘定科目カテゴリ別に整理された元帳表示
- **税務管理**: 複数の税区分 (10%, 8%, 非課税, 不課税, 免税)

### データモデル
- **Journal**: 日付、タイプ、借方/貸方勘定、金額、支払方法、税区分、メタデータを含む取引エントリ
- **Account**: コード、名称、カテゴリ(資産/負債/純資産/収益/費用)、レポートタイプ(BS/PL)を含む勘定科目表
- **Profile**: ユーザーの事業情報と利用規約の同意

### UI/UX機能
- Supabase経由の**Google OAuth認証**
- デスクトップとモバイルに最適化された**レスポンシブデザイン**
- rechartsによる**データ可視化** (分析用)
- ユーザーフィードバック用の**トースト通知**
- React Hook FormとZodによる**フォーム検証**
- Radix UI primitivesを使用した**アクセシブルなコンポーネント**

## デザインシステム

### デザイントークン
このプロジェクトは、一貫したテーマを実現するためにデザイントークンを使用しています。ハードコードされた色ではなく、常にセマンティックな色クラスを使用してください。

**必須トークン**: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `border-border`, `bg-card`, `bg-muted`, `bg-accent`, `bg-destructive`, `bg-success`, `ring-ring`

利用可能な全トークンは`app/globals.css`を参照してください。

### UIコンポーネントガイドライン
- UI要素には**常にshadcn/uiコンポーネント**を使用 (button, card, dialog, table, form等)
- shadcn/uiコンポーネントが存在する場合、**カスタム実装を作成しない**
- 新しいコンポーネントのインストール: `npx shadcn@latest add [component-name]`

## 開発ガイドライン
- **デフォルトでServer Components**: "use client"は必要な場合のみ使用 (状態管理、ブラウザAPI、重いUI)
- **サーバーロジックの分離**: データ取得にはローダーと別パッケージを使用
- **変更操作にはServer Actions**: "use server"は副作用のある操作にのみ使用
- **デザイントークンルールに従う**: ハードコードされたTailwindカラーは使用しない
- CLAUDE.mdで定義された**アーキテクチャパターンに従う**

## 詳細情報

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
- [shadcn/ui コンポーネント](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ライセンス

プライベートプロジェクト
