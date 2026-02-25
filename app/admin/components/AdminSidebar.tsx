"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    UserCheck,
    Building2,
    Calendar,
    FileText,
    CreditCard,
    Users,
    User,
    LogOut,
    Home,
    X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/landlords", label: "Landlords", icon: UserCheck },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/leases", label: "Leases", icon: FileText },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/profile", label: "Profile", icon: User },
];

interface AdminSidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const SidebarContent = () => (
        <aside className="flex flex-col h-full w-[260px] bg-white border-r border-gray-200 overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.06)]">
            {/* Logo area */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-[hsl(35,85%,55%)] shrink-0" />
                    <span className="font-display text-gray-900 text-lg font-semibold truncate">
                        MBU Properties
                    </span>
                </Link>
                {/* Close button on mobile */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href} onClick={onClose}>
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
                                        layoutId="adminActiveIndicator"
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

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:flex h-screen shrink-0">
                <SidebarContent />
            </div>

            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 bg-black/40 z-40"
                            onClick={onClose}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ type: "spring", damping: 26, stiffness: 300 }}
                            className="lg:hidden fixed top-0 left-0 h-full z-50"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
