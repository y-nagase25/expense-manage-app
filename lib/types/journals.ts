// lib/types/journal.ts
import type { Account, Journal } from '@prisma/client';

export type JournalWithAccount = Journal & {
    debitAccount: Account;
    creditAccount: Account;
};

/**
 * Serialized Journal Type
 */
export type SerializedJournal = Omit<Journal, 'amount'> & {
    amount: string;
    debitAccount: Account;
    creditAccount: Account;
};
