export enum TransactionType {
    INCOME = '収入',
    EXPENSE = '支出',
}

export enum AccountTitle {
    SALES = '売上',
    COMMUNICATION = '通信費',
    SUPPLIES = '消耗品費',
    RENT = '地代家賃',
    UTILITIES = '水道光熱費',
    ADVERTISING = '広告宣伝費',
    CASH = '現金',
    BANK_ACCOUNT = '普通預金',
    ACCOUNTS_RECEIVABLE = '売掛金',
    DREDIT_CARD = 'クレジットカード',
    OWNER_DEBT = '事業主借',
    OWNER_LEND = '事業主貸',

}

export enum TaxCategory {
    TAXABLE_10 = '課税10%',
    TAXABLE_8 = '課税8%',
    NON_TAXABLE = '非課税',
    TAX_EXEMPT = '免税',
}

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
}

export type InitialJournalEntry = Omit<JournalEntry, 'id'>;
