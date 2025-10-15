# ユーザー削除機能の実装

## 概要
プロフィール画面からユーザーアカウントを安全に削除できる機能を実装。関連データの削除とエラーハンドリングを含む。

## 実装内容

### 1. Supabase Admin Client の作成
**ファイル**: `utils/supabase/admin.ts`（新規作成）

- `createAdminSupabase()` 関数を実装
- 環境変数 `SUPABASE_SERVICE_ROLE_KEY` を使用してAdmin権限のクライアントを生成
- `server-only` ディレクティブでサーバーサイド専用を保証

### 2. Server Action の実装
**ファイル**: `app/(dashboard)/profile/actions.ts`（新規作成）

- `deleteCurrentUser()` Server Action を実装
- 処理フロー：
  1. 現在のユーザーIDを取得（`getCurrentUserId()`）
  2. Prisma Transaction で関連データを削除
     - `Journal` テーブルの全レコード（userId でフィルタ）
     - `Profile` テーブルのレコード
  3. Supabase Auth Admin API でユーザー削除
  4. 成功時: `revalidatePath('/')` → `redirect('/')` でTOPへリダイレクト
  5. エラー時: `FormResponse` でエラーメッセージを返却

### 3. クライアントコンポーネントの作成
**ファイル**: `app/(dashboard)/profile/components/DeleteUserButton.tsx`（新規作成）

- `useActionState` で Server Action を呼び出し
- 削除確認用の `Dialog` コンポーネントを使用
- `useEffect` でエラー時に `useToast` でエラートーストを表示
- `isPending` 状態でボタンを無効化し、「削除中...」を表示

### 4. プロフィールページの更新
**ファイル**: `app/(dashboard)/profile/page.tsx`

- 既存の `Dialog` コンポーネントを削除
- `DeleteUserButton` コンポーネントに置き換え

### 5. 環境変数の追加
**ファイル**: `.env.example`

- `SUPABASE_SERVICE_ROLE_KEY` を追加（ドキュメント化）
- 実際の `.env` には Supabase ダッシュボードから取得した service_role キーを設定

## データフロー

```
[ユーザー]
  → [削除ボタンクリック]
  → [確認ダイアログ]
  → [Server Action: deleteCurrentUser]
      → Prisma Transaction: Journal削除 → Profile削除
      → Supabase Auth Admin API: ユーザー削除
      → 成功: redirect('/')
      → エラー: FormResponse返却
  → [クライアント]
      → 成功: TOPページへリダイレクト
      → エラー: エラートーストを表示

```

## セキュリティ考慮事項

- Admin Client は `server-only` で保護
- `SUPABASE_SERVICE_ROLE_KEY` は環境変数で管理（NEXT_PUBLIC_ プレフィックスは使用しない）
- Server Action で `getCurrentUserId()` を使用し、認証済みユーザーのみ削除可能
- Prisma の `deleteMany` で userId フィルタを適用し、他ユーザーのデータ削除を防止

## 必須設定

ユーザーは以下の環境変数を `.env` に追加する必要がある：

```bash
SUPABASE_SERVICE_ROLE_KEY=<Supabaseダッシュボードから取得>
```
