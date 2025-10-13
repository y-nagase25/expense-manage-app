# 総勘定元帳（General Ledger）実装

## 変更概要
仕訳データから勘定科目ごとの借方・貸方合計を集計し、総勘定元帳を表形式で表示する機能を実装。日本の会計基準に準拠した借方・貸方判定を実装。

## 変更ファイル

### 1. lib/types/ledgers.ts（新規作成）
**型定義**: `LedgerSummary`
```typescript
{
  accountId: string;
  accountCode: string;
  accountName: string;
  category: AccountCategory;
  debitTotal: Decimal;      // 借方合計
  creditTotal: Decimal;     // 貸方合計
  totalAmount: Decimal;     // 発生額累計（借方+貸方）
  balance: Decimal;         // 残高（借方-貸方）
}
```

### 2. lib/loaders/ledgers.ts（新規作成）
**関数**: `getLedgerSummary(): Promise<LedgerSummary[]>`

**会計ルール**:
- `TransactionType.INCOME` → 勘定科目の貸方に計上
- `TransactionType.EXPENSE` → 勘定科目の借方に計上

**処理フロー**:
1. `getCurrentUserId()`でユーザーの全仕訳を取得
2. 勘定科目ごとにグループ化（Map使用）
3. 各仕訳のtypeに基づき借方・貸方を判定して加算
4. 発生額累計と残高を計算
5. 勘定科目コード順にソート

**特徴**:
- `server-only`ディレクティブでサーバー専用を保証
- React `cache()`でパフォーマンス最適化
- Decimal型で金額計算の精度を保証

### 3. app/(dashboard)/ledgers/page.tsx（更新）
**変更前**: 空のテーブルボディ

**変更後**: 総勘定元帳データを表示
- `getLedgerSummary()`でデータ取得
- shadcn/ui `Table`コンポーネントで表形式表示
- `formatAmount()`: 日本円フォーマット（¥形式）
- `formatBalance()`: 残高フォーマット（マイナスは括弧表記）

**表示列**:
- 勘定科目名（コード + 名称）
- 借方金額
- 貸方金額
- 発生額累計
- 残高

## 会計理論

### 日本の簿記における借方・貸方ルール
本実装では簡略化したルールを採用：

| 取引タイプ | 仕訳処理 | 例 |
|----------|---------|-----|
| INCOME（収入） | 貸方に計上 | 売上計上、入金記録 |
| EXPENSE（支出） | 借方に計上 | 経費支払、出金記録 |

※実際の複式簿記では、資産・負債・純資産・収益・費用の5要素により借方・貸方が決定されますが、本アプリでは単式簿記に近い簡略化されたモデルを採用しています。

## データフロー
```
ユーザー → /ledgers にアクセス
↓
Server Component (page.tsx) が実行
↓
getLedgerSummary() 呼び出し
↓
Prisma で Journal + Account を取得
↓
勘定科目ごとにグループ化
↓
type に基づき借方・貸方を集計
↓
残高・発生額を計算
↓
コード順ソート → LedgerSummary[] を返却
↓
Table に表示
```

## 技術選択

### Decimal型の使用
金額計算には`@prisma/client/runtime/library`の`Decimal`型を使用：
- 浮動小数点誤差を回避
- 会計処理に必要な精度を保証
- Prismaスキーマの`Decimal(15, 2)`と整合

### React cache
- Server Componentでのデータ取得を最適化
- 同一リクエスト内での重複クエリを防止
- Next.js 15の推奨パターン

## テスト観点
- [ ] 仕訳データがない場合、「データがありません」と表示される
- [ ] INCOME取引が貸方に正しく計上される
- [ ] EXPENSE取引が借方に正しく計上される
- [ ] 同一勘定科目の複数取引が正しく合計される
- [ ] 残高計算が正確（借方合計 - 貸方合計）
- [ ] 勘定科目コード順に表示される
- [ ] 金額が日本円フォーマットで表示される
- [ ] マイナス残高が括弧で表示される

## 関連する設計原則（CLAUDE.md準拠）
- Server Componentでデータ取得
- server-onlyの使用
- React cacheでパフォーマンス最適化
- shadcn/uiコンポーネントの使用
- デザイントークンの使用
- 型安全性の確保
