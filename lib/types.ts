import type { Journal, PaymentAccount, TaxType, TransactionType } from '@prisma/client';

// Label maps for UI (runtime-safe, keyed by Prisma enum values)
export const TransactionTypeLabel: Record<TransactionType, string> = {
    INCOME: '収入',
    EXPENSE: '支出',
};

export const PaymentAccountLabel: Record<PaymentAccount, string> = {
    BANKING: '銀行口座',
    CREDIT_CARD: 'クレジットカード',
    CASH: '現金',
    PRIVATE: 'プライベート資金',
};

export const TaxTypeLabel: Record<TaxType, string> = {
    TAXABLE_10: '課税10%',
    TAXABLE_8: '課税8%',
    TAX_FREE: '免税',
    NON_TAXABLE: '非課税',
    TAX_EXEMPT: '不課税',
    NONE: '対象外',
};

// Optional helpers for select options
export const TransactionTypeOptions = Object.entries(TransactionTypeLabel).map(
    ([value, label]) => ({
        value: value as TransactionType,
        label,
    })
);

export const PaymentAccountOptions = Object.entries(PaymentAccountLabel).map(([value, label]) => ({
    value: value as PaymentAccount,
    label,
}));

export const TaxTypeOptions = Object.entries(TaxTypeLabel).map(([value, label]) => ({
    value: value as TaxType,
    label,
}));

// Type for creating/updating journal entries (omit auto-generated fields)
export type InitialJournal = Omit<
    Journal,
    'id' | 'createdAt' | 'updatedAt' | 'fiscalYear' | 'fiscalPeriod' | 'userId'
>;

// Type for journal form data (simplified for UI)
export type JournalFormData = {
    type: TransactionType;
    date: string;
    accountId: string;
    amount: string; // String for form input
    paymentAccount: PaymentAccount;
    taxType: TaxType;
    clientName: string;
    description?: string;
    subAccount?: string;
    memo?: string;
};

export type AccountType = 'DEBIT' | 'CREDIT';

export type FormType = 'text' | 'date';

export type FieldProps = {
    children: React.ReactNode;
    label: string;
    className?: string;
};

export type BaseResponse = {
    success: boolean;
    message: string;
};

export type FormResponse = BaseResponse & {
    field?: FormData;
};

// Account selection helper type
export type AccountOption = {
    value: string; // Account ID
    label: string; // Display format: "101 現金"
    code: string;
    name: string;
    category: string;
    defaultTaxType: TaxType;
};
