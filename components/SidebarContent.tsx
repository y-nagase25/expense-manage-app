'use client';

import { Calculator, FileText, HelpCircle, Home, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
    {
        title: 'ホーム',
        icon: Home,
        href: '/home',
    },
    {
        title: '仕訳帳',
        icon: FileText,
        href: '/journals',
    },
    {
        title: '総勘定元帳',
        icon: Calculator,
        href: '/ledgers',
    },
    {
        title: 'アカウント',
        icon: User,
        href: '/profile',
    },
    {
        title: 'ヘルプ',
        icon: HelpCircle,
        href: '/help',
    },
];

export function SidebarContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
