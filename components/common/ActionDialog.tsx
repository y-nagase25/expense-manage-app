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
    confirmLabel: string;
    onConfirm: () => void;
    pending: boolean;
    variant?: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link';
    loader?: React.ReactNode;
};

export function ActionDialog({
    trigger,
    title,
    description,
    confirmLabel,
    onConfirm,
    pending,
    variant = 'default',
    loader = 'loading...',
}: ConfirmActionDialogProps) {
    return (
        <Dialog>
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
