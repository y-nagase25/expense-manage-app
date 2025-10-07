'use client'

import { Home, Settings, User, FileText } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

const menuItems = [
    {
        title: 'Home',
        icon: Home,
        href: '/',
    },
    {
        title: 'Journals',
        icon: FileText,
        href: '/journals',
    },
    {
        title: 'Profile',
        icon: User,
        href: '/profile',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/settings',
    },
]

interface SidebarProps {
    open: boolean
    onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname()

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <Separator />

            <div className="p-4">
                <p className="text-xs text-muted-foreground">
                    v1.0.0
                </p>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={open} onOpenChange={onClose}>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="border-b p-4">
                        <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    'hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background transition-transform duration-300',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <SidebarContent />
            </aside>
        </>
    )
}
