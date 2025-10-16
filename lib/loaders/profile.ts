import 'server-only';

import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { UserProfile } from '@/lib/types/profile';

/**
 * Get current user's profile
 * Returns null if profile doesn't exist
 */
export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
    const userId = await getCurrentUserId();

    return await prisma.profile.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            businessName: true,
        },
    });
});

/**
 * Get profile by user ID
 * Returns null if profile doesn't exist
 */
export const getProfileByUserId = cache(async (userId: string) => {
    return await prisma.profile.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            businessName: true,
        },
    });
});
