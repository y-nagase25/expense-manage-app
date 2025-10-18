// lib/types/journal.ts
import type { Account, Journal } from '@prisma/client';

export type JournalWithAccount = Journal & {
    debitAccount: Account;
    creditAccount: Account;
};

/**
 * Serialized Journal Type
 * - Decimal fields (amount) are converted to string
 * - Date fields (date, createdAt, updatedAt) are converted to ISO string
 */
export type SerializedJournal = Omit<Journal, 'amount' | 'date' | 'createdAt' | 'updatedAt'> & {
    amount: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    debitAccount: Account;
    creditAccount: Account;
};
