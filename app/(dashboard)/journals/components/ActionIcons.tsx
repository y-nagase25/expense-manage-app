'use client';

import type { JournalEntry } from '@prisma/client';
import { EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { startTransition } from 'react';
import { deleteJournalEntry } from '@/lib/actions';

const ActionIcons = ({ entry }: { entry: JournalEntry }) => {
    return (
        <>
            <Link
                href={`/journals/${entry.id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
            >
                <EditIcon className="w-5 h-5" />
            </Link>
            <button
                onClick={() => {
                    if (!confirm('削除しますか？この操作は取り消せません。')) return;
                    startTransition(async () => {
                        await deleteJournalEntry(entry.id);
                    });
                }}
                type="button"
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </>
    );
};

export default ActionIcons;
