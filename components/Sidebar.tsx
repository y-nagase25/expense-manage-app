'use client';

import { useSidebarContext } from '@/components/SidebarProvider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SidebarContent } from './SidebarContent';

export function Sidebar() {
    const { sidebarOpen, closeSidebar } = useSidebarContext();

    return (
        <>
            <Sheet open={sidebarOpen} onOpenChange={closeSidebar}>
                <SheetContent side="left" className="w-64 p-0" hideClose>
                    <SheetHeader className="border-b p-4">
                        <SheetTitle>メニュー</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onClose={closeSidebar} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar - Always visible */}
            <aside className="hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background">
                <SidebarContent />
            </aside>
        </>
    );
}
