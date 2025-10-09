'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    // Mobile sidebar state (closed by default)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* PC: Header always visible, Mobile: Hidden */}
            <Header onMenuClick={toggleSidebar} />

            {/* PC: Sidebar always visible, Mobile: Toggle with hamburger */}
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />

            {/* PC: Content with left margin for sidebar, Mobile: Full width */}
            <main className="flex-1 py-6 md:py-10 md:ml-64">{children}</main>
            {/* <Footer /> */}
        </div>
    );
}
