import 'server-only';

import type { User } from '@supabase/supabase-js';
import { createServerSupabase } from '@/utils/supabase/server';

/**
 * Get current user from Supabase session
 * @returns User object or null if not logged in
 */
export async function getUser(): Promise<User | null> {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

/**
 * Get current user ID from Supabase session
 * @throws {Error} If user is not logged in
 * @returns User ID from Supabase session
 */
export async function getCurrentUserId(): Promise<string> {
    const user = await getUser();

    if (!user) {
        throw new Error('Unauthorized: User not logged in');
    }

    return user.id;
}
