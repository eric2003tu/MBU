"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
    Building2,
    Home,
    CreditCard,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    FileText,
    Users,
    BarChart3,
} from "lucide-react";
import LandlordHeader from "./components/LandlordHeader";

const stats = [
    {
        label: "Total Properties",
        value: "6",
        icon: Building2,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        change: "+2 this quarter",
        trend: "up",
    },
    {
        label: "Active Units",
        value: "18",
        icon: Home,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        change: "3 vacant",
        trend: "neutral",
    },
    {
        label: "Monthly Revenue",
        value: "$12,400",
        icon: CreditCard,
        color: "text-green-500",
        bg: "bg-green-500/10",
        change: "+8% from last month",
        trend: "up",
    },
    {
        label: "Occupancy Rate",
        value: "83%",
        icon: BarChart3,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        change: "+5% improvement",
        trend: "up",
    },
];

const recentBookings = [
    { id: "bk-101", unit: "Unit 2B – Sunset Apartments", tenant: "Alice Uwimana", dates: "Mar 10 – Mar 14, 2026", status: "PENDING", price: "$480" },
    { id: "bk-102", unit: "Room 5 – Garden View", tenant: "Jean Habimana", dates: "Mar 18 – Mar 20, 2026", status: "CONFIRMED", price: "$240" },
    { id: "bk-103", unit: "Studio A – Heights Tower", tenant: "Marie Claire", dates: "Apr 1 – Apr 5, 2026", status: "PENDING", price: "$600" },
];

const recentPayments = [
    { id: "p-101", description: "Monthly Rent – Lease #L-102", tenant: "Peter Nkurunziza", date: "Feb 1, 2026", amount: "$1,200", status: "PAID" },
    { id: "p-102", description: "Booking – Unit 2B", tenant: "Alice Uwimana", date: "Jan 25, 2026", amount: "$480", status: "PAID" },
    { id: "p-103", description: "Monthly Rent – Lease #L-098", tenant: "Grace Mukamana", date: "Feb 1, 2026", amount: "$950", status: "OVERDUE" },
];

const statusMap: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending", className: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
    PAID: { label: "Paid", className: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    OVERDUE: { label: "Overdue", className: "text-red-600 bg-red-50 border-red-200", icon: AlertCircle },
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function LandlordDashboardPage() {
    const now = new Date();
    const greeting =
        now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

    return (
        <div>
            <LandlordHeader title="Dashboard" subtitle={`${greeting}! Here's your property overview.`} />

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
                            <h2 className="font-display text-base font-semibold text-foreground">Incoming Bookings</h2>
                            <Link href="/landlord/bookings" className="flex items-center gap-1 text-xs text-accent hover:underline">
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

                    {/* Recent Payments */}
                    <motion.section variants={fadeUp} initial="hidden" animate="show" style={{ transitionDelay: "0.1s" }} className="glass-card rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                            <h2 className="font-display text-base font-semibold text-foreground">Recent Payments</h2>
                            <Link href="/landlord/payments" className="flex items-center gap-1 text-xs text-accent hover:underline">
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
                                                <p className="text-xs text-muted-foreground mt-0.5">{p.tenant} · {p.date}</p>
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
                            { href: "/landlord/properties", icon: Building2, label: "Manage Properties", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { href: "/landlord/bookings", icon: Calendar, label: "View Bookings", color: "text-amber-500", bg: "bg-amber-500/10" },
                            { href: "/landlord/leases", icon: FileText, label: "View Leases", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { href: "/landlord/payments", icon: CreditCard, label: "Revenue Report", color: "text-green-500", bg: "bg-green-500/10" },
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
