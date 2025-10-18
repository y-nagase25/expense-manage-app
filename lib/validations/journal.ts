import type { PaymentAccount, TaxType, TransactionType } from '@prisma/client';
import { z } from 'zod';

/**
 * Journal entry validation schema
 */
export const journalEntrySchema = z.object({
    // Transaction type (required)
    type: z.nativeEnum({
        INCOME: 'INCOME',
        EXPENSE: 'EXPENSE',
    } as const satisfies Record<TransactionType, TransactionType>),

    // Transaction date (required)
    date: z.string().min(1, '日付を入力してください'),

    // Debit Account ID (required)
    debitAccountId: z.string().min(1, '借方勘定科目を選択してください'),

    // Credit Account ID (required)
    creditAccountId: z.string().min(1, '貸方勘定科目を選択してください'),

    // Amount (required, 1-8 digits)
    amount: z
        .string()
        .min(1, '金額を入力してください')
        .regex(/^\d{1,8}(\.\d{1,2})?$/, '金額は1〜8桁の数字で入力してください'),

    // Payment account (required)
    paymentAccount: z.nativeEnum({
        BANKING: 'BANKING',
        CREDIT_CARD: 'CREDIT_CARD',
        CASH: 'CASH',
        PRIVATE: 'PRIVATE',
    } as const satisfies Record<PaymentAccount, PaymentAccount>),

    // Tax type (required)
    taxType: z.nativeEnum({
        TAXABLE_10: 'TAXABLE_10',
        TAXABLE_8: 'TAXABLE_8',
        TAX_FREE: 'TAX_FREE',
        NON_TAXABLE: 'NON_TAXABLE',
        TAX_EXEMPT: 'TAX_EXEMPT',
        NONE: 'NONE',
    } as const satisfies Record<TaxType, TaxType>),

    // Client name (required, max 30 characters)
    clientName: z
        .string()
        .min(1, '取引先を入力してください')
        .max(30, '取引先は30文字以内で入力してください'),

    // Description (optional, max 50 characters)
    description: z.string().max(50, '摘要は50文字以内で入力してください').optional(),

    // Sub account (optional, max 100 characters)
    subAccount: z.string().max(100, '補助科目は100文字以内で入力してください').optional(),

    // Memo (optional, max 255 characters)
    memo: z.string().max(255, '備考は255文字以内で入力してください').optional(),
});

/**
 * Journal entry update schema (includes ID)
 */
export const journalEntryUpdateSchema = journalEntrySchema.extend({
    id: z.string().min(1, '仕訳IDが見つかりません'),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type JournalEntryUpdateInput = z.infer<typeof journalEntryUpdateSchema>;
