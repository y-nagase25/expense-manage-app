import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TopPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6 mx-8">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Ledry
            </h1>
            <p className="leading-7 text-center">
                個人事業主・フリーランスの方向けの会計管理アプリです。
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>取引の登録・編集ができます</li>
                <li>仕訳帳・総勘定元帳を作成して確定申告に備えましょう</li>
                <li>ご利用にはGoogleのアカウントが必要です</li>
            </ul>
            <div className="flex gap-4">
                <Button asChild className="rounded-full">
                    <Link href="/login">ログインしてはじめる</Link>
                </Button>
                <Button variant="secondary" asChild className="rounded-full">
                    <Link href="/home">サービスへ</Link>
                </Button>
            </div>
        </div>
    );
}
