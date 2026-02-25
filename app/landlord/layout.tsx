"use client";

import { useState, createContext, useContext } from "react";
import LandlordSidebar from "./components/LandlordSidebar";

interface LandlordLayoutContextValue {
    openMenu: () => void;
}

export const LandlordLayoutContext = createContext<LandlordLayoutContextValue>({
    openMenu: () => { },
});

export function useLandlordLayout() {
    return useContext(LandlordLayoutContext);
}

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <LandlordSidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <main className="flex-1 overflow-y-auto">
                    <LandlordLayoutContext.Provider value={{ openMenu: () => setSidebarOpen(true) }}>
                        {children}
                    </LandlordLayoutContext.Provider>
                </main>
            </div>
        </div>
    );
}
