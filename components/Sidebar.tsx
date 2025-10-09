'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { SidebarContent } from './SidebarContent';

// const menuItems = [
//     {
//         title: 'Home',
//         icon: Home,
//         href: '/',
//     },
//     {
//         title: 'Journals',
//         icon: FileText,
//         href: '/journals',
//     },
//     {
//         title: 'Profile',
//         icon: User,
//         href: '/profile',
//     },
//     {
//         title: 'Settings',
//         icon: Settings,
//         href: '/settings',
//     },
// ];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={open} onOpenChange={onClose}>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="border-b p-4">
                        <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onClose={onClose} />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background transition-transform duration-300',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <SidebarContent onClose={onClose} />
            </aside>
        </>
    );
}
