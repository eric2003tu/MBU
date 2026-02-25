"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Building2,
    Calendar,
    FileText,
    CreditCard,
    User,
    LogOut,
    Home,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
    { href: "/landlord", label: "Dashboard", icon: LayoutDashboard },
    { href: "/landlord/properties", label: "My Properties", icon: Building2 },
    { href: "/landlord/bookings", label: "Bookings", icon: Calendar },
    { href: "/landlord/leases", label: "Leases", icon: FileText },
    { href: "/landlord/payments", label: "Payments", icon: CreditCard },
    { href: "/landlord/profile", label: "Profile", icon: User },
];

export default function LandlordSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "L";

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <aside className="flex flex-col h-screen w-[260px] bg-white border-r border-gray-200 shrink-0 overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.06)]">
            {/* Logo area */}
            <div className="flex items-center px-4 h-16 border-b border-gray-100 shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-[hsl(35,85%,55%)] shrink-0" />
                    <span className="font-display text-gray-900 text-lg font-semibold truncate">
                        MBU Properties
                    </span>
                </Link>
            </div>

            {/* Role badge */}
            <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[hsl(35,85%,55%)]/10 border-2 border-[hsl(35,85%,55%)]/30 flex items-center justify-center text-[hsl(35,85%,55%)] font-bold text-xs shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-gray-900 text-sm font-semibold truncate">
                            {user?.full_name ?? "Landlord"}
                        </p>
                        <p className="text-xs text-[hsl(35,85%,55%)] font-medium">Landlord</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/landlord"
                            ? pathname === "/landlord"
                            : pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer ${isActive
                                    ? "bg-[hsl(35,85%,55%)]/10 text-[hsl(35,85%,55%)]"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-[hsl(35,85%,55%)]" : ""
                                        }`}
                                />
                                <span className="text-sm font-medium truncate">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="landlordActiveIndicator"
                                        className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(35,85%,55%)]"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })
                }
            </nav>

            {/* Logout */}
            <div className="px-2 py-4 border-t border-gray-100 shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
                >
                    <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
