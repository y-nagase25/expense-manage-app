'use client';

import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import type { FormResponse } from '@/lib/types/types';
import { deleteJournalEntry } from '../actions';

const initialState: FormResponse = {
    success: false,
    message: '',
};

const ActionIcons = ({ id }: { id: string }) => {
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(deleteJournalEntry, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                showToast('success', state.message);
                setIsOpen(false);
            } else {
                showToast('error', state.message);
            }
        }
    }, [state, showToast]);

    return (
        <>
            <Link href={`/journals/${id}`} className="text-primary hover:text-primary/80">
                <Edit color="var(--primary)" size={24} />
            </Link>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="text-destructive hover:text-destructive/80"
                        aria-label="削除"
                    >
                        <Trash color="var(--destructive)" size={24} />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>取引削除</DialogTitle>
                        <DialogDescription>
                            削除しますか？この操作は取り消せません。
                        </DialogDescription>
                    </DialogHeader>
                    <form action={formAction}>
                        <input type="hidden" name="id" value={id} />
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    キャンセル
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={isPending}>
                                {isPending ? '削除中...' : '削除'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ActionIcons;
