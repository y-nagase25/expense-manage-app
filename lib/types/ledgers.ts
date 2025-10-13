import type { AccountCategory } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';

/**
 * 総勘定元帳の集計データ型
 * 勘定科目ごとの借方・貸方合計と残高を表す
 */
export type LedgerSummary = {
    /** 勘定科目ID */
    accountId: string;
    /** 勘定科目コード（例: "101"） */
    accountCode: string;
    /** 勘定科目名（例: "現金"） */
    accountName: string;
    /** 勘定科目カテゴリ（資産/負債/純資産/収益/費用） */
    category: AccountCategory;
    /** 借方合計 */
    debitTotal: Decimal;
    /** 貸方合計 */
    creditTotal: Decimal;
    /** 発生額累計（借方合計 + 貸方合計） */
    totalAmount: Decimal;
    /** 残高（借方合計 - 貸方合計） */
    balance: Decimal;
};
