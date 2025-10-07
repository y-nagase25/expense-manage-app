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
import { User } from "lucide-react";

const links = [
    { label: '利用規約', url: '/term' },
    { label: 'プライバシーポリシー', url: '/privacy' },
]
const LoginPage = () => {
    const supabase = createBrowserSupabase();

    async function signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback',
            }
        });
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
                <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                    <GoogleIcon />
                    Login with Google
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
