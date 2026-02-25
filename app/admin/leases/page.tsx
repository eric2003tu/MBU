"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, User, Building2, Calendar, CreditCard } from "lucide-react";
import AdminHeader from "../components/AdminHeader";

type LeaseStatus = "ACTIVE" | "ENDED";
type PaymentCycle = "MONTHLY" | "YEARLY";

const mockLeases = [
    { id: "ls-001", unit: "Unit 5B – Green Apartments", tenant: "Alice Uwimana", landlord: "Jean Habimana", startDate: "2025-08-01", endDate: "2026-08-01", rentAmount: 1800, paymentCycle: "MONTHLY" as PaymentCycle, status: "ACTIVE" as LeaseStatus },
    { id: "ls-002", unit: "Room 3 – Garden View", tenant: "Eric Mugabo", landlord: "Grace Mukamana", startDate: "2025-10-15", endDate: "2026-10-15", rentAmount: 950, paymentCycle: "MONTHLY" as PaymentCycle, status: "ACTIVE" as LeaseStatus },
    { id: "ls-003", unit: "Studio A – Heights Tower", tenant: "Marie Claire", landlord: "Peter Nkurunziza", startDate: "2025-06-01", endDate: "2026-06-01", rentAmount: 12000, paymentCycle: "YEARLY" as PaymentCycle, status: "ACTIVE" as LeaseStatus },
    { id: "ls-004", unit: "Unit 2A – Sunset Villas", tenant: "David Iradukunda", landlord: "Jean Habimana", startDate: "2024-03-01", endDate: "2025-03-01", rentAmount: 1500, paymentCycle: "MONTHLY" as PaymentCycle, status: "ENDED" as LeaseStatus },
    { id: "ls-005", unit: "Room 8 – Heights Tower", tenant: "Sarah Ingabire", landlord: "Peter Nkurunziza", startDate: "2024-09-01", endDate: "2025-09-01", rentAmount: 800, paymentCycle: "MONTHLY" as PaymentCycle, status: "ENDED" as LeaseStatus },
];

const statusConfig: Record<LeaseStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    ACTIVE: { label: "Active", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    ENDED: { label: "Ended", className: "text-gray-600 bg-gray-50 border-gray-200", icon: Clock },
};

const cycleColors: Record<PaymentCycle, string> = {
    MONTHLY: "text-blue-600 bg-blue-50 border-blue-200",
    YEARLY: "text-purple-600 bg-purple-50 border-purple-200",
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" as const } }),
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminLeasesPage() {
    const [filter, setFilter] = useState<"ALL" | LeaseStatus>("ALL");
    const filtered = filter === "ALL" ? mockLeases : mockLeases.filter((l) => l.status === filter);

    const activeCount = mockLeases.filter((l) => l.status === "ACTIVE").length;
    const totalRevenue = mockLeases.filter((l) => l.status === "ACTIVE").reduce((sum, l) => sum + l.rentAmount, 0);

    return (
        <div>
            <AdminHeader title="All Leases" subtitle="Track long-term rental agreements" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{activeCount}</p>
                            <p className="text-xs text-muted-foreground">Active Leases</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{mockLeases.length - activeCount}</p>
                            <p className="text-xs text-muted-foreground">Ended Leases</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">${totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Active Monthly Revenue</p>
                        </div>
                    </motion.div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "ACTIVE", "ENDED"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filter === s
                                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}
                        >
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Leases table */}
                <motion.div className="glass-card rounded-2xl overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>Unit / Parties</span>
                        <span>Period</span>
                        <span>Rent</span>
                        <span>Cycle</span>
                        <span>Status</span>
                    </div>

                    <div className="divide-y divide-border/40">
                        {filtered.map((lease, i) => {
                            const s = statusConfig[lease.status];
                            const StatusIcon = s.icon;
                            return (
                                <motion.div
                                    key={lease.id}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors items-center"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{lease.unit}</p>
                                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {lease.tenant}</span>
                                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {lease.landlord}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-accent" />
                                        {formatDate(lease.startDate)} – {formatDate(lease.endDate)}
                                    </div>

                                    <span className="text-sm font-bold text-foreground font-display whitespace-nowrap">
                                        ${lease.rentAmount.toLocaleString()}
                                    </span>

                                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border w-fit ${cycleColors[lease.paymentCycle]}`}>
                                        {lease.paymentCycle}
                                    </span>

                                    <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border w-fit ${s.className}`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {s.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No leases found.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
