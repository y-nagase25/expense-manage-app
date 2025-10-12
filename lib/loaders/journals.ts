import 'server-only';

import { cache } from 'react';
import { prisma } from '@/lib/db';
import { serialize } from '../serializer';
import type { JournalWithAccount, SerializedJournal } from '../types/journals';

export const getJournals = cache(async (): Promise<JournalWithAccount[]> => {
    return await prisma.journal.findMany({
        include: {
            account: true,
        },
    });
});

export const getSerializedJournal = cache(async (id: string): Promise<SerializedJournal | null> => {
    const journal = await prisma.journal.findUnique({
        where: { id },
        include: {
            account: true,
        },
    });

    if (!journal) return null;

    return serialize(journal) as SerializedJournal;
});
