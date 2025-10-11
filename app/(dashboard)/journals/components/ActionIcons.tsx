'use client';

import { EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { startTransition } from 'react';
import { deleteJournalEntry } from '../actions';

const ActionIcons = ({ id }: { id: string }) => {
    return (
        <>
            <Link href={`/journals/${id}`} className="text-primary hover:text-primary/80">
                <EditIcon className="w-5 h-5" />
            </Link>
            <button
                onClick={() => {
                    if (!confirm('削除しますか？この操作は取り消せません。')) return;
                    startTransition(async () => {
                        await deleteJournalEntry(id);
                    });
                }}
                type="button"
                className="text-destructive hover:text-destructive/80"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </>
    );
};

export default ActionIcons;
