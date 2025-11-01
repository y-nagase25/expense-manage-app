import 'server-only';

import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { serialize } from '../serializer';
import type { SerializedJournal } from '../types/journals';

export const getJournals = cache(async (): Promise<SerializedJournal[]> => {
    const userId = await getCurrentUserId();

    const journals = await prisma.journal.findMany({
        where: {
            userId,
        },
        include: {
            debitAccount: true,
            creditAccount: true,
        },
        orderBy: {
            date: 'desc',
        },
    });

    return journals.map((journal) => serialize(journal)) as SerializedJournal[];
});

export const getSerializedJournal = cache(async (id: string): Promise<SerializedJournal | null> => {
    const userId = await getCurrentUserId();

    const journal = await prisma.journal.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            debitAccount: true,
            creditAccount: true,
        },
    });

    if (!journal) return null;

    return serialize(journal) as SerializedJournal;
});

export type MonthlyData = {
    month: string;
    income: number;
    expense: number;
};

/**
 * Get monthly income and expense for the last 6 months
 */
export const getMonthlyIncomeExpense = cache(async (): Promise<MonthlyData[]> => {
    const userId = await getCurrentUserId();

    // Calculate date range for last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    // Fetch journal entries for the last 6 months
    const journals = await prisma.journal.findMany({
        where: {
            userId,
            date: {
                gte: sixMonthsAgo,
            },
        },
        select: {
            date: true,
            type: true,
            amount: true,
            debitAccount: {
                select: {
                    name: true,
                },
            },
            creditAccount: {
                select: {
                    name: true,
                },
            },
        },
    });

    // Create array of last 6 months in YYYY-MM format
    const monthsArray: string[] = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        monthsArray.push(`${year}-${month}`);
    }

    // Aggregate data by month and type
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    // Initialize all months with 0
    for (const month of monthsArray) {
        monthlyMap.set(month, { income: 0, expense: 0 });
    }

    // Aggregate amounts
    for (const journal of journals) {
        // Skip if the transaction involves accounts receivable (売掛金)
        if (journal.debitAccount.name === '売掛金') {
            continue;
        }

        const year = journal.date.getFullYear();
        const month = String(journal.date.getMonth() + 1).padStart(2, '0');
        const key = `${year}-${month}`;

        const existing = monthlyMap.get(key);
        if (existing) {
            const amount = Number(journal.amount);
            if (journal.type === 'INCOME') {
                existing.income += amount;
            } else if (journal.type === 'EXPENSE') {
                existing.expense += amount;
            }
        }
    }

    // Convert to array format
    return monthsArray.map((month) => {
        const data = monthlyMap.get(month) || { income: 0, expense: 0 };
        return {
            month,
            income: Math.round(data.income),
            expense: Math.round(data.expense),
        };
    });
});

/**
 * Get bank account (普通預金) balance from general ledger
 * 総勘定元帳から普通預金の残高を取得
 */
export const getBankAccountBalance = cache(async (): Promise<number> => {
    const userId = await getCurrentUserId();

    // Find the bank account (普通預金, code: '102')
    const bankAccount = await prisma.account.findUnique({
        where: { code: '102' },
    });

    if (!bankAccount) {
        return 0;
    }

    // Fetch all journal entries related to the bank account
    const journals = await prisma.journal.findMany({
        where: {
            userId,
            OR: [{ debitAccountId: bankAccount.id }, { creditAccountId: bankAccount.id }],
        },
    });

    // Calculate debit and credit totals
    let debitTotal = 0;
    let creditTotal = 0;

    for (const journal of journals) {
        const amount = Number(journal.amount);
        if (journal.debitAccountId === bankAccount.id) {
            debitTotal += amount;
        }
        if (journal.creditAccountId === bankAccount.id) {
            creditTotal += amount;
        }
    }

    // For asset accounts, balance = debit - credit
    const balance = debitTotal - creditTotal;
    return Math.round(balance);
});

export type RecentTransaction = {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    date: Date;
    accountName: string;
    clientName: string;
    amount: number;
};

/**
 * Get recent 5 transactions ordered by date
 * 最新5件の取引を取得（取引日時順）
 */
export const getRecentTransactions = cache(async (): Promise<RecentTransaction[]> => {
    const userId = await getCurrentUserId();

    const journals = await prisma.journal.findMany({
        where: {
            userId,
        },
        include: {
            debitAccount: true,
            creditAccount: true,
        },
        orderBy: {
            date: 'desc',
        },
        take: 5,
    });

    return journals.map((journal) => {
        // For income, show credit account (revenue account)
        // For expense, show debit account (expense account)
        const accountName =
            journal.type === 'INCOME' ? journal.creditAccount.name : journal.debitAccount.name;

        return {
            id: journal.id,
            type: journal.type,
            date: journal.date,
            accountName,
            clientName: journal.clientName,
            amount: Number(journal.amount),
        };
    });
});

export const getTransactionCounts = cache(async (): Promise<number> => {
    const userId = await getCurrentUserId();

    const journals = await prisma.journal.findMany({
        where: {
            userId,
        },
    });

    return journals.length;
});
