"use client";

import { useState, createContext, useContext } from "react";
import AdminSidebar from "./components/AdminSidebar";

interface AdminLayoutContextValue {
    openMenu: () => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextValue>({
    openMenu: () => { },
});

export function useAdminLayout() {
    return useContext(AdminLayoutContext);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <main className="flex-1 overflow-y-auto">
                    <AdminLayoutContext.Provider value={{ openMenu: () => setSidebarOpen(true) }}>
                        {children}
                    </AdminLayoutContext.Provider>
                </main>
            </div>
        </div>
    );
}
