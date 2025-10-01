import { TransactionType, AccountTitle, TaxCategory, JournalEntry } from '@prisma/client';

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
    TRANSPORTION: '旅費交通費',
    DATING: '交際費',
    CASH: '現金',
    BANK_DEPOSIT: '普通預金',
    ACCOUNTS_RECEIVABLE: '売掛金',
    CREDIT_CARD: 'クレジットカード',
    OWNERS_DEBID: '事業主借',
    OWNERS_CREDIT: '事業主貸',
};

export const TaxCategoryLabel: Record<TaxCategory, string> = {
    TAXABLE_10: '課税10%',
    TAXABLE_8: '課税8%',
    NON_TAXABLE: '非課税',
    TAX_EXEMPT: '免税',
};

// Optional helpers for select options, etc.
export const TransactionTypeOptions = Object.values(TransactionType) as TransactionType[];
export const TaxCategoryOptions = Object.values(TaxCategory) as TaxCategory[];

export type InitialJournalEntry = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;

export type AccountType = 'DEBIT' | 'CREDIT';

export type FormType = 'text' | 'date';

export type FieldProps = {
    children: React.ReactNode;
    label: string;
    className?: string;
}

export type BaseResponse = {
    success: boolean;
    message: string;
}
export type FormResponse = BaseResponse & {
    field?: FormData;
}

