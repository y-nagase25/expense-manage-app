import { z } from 'zod';

/**
 * Validation schema for terms acceptance
 */
export const termsAcceptanceSchema = z.object({
    businessName: z
        .string()
        .min(1, '事業所名・屋号を入力してください')
        .max(100, '事業所名・屋号は100文字以内で入力してください'),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: '利用規約・プライバシーポリシーへの同意が必要です',
    }),
});

export type TermsAcceptanceInput = z.infer<typeof termsAcceptanceSchema>;
