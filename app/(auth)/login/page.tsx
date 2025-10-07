"use client";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { createBrowserSupabase } from "@/utils/supabase/client";
import { useToast } from "@/hooks/useToast";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const links = [
    { label: '利用規約', url: '/term' },
    { label: 'プライバシーポリシー', url: '/privacy' },
]

const ERROR_MESSAGES: Record<string, string> = {
    'server_error': 'サーバーエラーが発生しました',
    'unexpected_failure': 'データベースエラーが発生しました。Supabaseの設定を確認してください。',
    'exchange_failed': '認証トークンの交換に失敗しました',
    'missing_code': '認証パラメータが不足しています',
    'unexpected_error': '予期しないエラーが発生しました',
};

const LoginPage = () => {
    const supabase = createBrowserSupabase();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const errorCode = searchParams.get('error_code');

        if (error) {
            const message = ERROR_MESSAGES[error] || ERROR_MESSAGES[errorCode || ''] || 'ログインに失敗しました';
            const description = errorDescription || '';
            showToast('error', message, description);
        }
    }, [searchParams, showToast]);

    async function signInWithGoogle() {
        try {
            setIsLoading(true);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) {
                console.error('OAuth sign-in error:', error);
                showToast('error', 'ログインに失敗しました', error.message);
                setIsLoading(false);
            }
            // If successful, user will be redirected, so don't setIsLoading(false)
        } catch (error) {
            console.error('Unexpected error during sign-in:', error);
            showToast('error', 'ログインに失敗しました', '予期しないエラーが発生しました。しばらくしてから再度お試しください。');
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{process.env.NEXT_PUBLIC_APP_NAME ?? 'App Name'}</CardTitle>
                {/* TODO:App Logo */}
                <User className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
                <CardDescription>
                    はじめての方も登録済みの方もこちらからログインできます。
                </CardDescription>

            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={isLoading}>
                    <GoogleIcon />
                    {isLoading ? 'ログイン中...' : 'Googleでログイン'}
                </Button>
                <CardAction>
                    {links.map((link, i) => (
                        <Button asChild variant="link" key={i}>
                            <a href={link.url}>{link.label}</a>
                        </Button>
                    ))}
                </CardAction>
            </CardFooter>
        </Card>
    );
}

export default LoginPage;
