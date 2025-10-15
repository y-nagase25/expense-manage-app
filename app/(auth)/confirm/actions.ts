'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { FormResponse } from '@/lib/types/types';
import { termsAcceptanceSchema } from '@/lib/validations/profile';

/**
 * Accept terms and conditions
 * Updates user profile with business name and terms acceptance timestamp
 */
export async function acceptTerms(
    _prevState: FormResponse,
    formData: FormData
): Promise<FormResponse> {
    try {
        const userId = await getCurrentUserId();

        // Convert FormData to plain object
        const rawData = {
            businessName: formData.get('businessName'),
            termsAccepted: formData.get('termsAccepted') === 'true',
        };

        // Validate input data
        const validatedData = termsAcceptanceSchema.parse(rawData);

        // Update profile with business name and terms acceptance timestamp
        await prisma.profile.update({
            where: { id: userId },
            data: {
                businessName: validatedData.businessName,
                termsAcceptedAt: new Date(),
            },
        });

        // Revalidate all pages to reflect the updated profile
        revalidatePath('/');
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
            console.error('Error accepting terms:', error);
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

    // Redirect after successful terms acceptance (outside try-catch to avoid catching redirect error)
    redirect('/home');
}
