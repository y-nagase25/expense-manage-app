import 'server-only';

import type { Journal } from '@prisma/client';
import { cache } from 'react';
import { prisma } from '@/lib/db';
import { serialize } from '../serializer';
import type { SerializedJournal } from '../types/journals';

export const getJournals = cache(async (): Promise<Journal[]> => {
    return await prisma.journal.findMany();
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
