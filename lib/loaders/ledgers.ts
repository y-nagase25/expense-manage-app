import 'server-only';

import { Decimal } from '@prisma/client/runtime/library';
import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { LedgerSummary } from '@/lib/types/ledgers';

/**
 * 総勘定元帳の集計データを取得
 * 日本の会計基準に基づき、勘定科目ごとの借方・貸方合計と残高を計算
 *
 * 会計ルール：
 * - type=INCOME の取引 → 勘定科目の貸方に計上
 * - type=EXPENSE の取引 → 勘定科目の借方に計上
 *
 * @returns 勘定科目ごとの集計データ（コード順にソート）
 */
export const getLedgerSummary = cache(async (): Promise<LedgerSummary[]> => {
    const userId = await getCurrentUserId();

    // 全仕訳を取得（勘定科目情報を含む）
    const journals = await prisma.journal.findMany({
        where: {
            userId,
        },
        include: {
            account: true,
        },
        orderBy: {
            date: 'asc',
        },
    });

    // 勘定科目ごとにグループ化して集計
    const ledgerMap = new Map<
        string,
        {
            accountId: string;
            accountCode: string;
            accountName: string;
            category: string;
            debitTotal: Decimal;
            creditTotal: Decimal;
        }
    >();

    for (const journal of journals) {
        const accountId = journal.accountId;

        // 既存のエントリを取得または初期化
        let ledgerEntry = ledgerMap.get(accountId);
        if (!ledgerEntry) {
            ledgerEntry = {
                accountId: journal.account.id,
                accountCode: journal.account.code,
                accountName: journal.account.name,
                category: journal.account.category,
                debitTotal: new Decimal(0),
                creditTotal: new Decimal(0),
            };
            ledgerMap.set(accountId, ledgerEntry);
        }

        // type に基づいて借方・貸方を判定
        const amount = new Decimal(journal.amount.toString());

        if (journal.type === 'INCOME') {
            // 収入取引 → 貸方に計上
            ledgerEntry.creditTotal = ledgerEntry.creditTotal.add(amount);
        } else {
            // 支出取引 → 借方に計上
            ledgerEntry.debitTotal = ledgerEntry.debitTotal.add(amount);
        }
    }

    // LedgerSummary配列を作成
    const ledgerSummaries: LedgerSummary[] = Array.from(ledgerMap.values()).map((entry) => {
        const debitTotal = entry.debitTotal;
        const creditTotal = entry.creditTotal;
        const totalAmount = debitTotal.add(creditTotal);
        const balance = debitTotal.sub(creditTotal);

        return {
            accountId: entry.accountId,
            accountCode: entry.accountCode,
            accountName: entry.accountName,
            category: entry.category as LedgerSummary['category'],
            debitTotal,
            creditTotal,
            totalAmount,
            balance,
        };
    });

    // 勘定科目コード順にソート
    ledgerSummaries.sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    return ledgerSummaries;
});
