import { TransactionType, AccountTitle, TaxCategory } from '@prisma/client';

// Re-export so the rest of the app can import from your local module if preferred.
// export type { TransactionType, AccountTitle, TaxCategory };

// Label maps for UI (runtime-safe, keyed by Prisma enum values)
export const TransactionTypeLabel: Record<TransactionType, string> = {
    INCOME: '収入',
    EXPENSE: '支出',
};

export const AccountTitleLabel: Record<AccountTitle, string> = {
    SALES: '売上',
    COMMUNICATION: '通信費',
    SUPPLIES: '消耗品費',
    RENT: '地代家賃',
    UTILITIES: '水道光熱費',
    ADVERTISING: '広告宣伝費',
    CASH: '現金',
    BANK_ACCOUNT: '普通預金',
    ACCOUNTS_RECEIVABLE: '売掛金',
};

export const TaxCategoryLabel: Record<TaxCategory, string> = {
    TAXABLE_10: '課税10%',
    TAXABLE_8: '課税8%',
    NON_TAXABLE: '非課税',
    TAX_EXEMPT: '免税',
};

// Optional helpers for select options, etc.
export const TransactionTypeOptions = Object.values(TransactionType) as TransactionType[];
export const AccountTitleOptions = Object.values(AccountTitle) as AccountTitle[];
export const TaxCategoryOptions = Object.values(TaxCategory) as TaxCategory[];

// Domain types reusing Prisma enums
export type JournalEntry = {
    id: string;
    transactionType: TransactionType;
    occurrenceDate: string;
    debitAccount: AccountTitle;
    debitAmount: number;
    debitTax: TaxCategory;
    creditAccount: AccountTitle;
    creditAmount: number;
    creditTax: TaxCategory;
    client: string;
    paymentDate: string;
    paymentAccount: string;
    notes?: string;
};

export type InitialJournalEntry = Omit<JournalEntry, 'id'>;
