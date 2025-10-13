import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/utils/constants';

export default function TopPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-6 shadow rounded">
                <Card>
                    <h1>Welcome</h1>
                    <CardHeader className="items-center justify-center space-y-4">
                        <CardTitle>{APP_NAME}</CardTitle>
                        <Image
                            src="/jouny_logo.png"
                            alt="Jouny Logo"
                            width={120}
                            height={120}
                            priority={true}
                            className="rounded-lg"
                        />
                    </CardHeader>
                    <Button type="button">
                        <Link href="/login">ログインしてはじめる</Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
