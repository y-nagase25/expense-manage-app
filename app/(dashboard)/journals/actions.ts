'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import type { FormResponse } from '@/lib/types/types';
import { journalEntrySchema, journalEntryUpdateSchema } from '@/lib/validations/journal';
import { createServerSupabase } from '@/utils/supabase/server';

/**
 * Get current user ID from Supabase session
 */
async function getCurrentUserId(): Promise<string> {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized: User not logged in');
    }

    return user.id;
}

/**
 * Get single journal by ID with account relation
 */
export async function getJournalById(id: string) {
    const userId = await getCurrentUserId();

    return await prisma.journal.findUnique({
        where: { id, userId },
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

        return { success: true, message: '仕訳の登録が完了しました' };
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

        // Simulate delay to test loading state
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Parse date and calculate fiscal year
        const date = new Date(validatedData.date);

        // Parse amount as Decimal
        const amount = new Prisma.Decimal(validatedData.amount);

        await prisma.journal.update({
            where: { id: validatedData.id, userId },
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
export async function deleteJournalEntry(id: string) {
    try {
        const userId = await getCurrentUserId();

        await prisma.journal.delete({
            where: { id, userId },
        });

        revalidatePath('/journals');
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            // Record to delete not found
            console.warn(`Journal not found for id: ${id}`);
        } else {
            console.error('Error deleting journal entry:', error);
            throw error;
        }
    }
}
