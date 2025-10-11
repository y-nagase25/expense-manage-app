import 'server-only';

import type { AccountCategory } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { AccountOption } from '@/lib/types';

/**
 * Get all accounts ordered by category and display order
 */
export async function getAccounts() {
    return await prisma.account.findMany({
        orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
    });
}

/**
 * Get accounts filtered by category
 */
export async function getAccountsByCategory(category: AccountCategory) {
    return await prisma.account.findMany({
        where: { category },
        orderBy: { displayOrder: 'asc' },
    });
}

/**
 * Get single account by code
 */
export async function getAccountByCode(code: string) {
    return await prisma.account.findUnique({
        where: { code },
    });
}

/**
 * Get single account by ID
 */
export async function getAccountById(id: string) {
    return await prisma.account.findUnique({
        where: { id },
    });
}

/**
 * Get accounts formatted for select options
 * Format: "101 現金" (code + name)
 */
export async function getAccountOptions(): Promise<AccountOption[]> {
    const accounts = await getAccounts();

    return accounts.map((account) => ({
        value: account.id,
        label: `${account.code} ${account.name}`,
        code: account.code,
        name: account.name,
        category: account.category,
        defaultTaxType: account.defaultTaxType,
    }));
}

/**
 * Get account options grouped by category
 */
export async function getAccountOptionsByCategory() {
    const accounts = await getAccounts();

    const grouped = accounts.reduce(
        (acc, account) => {
            if (!acc[account.category]) {
                acc[account.category] = [];
            }
            acc[account.category].push({
                value: account.id,
                label: `${account.code} ${account.name}`,
                code: account.code,
                name: account.name,
                category: account.category,
                defaultTaxType: account.defaultTaxType,
            });
            return acc;
        },
        {} as Record<string, AccountOption[]>
    );

    return grouped;
}
