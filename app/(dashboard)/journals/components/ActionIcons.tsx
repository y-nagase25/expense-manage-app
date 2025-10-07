"use client";

import { deleteJournalEntry } from "@/lib/actions";
import { EditIcon, TrashIcon } from 'lucide-react';
import { JournalEntry } from "@prisma/client";
import Link from "next/link";
import { startTransition } from "react";

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
                    if (!confirm("この仕訳を削除しますか？この操作は取り消せません。")) return;
                    startTransition(async () => {
                        await deleteJournalEntry(entry.id);
                    });
                }}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </>
    )
}

export default ActionIcons;