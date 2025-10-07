'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Sidebar } from '@/components/Sidebar'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const closeSidebar = () => setSidebarOpen(false)

    return (
        <div className="relative min-h-screen flex flex-col">
            <Header onMenuClick={toggleSidebar} />
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />
            <main
                className={cn(
                    'flex-1 transition-all duration-300',
                    sidebarOpen ? 'md:ml-64' : 'md:ml-0'
                )}
            >
                <div className="container py-6 md:py-10">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}
