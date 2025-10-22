import type { Metadata } from 'next';

/**
 * Centralized page title configuration
 * Single source of truth for all page titles in the application
 */
export const PAGE_TITLES = {
    HOME: 'ホーム',
    JOURNALS: '取引一覧',
    LEDGERS: '総勘定元帳',
    PROFILE: 'アカウント',
    HELP: 'ヘルプ',
    PRIVACY: 'プライバシーポリシー',
    TERMS: '利用規約',
    LOGIN: 'ログイン',
} as const;

/**
 * Utility function to create page metadata with title
 * @param title - The page title
 * @returns Metadata object for Next.js pages
 */
export const createPageMetadata = (title: string): Metadata => ({
    title,
});
