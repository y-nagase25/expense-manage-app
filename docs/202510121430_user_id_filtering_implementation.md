# ユーザーIDフィルタリング実装

## 変更日時
2025-10-12

## 概要
仕訳データのCRUD操作に対して、ログインユーザーIDによるフィルタリングを実装し、マルチテナント対応とセキュリティを強化。

## 変更内容

### 1. 共通認証モジュールの作成
**ファイル:** `lib/auth.ts`（新規）

```typescript
export async function getCurrentUserId(): Promise<string>
```

- SupabaseセッションからログインユーザーIDを取得
- 未ログイン時はエラーをスロー
- `server-only`ディレクティブでサーバーサイド専用を保証

### 2. データ取得ロジックの修正
**ファイル:** `lib/loaders/journals.ts`

#### `getJournals()`
- `where: { userId }`条件を追加
- `orderBy: { date: 'desc' }`で新しい順にソート
- ログインユーザーの仕訳のみ取得

#### `getSerializedJournal()`
- `findUnique`→`findFirst`に変更（複合条件対応）
- `where: { id, userId }`で二重フィルタリング

### 3. Server Actionsの修正
**ファイル:** `app/(dashboard)/journals/actions.ts`

#### `getJournalById()`
- `findUnique`→`findFirst`に変更
- `where: { id, userId }`で所有者確認

#### `createJournalEntry()`
- 変更なし（既にuserIdを保存）

#### `updateJournalEntry()`
- `update`→`updateMany`に変更（複合条件対応）
- `where: { id, userId }`で所有者確認
- 更新件数0件の場合はエラーレスポンス

#### `deleteJournalEntry()`
- `delete`→`deleteMany`に変更（複合条件対応）
- `where: { id, userId }`で所有者確認
- 削除件数0件の場合は警告ログ

## セキュリティ効果

### Before
- 仕訳IDのみで取得・更新・削除が可能
- 他ユーザーのデータにアクセス可能な脆弱性

### After
- 全操作でログインユーザーIDを検証
- 他ユーザーのデータは完全に隔離
- IDを推測されても自分のデータ以外は操作不可

## 技術的考慮事項

### Prismaの制約対応
- `findUnique`/`update`/`delete`は単一フィールドの`where`条件のみサポート
- 複合条件が必要な場合は`findFirst`/`updateMany`/`deleteMany`を使用
- パフォーマンスへの影響は軽微（idフィールドにインデックスあり）

### データベースインデックス
Prisma schemaで既に定義済み：
```prisma
@@index([userId, date])
@@index([userId, fiscalYear])
```

## テスト観点
1. 未ログイン状態での操作がエラーになることを確認
2. ログインユーザーAがユーザーBのデータにアクセスできないことを確認
3. 仕訳一覧が自分のデータのみ表示されることを確認
4. 他ユーザーの仕訳IDを指定した更新・削除が失敗することを確認
