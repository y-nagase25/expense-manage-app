'use client';

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

type ConfirmActionDialogProps = {
    trigger: React.ReactNode;
    title: string;
    description?: string;
    onConfirm: () => void;
    pending: boolean;
    variant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link';
    confirmLabel?: React.ReactNode;
    loader?: React.ReactNode;
    state: {
        open: boolean;
        onOpenChange: () => void;
    };
};

export function ActionDialog({
    trigger,
    title,
    description,
    onConfirm,
    pending,
    variant = 'default',
    confirmLabel = 'OK',
    loader = 'loading...',
    state,
}: ConfirmActionDialogProps) {
    return (
        <Dialog open={state.open} onOpenChange={state.onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ? <DialogDescription>{description}</DialogDescription> : null}
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            キャンセル
                        </Button>
                    </DialogClose>
                    <Button type="button" variant={variant} onClick={onConfirm} disabled={pending}>
                        {pending ? loader : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
