import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/hooks/useToast';
import { APP_NAME } from '@/utils/constants';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        template: `%s | ${APP_NAME}`,
        default: APP_NAME,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" className="dark">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ToastProvider>{children}</ToastProvider>
            </body>
        </html>
    );
}
