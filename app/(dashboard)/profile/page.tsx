import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { createServerSupabase } from '@/utils/supabase/server';

async function ProfilePage() {
    const supabase = await createServerSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <Separator />
            <div className="flex flex-col items-center gap-3">
                <Avatar className="h-20 w-20">
                    <AvatarImage
                        src={user?.user_metadata.avatar_url}
                        alt={user?.user_metadata.name}
                    />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="font-medium">{user?.user_metadata.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-green-600">{user?.aud}</p>
                    <p className="text-sm text-muted-foreground">{user?.confirmed_at}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
