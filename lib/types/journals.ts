// lib/types/journal.ts
import type { Account, Journal } from '@prisma/client';

export type JournalWithAccount = Journal & {
    account: Account;
};

/**
 * Serialized Journal Type
 */
export type SerializedJournal = Omit<Journal, 'amount'> & {
    amount: string;
    account: Account;
};
