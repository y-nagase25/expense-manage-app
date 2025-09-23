'use client';
import Link from 'next/link';
import React from 'react';
import { BookIcon, LedgerIcon } from '../icons/icons';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
    const commonLinkClasses = 'flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 transition-colors duration-200 transform rounded-lg';
    const activeLinkClasses = 'bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-white';
    const inactiveLinkClasses = 'hover:bg-gray-200 dark:hover:bg-gray-700';

    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;


    return (
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                <Link
                    href="/"
                    className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
                >
                    FinDash
                </Link>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                <Link
                    href="/journals"
                    className={`${commonLinkClasses} ${isActive("/journals") ? activeLinkClasses : inactiveLinkClasses}`}
                >
                    <BookIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">仕訳帳</span>
                </Link>
                <Link
                    href="/ledger"
                    className={`${commonLinkClasses} ${isActive("/ledger") ? activeLinkClasses : inactiveLinkClasses}`}
                >
                    <LedgerIcon className="w-5 h-5" />
                    <span className="mx-4 font-medium">総勘定元帳</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
