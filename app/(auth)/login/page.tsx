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
import { useState, Suspense } from "react";
import { LoginErrorHandler } from "./components/LoginErrorHandler";

const links = [
    { label: '利用規約', url: '/term' },
    { label: 'プライバシーポリシー', url: '/privacy' },
]

const LoginPage = () => {
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
            <Suspense fallback={null}>
                <LoginErrorHandler showToast={showToast} />
            </Suspense>
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
