"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
    Users,
    UserCheck,
    Calendar,
    CreditCard,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    FileText,
    Shield,
    BarChart3,
} from "lucide-react";
import AdminHeader from "./components/AdminHeader";

const stats = [
    {
        label: "Total Users",
        value: "148",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        change: "+12 this month",
        trend: "up",
    },
    {
        label: "Pending Landlords",
        value: "5",
        icon: UserCheck,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        change: "3 new today",
        trend: "neutral",
    },
    {
        label: "Active Bookings",
        value: "32",
        icon: Calendar,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        change: "+8 this week",
        trend: "up",
    },
    {
        label: "Monthly Revenue",
        value: "$42,800",
        icon: CreditCard,
        color: "text-green-500",
        bg: "bg-green-500/10",
        change: "+15% from last month",
        trend: "up",
    },
];

const pendingLandlords = [
    { id: "l-001", name: "Jean Habimana", email: "jean@example.com", date: "Feb 24, 2026", govId: "ID-98234" },
    { id: "l-002", name: "Grace Mukamana", email: "grace@example.com", date: "Feb 23, 2026", govId: "ID-54321" },
    { id: "l-003", name: "Peter Nkurunziza", email: "peter@example.com", date: "Feb 22, 2026", govId: "ID-67890" },
];

const recentBookings = [
    { id: "bk-201", unit: "Unit 2B – Sunset Apartments", tenant: "Alice Uwimana", dates: "Mar 10 – Mar 14, 2026", status: "PENDING", price: "$480" },
    { id: "bk-202", unit: "Room 5 – Garden View", tenant: "Marie Claire", dates: "Mar 18 – Mar 20, 2026", status: "CONFIRMED", price: "$240" },
    { id: "bk-203", unit: "Studio A – Heights Tower", tenant: "Eric Mugabo", dates: "Apr 1 – Apr 5, 2026", status: "PENDING", price: "$600" },
];

const statusMap: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending", className: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function AdminDashboardPage() {
    const now = new Date();
    const greeting =
        now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

    return (
        <div>
            <AdminHeader title="Admin Dashboard" subtitle={`${greeting}! Here's your system overview.`} />

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
                >
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            className="glass-card rounded-2xl p-5 flex items-start gap-4 group hover:shadow-lg transition-shadow"
                        >
                            <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                                    <span className="text-xs text-muted-foreground/70">{stat.change}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Two columns: landlord applications + recent bookings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Landlord Applications */}
                    <motion.section variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h2 className="font-display text-base font-semibold text-foreground">Pending Landlord Applications</h2>
                            <Link href="/admin/landlords" className="flex items-center gap-1 text-xs text-accent hover:underline">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border/40">
                            {pendingLandlords.map((landlord) => (
                                <div key={landlord.id} className="px-5 py-4 hover:bg-secondary/40 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{landlord.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{landlord.email} · Applied {landlord.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                                                Approve
                                            </button>
                                            <button className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Recent Bookings */}
                    <motion.section variants={fadeUp} initial="hidden" animate="show" style={{ transitionDelay: "0.1s" }} className="glass-card rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h2 className="font-display text-base font-semibold text-foreground">Recent Bookings</h2>
                            <Link href="/admin/bookings" className="flex items-center gap-1 text-xs text-accent hover:underline">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border/40">
                            {recentBookings.map((b) => {
                                const s = statusMap[b.status];
                                return (
                                    <div key={b.id} className="px-5 py-4 hover:bg-secondary/40 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{b.unit}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{b.tenant} · {b.dates}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className="text-sm font-bold text-foreground">{b.price}</span>
                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${s.className}`}>
                                                    {s.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.section>
                </div>

                {/* Quick Actions */}
                <motion.section variants={fadeUp} initial="hidden" animate="show">
                    <h2 className="font-display text-base font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { href: "/admin/landlords", icon: UserCheck, label: "Approve Landlords", color: "text-amber-500", bg: "bg-amber-500/10" },
                            { href: "/admin/properties", icon: Building2, label: "Manage Properties", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { href: "/admin/payments", icon: CreditCard, label: "View Payments", color: "text-green-500", bg: "bg-green-500/10" },
                            { href: "/admin/users", icon: Users, label: "Manage Users", color: "text-purple-500", bg: "bg-purple-500/10" },
                        ].map((action) => (
                            <Link key={action.href} href={action.href}>
                                <div className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
                                    <div className={`h-12 w-12 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <action.icon className={`h-6 w-6 ${action.color}`} />
                                    </div>
                                    <p className="text-sm font-medium text-foreground leading-snug">{action.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
