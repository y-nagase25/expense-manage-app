'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <>
            <Sheet open={open} onOpenChange={onClose}>
                <SheetContent side="left" className="w-64 p-0" hideClose>
                    <SheetHeader className="border-b p-4">
                        <SheetTitle>メニュー</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onClose={onClose} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar - Always visible */}
            <aside className="hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background">
                <SidebarContent />
            </aside>
        </>
    );
}
