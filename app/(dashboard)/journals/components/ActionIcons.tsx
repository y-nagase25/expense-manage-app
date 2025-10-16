'use client';

import { Copy, Trash } from 'lucide-react';
import { useState, useTransition } from 'react';
import { ActionDialog } from '@/components/common/ActionDialog';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/useToast';
import { deleteJournalEntry, duplicateJournalEntry } from '../actions';

export function ActionIcons({ id }: { id: string }) {
    const { showToast } = useToast();
    const [isDeletePending, startDeleteTransition] = useTransition();
    const [isDuplicatePending, startDuplicateTransition] = useTransition();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const res = await deleteJournalEntry(id);
            if (res.success) {
                showToast('info', res.message);
                setIsDeleteOpen(false);
            } else {
                showToast('error', res.message);
            }
        });
    };

    const handleDuplicate = () => {
        startDuplicateTransition(async () => {
            const res = await duplicateJournalEntry(id);
            if (res.success) {
                showToast('info', res.message);
                setIsDuplicateOpen(false);
            } else {
                showToast('error', res.message);
            }
        });
    };

    return (
        <>
            <ActionDialog
                trigger={<Trash color="var(--destructive)" size={24} />}
                title="取引削除"
                description="削除しますか？この操作は取り消せません。"
                onConfirm={handleDelete}
                pending={isDeletePending}
                variant="destructive"
                confirmLabel="削除"
                loader={
                    <>
                        <Spinner />
                        削除中...
                    </>
                }
                state={{
                    open: isDeleteOpen,
                    onOpenChange: () => setIsDeleteOpen((prev) => !prev),
                }}
            />
            <ActionDialog
                trigger={<Copy color="var(--ring)" size={24} />}
                title="取引コピー"
                description="取引をコピーして作成します。"
                onConfirm={handleDuplicate}
                pending={isDuplicatePending}
                confirmLabel="OK"
                loader={
                    <>
                        <Spinner />
                        コピー中...
                    </>
                }
                state={{
                    open: isDuplicateOpen,
                    onOpenChange: () => setIsDuplicateOpen((prev) => !prev),
                }}
            />
        </>
    );
}
