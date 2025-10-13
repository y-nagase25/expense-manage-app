# ログインページ認証チェック実装

## 変更概要
ログインページに認証チェック機能を追加し、既にログイン済みのユーザーが/loginにアクセスした場合に/homeへ自動リダイレクトする機能を実装。

## 変更ファイル

### 1. lib/auth.ts
**追加**: `getUser()` 関数
```typescript
export async function getUser(): Promise<User | null>
```
- Supabaseセッションから現在のユーザー情報を取得
- ログインしていない場合はnullを返す
- Server Component専用（server-only）

**リファクタリング**: `getCurrentUserId()`
- 内部で`getUser()`を使用するよう変更
- エラーハンドリングは維持

### 2. app/(auth)/login/page.tsx
**変更前**: Client Component（use client）
- 全ての処理をクライアント側で実行
- 認証チェック未実装

**変更後**: Server Component（async function）
```typescript
const LoginPage = async () => {
    const user = await getUser();
    if (user) {
        redirect('/home');
    }
    return <LoginForm />;
};
```
- サーバー側で認証状態をチェック
- ログイン済みの場合は即座にリダイレクト
- 未ログインの場合はLoginFormコンポーネントを表示

### 3. app/(auth)/login/components/LoginForm.tsx（新規作成）
**役割**: Client Component
- Google OAuthログイン処理
- ローディング状態管理
- エラーハンドリング（LoginErrorHandlerとの連携）
- UI表示（Card、Button、Imageなど）

**抽出元**: 元のlogin/page.tsxからインタラクティブな部分を分離

## アーキテクチャパターン

### 責任分離
- **Server Component (page.tsx)**: 認証チェック、リダイレクト、静的コンテンツ
- **Client Component (LoginForm.tsx)**: ユーザーインタラクション、状態管理、ブラウザAPI使用

### メリット
1. **パフォーマンス向上**: 認証チェックがサーバー側で実行され、不要なクライアントバンドルを削減
2. **セキュリティ**: サーバー側で認証状態を検証
3. **保守性**: 関心の分離により、各コンポーネントの役割が明確
4. **Next.js 15ベストプラクティス準拠**: RSC（React Server Components）パターンの適切な使用

## データフロー
```
ユーザーが/loginにアクセス
↓
Server Component (page.tsx) が実行
↓
getUser() で認証状態をチェック
↓
├─ ログイン済み → redirect('/home')
└─ 未ログイン → <LoginForm /> を表示
   ↓
   Client Component で OAuth処理
   ↓
   ログイン成功 → /auth/callback → /home
```

## テスト観点
- [ ] 未ログインユーザーが/loginにアクセス → ログインフォームが表示される
- [ ] ログイン済みユーザーが/loginにアクセス → /homeにリダイレクトされる
- [ ] ログインフォームからGoogle OAuthログインが正常に動作する
- [ ] エラーハンドリングが正常に動作する（トースト表示）

## 関連する設計原則（CLAUDE.md準拠）
- server-onlyの適切な使用
- RSCとCCの責任分離
- データ取得はServer Componentで実行
- "use client"は必要最小限の範囲で使用
