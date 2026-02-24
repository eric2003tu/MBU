import type { Metadata } from "next";
import TenantSidebar from "./components/TenantSidebar";

export const metadata: Metadata = {
    title: "Tenant Portal – EstateVue",
    description: "Manage your bookings, leases, and payments all in one place.",
};

export default function TenantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <TenantSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
