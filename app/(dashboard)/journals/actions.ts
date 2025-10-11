'use server';

import { type PaymentAccount, Prisma, type TaxType, type TransactionType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { FormResponse } from '@/lib/types';
import { createServerSupabase } from '@/utils/supabase/server';

/**
 * Calculate fiscal year and period based on date
 * Japan fiscal year: April 1 - March 31
 */
function calculateFiscalYearAndPeriod(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed, so +1

    // If month is 1-3 (Jan-Mar), fiscal year is previous year
    const fiscalYear = month >= 4 ? year : year - 1;

    // Fiscal period: April=1, May=2, ..., March=12
    const fiscalPeriod = month >= 4 ? month - 3 : month + 9;

    return { fiscalYear, fiscalPeriod };
}

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
 * Get all journals with account relation
 */
export async function getJournals() {
    const userId = await getCurrentUserId();

    return await prisma.journal.findMany({
        where: { userId },
        include: {
            account: true,
        },
        orderBy: { date: 'desc' },
    });
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

        // Parse date and calculate fiscal year/period
        const dateStr = formData.get('date') as string;
        const date = new Date(dateStr);
        const { fiscalYear, fiscalPeriod } = calculateFiscalYearAndPeriod(date);

        // Parse amount as Decimal
        const amountStr = formData.get('amount') as string;
        const amount = new Prisma.Decimal(amountStr || '0');

        await prisma.journal.create({
            data: {
                type: formData.get('type') as TransactionType,
                date: date,
                accountId: formData.get('accountId') as string,
                amount: amount,
                paymentAccount: formData.get('paymentAccount') as PaymentAccount,
                taxType: formData.get('taxType') as TaxType,
                clientName: formData.get('clientName') as string,
                description: (formData.get('description') as string) || null,
                subAccount: (formData.get('subAccount') as string) || null,
                memo: (formData.get('memo') as string) || null,
                fiscalYear,
                fiscalPeriod,
                userId,
            },
        });

        revalidatePath('/journals');

        return { success: true, message: '仕訳の登録が完了しました' };
    } catch (error: unknown) {
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
export async function updateJournalEntry(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) throw new Error('Missing journal id');

    try {
        const userId = await getCurrentUserId();

        // Parse date and calculate fiscal year/period
        const dateStr = formData.get('date') as string;
        const date = new Date(dateStr);
        const { fiscalYear, fiscalPeriod } = calculateFiscalYearAndPeriod(date);

        // Parse amount as Decimal
        const amountStr = formData.get('amount') as string;
        const amount = new Prisma.Decimal(amountStr || '0');

        await prisma.journal.update({
            where: { id, userId },
            data: {
                type: formData.get('type') as TransactionType,
                date: date,
                accountId: formData.get('accountId') as string,
                amount: amount,
                paymentAccount: formData.get('paymentAccount') as PaymentAccount,
                taxType: formData.get('taxType') as TaxType,
                clientName: formData.get('clientName') as string,
                description: (formData.get('description') as string) || null,
                subAccount: (formData.get('subAccount') as string) || null,
                memo: (formData.get('memo') as string) || null,
                fiscalYear,
                fiscalPeriod,
            },
        });

        revalidatePath(`/journals/${id}`);
        revalidatePath('/journals');
        redirect(`/journals/${id}?updated=1`);
    } catch (error) {
        console.error('Error updating journal entry:', error);
        redirect(`/journals/${id}?updated=0`);
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
