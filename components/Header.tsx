import { HeaderClient } from '@/components/HeaderClient';
import { getCurrentUserProfile } from '@/lib/loaders/profile';

export async function Header() {
    const profile = await getCurrentUserProfile();

    return <HeaderClient profile={profile} />;
}
