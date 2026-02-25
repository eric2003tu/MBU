"use client";

import { useState, createContext, useContext } from "react";
import TenantSidebar from "./components/TenantSidebar";

interface TenantLayoutContextValue {
    openMenu: () => void;
}

export const TenantLayoutContext = createContext<TenantLayoutContextValue>({
    openMenu: () => { },
});

export function useTenantLayout() {
    return useContext(TenantLayoutContext);
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <TenantSidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <main className="flex-1 overflow-y-auto">
                    <TenantLayoutContext.Provider value={{ openMenu: () => setSidebarOpen(true) }}>
                        {children}
                    </TenantLayoutContext.Provider>
                </main>
            </div>
        </div>
    );
}
