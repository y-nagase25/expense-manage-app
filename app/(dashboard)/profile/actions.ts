'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { FormResponse } from '@/lib/types/types';
import { createAdminSupabase } from '@/utils/supabase/admin';

/**
 * Delete the current user account
 * This will:
 * 1. Delete all related data (Journal entries, Profile)
 * 2. Delete the user from Supabase Auth
 * 3. Redirect to home page
 */
export async function deleteCurrentUser(
    _prevState: FormResponse,
    _formData: FormData
): Promise<FormResponse> {
    try {
        const userId = await getCurrentUserId();

        // Delete related data in Prisma
        await prisma.$transaction(async (tx) => {
            // Delete all journals for this user
            await tx.journal.deleteMany({
                where: { userId },
            });

            // Delete profile if exists
            await tx.profile.deleteMany({
                where: { id: userId },
            });
        });

        // Delete user from Supabase Auth
        const adminSupabase = createAdminSupabase();
        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error('Error deleting user from Supabase Auth:', deleteError);
            return {
                success: false,
                message: `ユーザー削除中にエラーが発生しました: ${deleteError.message}`,
            };
        }

        // Revalidate and redirect
        revalidatePath('/');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting user:', error);
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

    // Redirect after successful deletion (outside try-catch to avoid catching redirect error)
    redirect('/');
}
