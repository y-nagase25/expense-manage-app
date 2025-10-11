'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    console.log(error);
    return (
        // global-error must include html and body tags
        <html lang="ja">
            <body>
                <h2>Something went wrong!</h2>
                <Button onClick={reset}>Reset</Button>
                <Button asChild variant="link">
                    <Link href="/">Return Home</Link>
                </Button>
            </body>
        </html>
    );
}
