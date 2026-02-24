"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Calendar, DollarSign, ArrowRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../components/TenantHeader";

type LeaseStatus = "ACTIVE" | "ENDED";
type PaymentCycle = "MONTHLY" | "YEARLY";

const mockLeases = [
    {
        id: "l-001",
        unit: "Unit 5B – Riverside Complex",
        property: "Riverside Complex",
        city: "New York",
        startDate: "2025-09-01",
        endDate: "2026-08-31",
        rentAmount: 1800,
        paymentCycle: "MONTHLY" as PaymentCycle,
        status: "ACTIVE" as LeaseStatus,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
        nextPayment: "2026-03-01",
    },
    {
        id: "l-002",
        unit: "Studio 2A – Midtown Suites",
        property: "Midtown Suites",
        city: "Chicago",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        rentAmount: 950,
        paymentCycle: "MONTHLY" as PaymentCycle,
        status: "ENDED" as LeaseStatus,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
        nextPayment: null,
    },
];

const statusConfig: Record<LeaseStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    ACTIVE: { label: "Active", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    ENDED: { label: "Ended", className: "text-slate-600 bg-slate-50 border-slate-200", icon: XCircle },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getProgress(start: string, end: string) {
    const now = Date.now();
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.min(100, Math.max(0, Math.round(((now - s) / (e - s)) * 100)));
}

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
    }),
};

export default function LeasesPage() {
    return (
        <div>
            <TenantHeader title="My Leases" subtitle="Track your long-term rental agreements" />

            <div className="p-6 max-w-5xl mx-auto space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Active Leases", value: mockLeases.filter(l => l.status === "ACTIVE").length, color: "text-green-600", bg: "bg-green-50 border-green-200" },
                        { label: "Ended Leases", value: mockLeases.filter(l => l.status === "ENDED").length, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" },
                        { label: "Monthly Commitment", value: `$${mockLeases.filter(l => l.status === "ACTIVE").reduce((a, l) => a + l.rentAmount, 0).toLocaleString()}`, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-2xl border px-5 py-4 ${s.bg}`}>
                            <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Lease cards */}
                <div className="space-y-4">
                    {mockLeases.map((lease, i) => {
                        const s = statusConfig[lease.status];
                        const StatusIcon = s.icon;
                        const progress = getProgress(lease.startDate, lease.endDate);
                        return (
                            <motion.div
                                key={lease.id}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="show"
                            >
                                <Link href={`/tenant/leases/${lease.id}`}>
                                    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                                        <div className="flex gap-0">
                                            <div className="w-28 sm:w-36 shrink-0 relative overflow-hidden">
                                                <img
                                                    src={lease.image}
                                                    alt={lease.unit}
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 p-4 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm text-foreground truncate group-hover:text-accent transition-colors">{lease.unit}</p>
                                                        <p className="text-xs text-muted-foreground">{lease.city}</p>
                                                    </div>
                                                    <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${s.className}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {s.label}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-accent" />
                                                        <span>{formatDate(lease.startDate)} → {formatDate(lease.endDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <DollarSign className="h-3.5 w-3.5 text-accent" />
                                                        <span>${lease.rentAmount.toLocaleString()} / {lease.paymentCycle.toLowerCase()}</span>
                                                    </div>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="mt-3 space-y-1">
                                                    <div className="flex justify-between text-[11px] text-muted-foreground">
                                                        <span>Lease progress</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-accent transition-all"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {lease.nextPayment && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Next payment: {formatDate(lease.nextPayment)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <Link href="/tenant/browse">
                    <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Browse Long-Term Rentals
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
