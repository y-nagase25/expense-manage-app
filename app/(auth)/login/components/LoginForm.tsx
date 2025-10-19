'use client';

import { Suspense, useState } from 'react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { createBrowserSupabase } from '@/utils/supabase/client';
import { LoginErrorHandler } from './LoginErrorHandler';

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
                showToast('error', 'ログインに失敗しました');
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
        <Card className="w-full max-w-sm">
            <Suspense fallback={null}>
                <LoginErrorHandler showToast={showToast} />
            </Suspense>
            <CardHeader className="items-center justify-center space-y-4">
                <CardTitle>ログイン</CardTitle>
                <CardDescription>
                    はじめての方も登録済みの方も
                    {/* <br /> */}
                    こちらからログインできます。
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={signInWithGoogle}
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            {isLoading ? 'ログイン中...' : 'Googleでログイン'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
