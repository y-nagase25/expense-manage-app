import 'server-only';

import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { serialize } from '../serializer';
import type { JournalWithAccount, SerializedJournal } from '../types/journals';

export const getJournals = cache(async (): Promise<JournalWithAccount[]> => {
    const userId = await getCurrentUserId();

    return await prisma.journal.findMany({
        where: {
            userId,
        },
        include: {
            debitAccount: true,
            creditAccount: true,
        },
        orderBy: {
            date: 'desc',
        },
    });
});

export const getSerializedJournal = cache(async (id: string): Promise<SerializedJournal | null> => {
    const userId = await getCurrentUserId();

    const journal = await prisma.journal.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            debitAccount: true,
            creditAccount: true,
        },
    });

    if (!journal) return null;

    return serialize(journal) as SerializedJournal;
});
