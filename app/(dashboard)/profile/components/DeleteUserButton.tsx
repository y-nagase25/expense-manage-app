'use client';

import { useActionState, useEffect } from 'react';
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
import { deleteCurrentUser } from '../actions';

const initialState: FormResponse = {
    success: false,
    message: '',
};

export function DeleteUserButton() {
    const { showToast } = useToast();
    const [state, formAction, isPending] = useActionState(deleteCurrentUser, initialState);

    // Handle form submission result
    useEffect(() => {
        if (state.success) {
            // Success: redirect is handled by the server action
            // This code won't be reached due to redirect
            return;
        }

        if (state.message && !state.success) {
            // Error: show error toast
            showToast('error', state.message);
        }
    }, [state, showToast]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    ユーザ削除
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>ユーザ削除</DialogTitle>
                    <DialogDescription>
                        ユーザを削除します。この操作は取り消すことができません。
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
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
    );
}
