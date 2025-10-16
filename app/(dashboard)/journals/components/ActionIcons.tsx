'use client';

import { Copy, Loader, Trash } from 'lucide-react';
import { useTransition } from 'react';
import { ActionDialog } from '@/components/common/ActionDialog';
import { useToast } from '@/hooks/useToast';
import { deleteJournalEntry, duplicateJournalEntry } from '../actions';

export function ActionIcons({ id }: { id: string }) {
    const { showToast } = useToast();
    const [isDeletePending, startDeleteTransition] = useTransition();
    const [isDuplicatePending, startDuplicateTransition] = useTransition();

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const res = await deleteJournalEntry(id);
            showToast('info', res.message);
        });
    };

    const handleDuplicate = () => {
        startDuplicateTransition(async () => {
            const res = await duplicateJournalEntry(id);
            showToast('info', res.message);
        });
    };

    return (
        <>
            <ActionDialog
                trigger={<Trash color="var(--destructive)" size={24} />}
                title="取引削除"
                description="削除しますか？この操作は取り消せません。"
                confirmLabel="削除"
                onConfirm={handleDelete}
                pending={isDeletePending}
                variant="destructive"
                loader={<Loader />}
            />
            <ActionDialog
                trigger={<Copy color="var(--ring)" size={24} />}
                title="取引コピー"
                description="取引をコピーして作成します。"
                confirmLabel="OK"
                onConfirm={handleDuplicate}
                pending={isDuplicatePending}
            />
        </>
    );
}
