import type { Metadata } from "next";
import AdminSidebar from "./components/AdminSidebar";

export const metadata: Metadata = {
    title: "Admin Portal – MBU Properties",
    description: "Manage landlords, properties, bookings, leases, and system users.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
