'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { FormResponse } from '@/lib/types/types';
import { journalEntrySchema, journalEntryUpdateSchema } from '@/lib/validations/journal';

/**
 * Get single journal by ID with account relation
 */
export async function getJournalById(id: string) {
    const userId = await getCurrentUserId();

    return await prisma.journal.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            account: true,
        },
    });
}

/**
 * Create new journal entry
 */
export async function createJournalEntry(
    _prevState: FormResponse,
    formData: FormData
): Promise<FormResponse> {
    try {
        const userId = await getCurrentUserId();

        // Convert FormData to plain object
        const rawData = {
            type: formData.get('type'),
            date: formData.get('date'),
            accountId: formData.get('accountId'),
            amount: formData.get('amount'),
            paymentAccount: formData.get('paymentAccount'),
            taxType: formData.get('taxType'),
            clientName: formData.get('clientName'),
            description: formData.get('description') || undefined,
            subAccount: formData.get('subAccount') || undefined,
            memo: formData.get('memo') || undefined,
        };

        // Validate input data
        const validatedData = journalEntrySchema.parse(rawData);

        // Parse date and calculate fiscal year
        const date = new Date(validatedData.date);

        // Parse amount as Decimal
        const amount = new Prisma.Decimal(validatedData.amount);

        await prisma.journal.create({
            data: {
                type: validatedData.type,
                date: date,
                accountId: validatedData.accountId,
                amount: amount,
                paymentAccount: validatedData.paymentAccount,
                taxType: validatedData.taxType,
                clientName: validatedData.clientName,
                description: validatedData.description || null,
                subAccount: validatedData.subAccount || null,
                memo: validatedData.memo || null,
                fiscalYear: date.getFullYear(),
                userId,
            },
        });

        revalidatePath('/journals');

        return { success: true, message: '取引の登録が完了しました' };
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: '入力内容に誤りがあります',
                field: formData,
                errors: error.flatten().fieldErrors,
            };
        }
        if (error instanceof Error) {
            console.error('Error creating journal entry:', error);
            return {
                success: false,
                message: `エラーが発生しました: ${error.message}`,
                field: formData,
            };
        }
        return {
            success: false,
            message: '予期しないエラーが発生しました',
            field: formData,
        };
    }
}

/**
 * Update existing journal entry
 */
export async function updateJournalEntry(
    _prevState: FormResponse,
    formData: FormData
): Promise<FormResponse> {
    try {
        const userId = await getCurrentUserId();

        // Convert FormData to plain object
        const rawData = {
            id: formData.get('id'),
            type: formData.get('type'),
            date: formData.get('date'),
            accountId: formData.get('accountId'),
            amount: formData.get('amount'),
            paymentAccount: formData.get('paymentAccount'),
            taxType: formData.get('taxType'),
            clientName: formData.get('clientName'),
            description: formData.get('description') || undefined,
            subAccount: formData.get('subAccount') || undefined,
            memo: formData.get('memo') || undefined,
        };

        // Validate input data
        const validatedData = journalEntryUpdateSchema.parse(rawData);

        // Parse date and calculate fiscal year
        const date = new Date(validatedData.date);

        // Parse amount as Decimal
        const amount = new Prisma.Decimal(validatedData.amount);

        const result = await prisma.journal.updateMany({
            where: {
                id: validatedData.id,
                userId,
            },
            data: {
                date: date,
                accountId: validatedData.accountId,
                amount: amount,
                paymentAccount: validatedData.paymentAccount,
                taxType: validatedData.taxType,
                clientName: validatedData.clientName,
                description: validatedData.description || null,
                subAccount: validatedData.subAccount || null,
                memo: validatedData.memo || null,
                fiscalYear: date.getFullYear(),
            },
        });

        if (result.count === 0) {
            return {
                success: false,
                message: '取引が見つかりませんでした',
                field: formData,
            };
        }

        revalidatePath(`/journals/${validatedData.id}`);
        return { success: true, message: '更新が完了しました' };
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: '入力内容に誤りがあります',
                field: formData,
                errors: error.flatten().fieldErrors,
            };
        }
        if (error instanceof Error) {
            console.error('Error updating journal entry:', error);
            return {
                success: false,
                message: `エラーが発生しました: ${error.message}`,
                field: formData,
            };
        }
        return {
            success: false,
            message: '予期しないエラーが発生しました',
            field: formData,
        };
    }
}

/**
 * Delete journal entry
 */
export async function deleteJournalEntry(id: string): Promise<FormResponse> {
    try {
        const userId = await getCurrentUserId();

        if (!id) {
            return {
                success: false,
                message: 'IDが指定されていません',
            };
        }

        const result = await prisma.journal.deleteMany({
            where: {
                id,
                userId,
            },
        });

        if (result.count === 0) {
            return {
                success: false,
                message: '取引が見つかりませんでした',
            };
        }

        revalidatePath('/journals');
        return { success: true, message: '取引を削除しました' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting journal entry:', error);
            return {
                success: false,
                message: `エラーが発生しました: ${error.message}`,
            };
        }
        return {
            success: false,
            message: '予期しないエラーが発生しました',
        };
    }
}

/**
 * Duplicate journal entry
 */
export async function duplicateJournalEntry(id: string): Promise<FormResponse> {
    try {
        const userId = await getCurrentUserId();

        if (!id) {
            return {
                success: false,
                message: 'IDが指定されていません',
            };
        }

        // Get existing journal entry
        const existingJournal = await prisma.journal.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingJournal) {
            return {
                success: false,
                message: '取引が見つかりませんでした',
            };
        }

        // Create a duplicate entry (exclude id, createdAt, updatedAt)
        await prisma.journal.create({
            data: {
                date: existingJournal.date,
                type: existingJournal.type,
                accountId: existingJournal.accountId,
                amount: existingJournal.amount,
                paymentAccount: existingJournal.paymentAccount,
                taxType: existingJournal.taxType,
                clientName: existingJournal.clientName,
                description: existingJournal.description,
                subAccount: existingJournal.subAccount,
                memo: existingJournal.memo,
                fiscalYear: existingJournal.fiscalYear,
                userId,
            },
        });

        revalidatePath('/journals');
        return { success: true, message: '取引をコピーしました' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error duplicating journal entry:', error);
            return {
                success: false,
                message: `エラーが発生しました: ${error.message}`,
            };
        }
        return {
            success: false,
            message: '予期しないエラーが発生しました',
        };
    }
}
