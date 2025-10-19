import Link from 'next/link';
import { APP_NAME } from '@/utils/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center px-4 md:px-6">
                    <div className="flex flex-1 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold md:text-xl">{APP_NAME}</h1>
                        </Link>
                    </div>
                </div>
            </header>
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md p-6 shadow rounded">{children}</div>
            </div>
        </>
    );
}
