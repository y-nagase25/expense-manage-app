'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { createBrowserSupabase } from '@/utils/supabase/client';
import { LoginErrorHandler } from './LoginErrorHandler';

const links = [
    { label: '利用規約', url: '/term' },
    { label: 'プライバシーポリシー', url: '/privacy' },
];

export function LoginForm() {
    const supabase = createBrowserSupabase();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function signInWithGoogle() {
        try {
            setIsLoading(true);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('OAuth sign-in error:', error);
                showToast('error', 'ログインに失敗しました', error.message);
                setIsLoading(false);
            }
            // If successful, user will be redirected, so don't setIsLoading(false)
        } catch (error) {
            console.error('Unexpected error during sign-in:', error);
            showToast(
                'error',
                'ログインに失敗しました',
                '予期しないエラーが発生しました。しばらくしてから再度お試しください。'
            );
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <Suspense fallback={null}>
                <LoginErrorHandler showToast={showToast} />
            </Suspense>
            <CardHeader className="items-center justify-center space-y-4">
                <Image
                    src="/jouny_logo.png"
                    alt="Jouny Logo"
                    width={120}
                    height={120}
                    priority={true}
                    className="rounded-lg"
                />
            </CardHeader>
            <CardContent>
                <CardDescription>
                    はじめての方も登録済みの方もこちらからログインできます。
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={signInWithGoogle}
                    disabled={isLoading}
                >
                    <GoogleIcon />
                    {isLoading ? 'ログイン中...' : 'Googleでログイン'}
                </Button>
                <CardAction className="flex justify-between gap-x-8">
                    {links.map((link, _i) => (
                        <Link href={link.url} key={link.label}>
                            {link.label}
                        </Link>
                    ))}
                </CardAction>
            </CardFooter>
        </Card>
    );
}
