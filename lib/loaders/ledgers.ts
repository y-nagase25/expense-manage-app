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
 * 会計ルール（複式簿記）：
 * - 各仕訳の借方勘定科目 → 借方合計に金額を加算
 * - 各仕訳の貸方勘定科目 → 貸方合計に金額を加算
 *
 * @returns 勘定科目ごとの集計データ（コード順にソート）
 */
export const getLedgerSummary = cache(async (): Promise<LedgerSummary[]> => {
    const userId = await getCurrentUserId();

    // 全仕訳を取得（借方・貸方の勘定科目情報を含む）
    const journals = await prisma.journal.findMany({
        where: {
            userId,
        },
        include: {
            debitAccount: true,
            creditAccount: true,
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
        const amount = new Decimal(journal.amount.toString());

        // 借方勘定科目の処理
        const debitAccountId = journal.debitAccountId;
        let debitEntry = ledgerMap.get(debitAccountId);
        if (!debitEntry) {
            debitEntry = {
                accountId: journal.debitAccount.id,
                accountCode: journal.debitAccount.code,
                accountName: journal.debitAccount.name,
                category: journal.debitAccount.category,
                debitTotal: new Decimal(0),
                creditTotal: new Decimal(0),
            };
            ledgerMap.set(debitAccountId, debitEntry);
        }
        // 借方に金額を加算
        debitEntry.debitTotal = debitEntry.debitTotal.add(amount);

        // 貸方勘定科目の処理
        const creditAccountId = journal.creditAccountId;
        let creditEntry = ledgerMap.get(creditAccountId);
        if (!creditEntry) {
            creditEntry = {
                accountId: journal.creditAccount.id,
                accountCode: journal.creditAccount.code,
                accountName: journal.creditAccount.name,
                category: journal.creditAccount.category,
                debitTotal: new Decimal(0),
                creditTotal: new Decimal(0),
            };
            ledgerMap.set(creditAccountId, creditEntry);
        }
        // 貸方に金額を加算
        creditEntry.creditTotal = creditEntry.creditTotal.add(amount);
    }

    // LedgerSummary配列を作成
    const ledgerSummaries: LedgerSummary[] = Array.from(ledgerMap.values()).map((entry) => {
        const debitTotal = entry.debitTotal;
        const creditTotal = entry.creditTotal;
        const totalAmount = debitTotal.sub(creditTotal);
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
