"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Calendar,
    FileText,
    CreditCard,
    Search,
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import TenantHeader from "./components/TenantHeader";

const stats = [
    {
        label: "Active Leases",
        value: "2",
        icon: FileText,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        change: "+1 this month",
        trend: "up",
    },
    {
        label: "Upcoming Bookings",
        value: "3",
        icon: Calendar,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        change: "Next in 4 days",
        trend: "neutral",
    },
    {
        label: "Total Paid",
        value: "$8,400",
        icon: CreditCard,
        color: "text-green-500",
        bg: "bg-green-500/10",
        change: "+$1,200 last cycle",
        trend: "up",
    },
    {
        label: "Properties Saved",
        value: "12",
        icon: Search,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        change: "3 new matches",
        trend: "up",
    },
];

const recentBookings = [
    {
        id: "bk-001",
        unit: "Unit 3A – Green Apartments",
        dates: "Mar 5 – Mar 12, 2026",
        status: "CONFIRMED",
        price: "$840",
    },
    {
        id: "bk-002",
        unit: "Studio Loft – Heights Tower",
        dates: "Apr 1 – Apr 3, 2026",
        status: "PENDING",
        price: "$320",
    },
];

const recentPayments = [
    { id: "p-001", description: "Monthly Rent – Lease #L-0041", date: "Feb 1, 2026", amount: "$1,200", status: "PAID" },
    { id: "p-002", description: "Booking – Unit 3A", date: "Jan 20, 2026", amount: "$840", status: "PAID" },
    { id: "p-003", description: "Security Deposit", date: "Jan 5, 2026", amount: "$2,400", status: "PAID" },
];

const statusMap: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending", className: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
    PAID: { label: "Paid", className: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
};

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function TenantDashboardPage() {
    const now = new Date();
    const greeting =
        now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

    return (
        <div>
            <TenantHeader title="Dashboard" subtitle={`${greeting}! Here's an overview of your tenancy.`} />

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

                {/* Two columns: bookings + payments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <motion.section variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h2 className="font-display text-base font-semibold text-foreground">Recent Bookings</h2>
                            <Link href="/tenant/bookings" className="flex items-center gap-1 text-xs text-accent hover:underline">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border/40">
                            {recentBookings.map((b) => {
                                const s = statusMap[b.status];
                                return (
                                    <Link key={b.id} href={`/tenant/bookings/${b.id}`}>
                                        <div className="px-5 py-4 hover:bg-secondary/40 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{b.unit}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{b.dates}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <span className="text-sm font-bold text-foreground">{b.price}</span>
                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${s.className}`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.section>

                    {/* Recent Payments */}
                    <motion.section variants={fadeUp} initial="hidden" animate="show" style={{ transitionDelay: "0.1s" }} className="glass-card rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h2 className="font-display text-base font-semibold text-foreground">Recent Payments</h2>
                            <Link href="/tenant/payments" className="flex items-center gap-1 text-xs text-accent hover:underline">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border/40">
                            {recentPayments.map((p) => {
                                const s = statusMap[p.status];
                                return (
                                    <div key={p.id} className="px-5 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{p.description}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{p.date}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className="text-sm font-bold text-foreground">{p.amount}</span>
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
                            { href: "/tenant/browse", icon: Search, label: "Browse Properties", color: "text-purple-500", bg: "bg-purple-500/10" },
                            { href: "/tenant/bookings", icon: Calendar, label: "Make a Booking", color: "text-amber-500", bg: "bg-amber-500/10" },
                            { href: "/tenant/leases", icon: FileText, label: "View Leases", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { href: "/tenant/payments", icon: CreditCard, label: "Pay Rent", color: "text-green-500", bg: "bg-green-500/10" },
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
