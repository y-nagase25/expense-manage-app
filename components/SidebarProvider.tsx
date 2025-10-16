'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

interface SidebarContextValue {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within SidebarProvider');
    }
    return context;
}

interface SidebarProviderProps {
    children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}
