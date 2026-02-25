import type { Metadata } from "next";
import LandlordSidebar from "./components/LandlordSidebar";

export const metadata: Metadata = {
    title: "Landlord Portal – MBU Properties",
    description: "Manage your properties, bookings, leases, and revenue.",
};

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <LandlordSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
