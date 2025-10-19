import Link from 'next/link';
import { APP_NAME } from '@/utils/constants';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background md:ml-64">
            <div className="py-6 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <ul className="flex items-center gap-6 text-sm text-muted-foreground">
                        <li>
                            <Link
                                href="/term"
                                target="_blank"
                                className="hover:text-foreground transition-colors"
                            >
                                利用規約
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/privacy"
                                target="_blank"
                                className="hover:text-foreground transition-colors"
                            >
                                プライバシーポリシー
                            </Link>
                        </li>
                    </ul>

                    <p className="text-sm text-muted-foreground">
                        © {currentYear} {APP_NAME} All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
