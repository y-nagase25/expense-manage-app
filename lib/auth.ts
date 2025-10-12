import 'server-only';

import { createServerSupabase } from '@/utils/supabase/server';

/**
 * Get current user ID from Supabase session
 * @throws {Error} If user is not logged in
 * @returns User ID from Supabase session
 */
export async function getCurrentUserId(): Promise<string> {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized: User not logged in');
    }

    return user.id;
}
