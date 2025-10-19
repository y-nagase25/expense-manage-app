import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/SidebarProvider';
import { Footer } from './Footer';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <div className="relative min-h-screen flex flex-col">
                {/* PC: Header always visible, Mobile: Hidden */}
                <Header />

                {/* PC: Sidebar always visible, Mobile: Toggle with hamburger */}
                <Sidebar />

                {/* PC: Content with left margin for sidebar, Mobile: Full width */}
                <main className="flex-1 py-6 md:py-10 md:ml-64">{children}</main>
                <Footer />
            </div>
        </SidebarProvider>
    );
}
