# 利用規約同意チェック機能の実装

## 概要
新規ユーザーが初回ログイン後、利用規約に同意するまでアプリケーションの利用を制限する機能を実装。

## 背景
- Supabaseトリガーで新規ユーザー作成時に `profiles` テーブルにレコードが自動作成される
- 初期状態では `terms_accepted_at` は NULL
- 利用規約同意前はアプリケーションを利用できないようにする必要がある

## 実装内容

### 1. Middleware での利用規約同意チェック
**ファイル**: `utils/supabase/middleware.ts`

**処理フロー**:
1. ユーザーの認証状態をチェック
2. 認証済みユーザーの場合、アクセスパスが公開パスでないかチェック
   - 公開パス: `/`, `/login`, `/auth/*`, `/confirm`, `/error`
3. 保護されたパスの場合、Supabaseクライアントで `profiles` テーブルをクエリ
4. `terms_accepted_at` が NULL の場合、`/confirm` にリダイレクト

**実装のポイント**:
- Supabaseクライアントを直接使用（middlewareでPrismaは非推奨のため）
- cookieの整合性を保つため、Supabaseのレスポンスオブジェクトをそのまま返す

### 2. バリデーションスキーマの作成
**ファイル**: `lib/validations/profile.ts`（新規作成）

- Zodスキーマで入力値をバリデーション
- `businessName`: 1文字以上100文字以下の必須項目
- `termsAccepted`: 必ず `true` であることを要求

### 3. Server Action の実装
**ファイル**: `app/(auth)/confirm/actions.ts`（新規作成）

**`acceptTerms()` 関数**:
- FormDataから `businessName` と `termsAccepted` を取得
- Zodスキーマでバリデーション
- Prismaで Profile を更新
  - `businessName`: ユーザー入力値
  - `termsAcceptedAt`: 現在時刻
- 成功時: `revalidatePath('/')` → `redirect('/home')`
- エラー時: `FormResponse` でエラーメッセージを返却

### 4. 確認ページのクライアントコンポーネント化
**ファイル**: `app/(auth)/confirm/page.tsx`

**UI構成**:
- 事業所名・屋号の入力フィールド（必須）
- 利用規約同意のチェックボックス（必須）
- アカウント登録ボタン（同意しないと無効化）

**実装のポイント**:
- `useActionState` で Server Action を呼び出し
- `useState` でチェックボックスの状態を管理
- `isPending` で送信中は入力を無効化
- エラー時は `useToast` でトーストを表示

## データフロー

```
[新規ユーザー登録]
  ↓
[Supabase Trigger] → Profile作成（terms_accepted_at=NULL）
  ↓
[初回ログイン] → auth/callback → /home へリダイレクト試行
  ↓
[Middleware] → terms_accepted_at=NULL?
  ↓ Yes
[/confirm へリダイレクト]
  ↓
[ユーザー] → 事業所名入力・利用規約同意
  ↓
[acceptTerms Action]
  ↓
[Profile更新] → businessName, termsAcceptedAt=NOW()
  ↓
[/home へリダイレクト]
  ↓
[Middleware] → terms_accepted_at=NOT NULL
  ↓
[通常アクセス許可]
```

## セキュリティ考慮事項

- Middleware でのチェックにより、クライアント側の回避を防止
- Server Action で再度バリデーションを実施（二重チェック）
- `getCurrentUserId()` で認証済みユーザーのみ更新可能
- Prismaの `where` 句で自分のProfileのみ更新可能

## 影響範囲

### 既存ユーザー
- `terms_accepted_at` が NULL の既存ユーザーは `/confirm` にリダイレクトされる
- 既に同意済み（NOT NULL）のユーザーには影響なし

### 新規ユーザー
- 初回ログイン後、必ず `/confirm` で利用規約に同意する必要がある
- 同意するまでアプリケーションの他のページにアクセスできない

## テスト項目

- [ ] 新規ユーザー登録後、/confirm にリダイレクトされること
- [ ] 事業所名未入力で送信するとエラーが表示されること
- [ ] 利用規約未同意で送信ボタンが無効化されること
- [ ] 正常に送信すると /home にリダイレクトされること
- [ ] 同意後は保護されたページにアクセスできること
- [ ] 同意済みユーザーは /confirm にリダイレクトされないこと
