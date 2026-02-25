"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertCircle, Calendar, DollarSign, Users } from "lucide-react";
import LandlordHeader from "../components/LandlordHeader";

type LeaseStatus = "ACTIVE" | "ENDED";
type PaymentCycle = "MONTHLY" | "YEARLY";

const mockLeases = [
    {
        id: "ls-101",
        unit: "Unit 1A – Sunset Apartments",
        property: "Sunset Apartments",
        tenant: "Peter Nkurunziza",
        startDate: "2025-09-01",
        endDate: "2026-08-31",
        rentAmount: 1200,
        paymentCycle: "MONTHLY" as PaymentCycle,
        status: "ACTIVE" as LeaseStatus,
    },
    {
        id: "ls-102",
        unit: "Unit 2A – Sunset Apartments",
        property: "Sunset Apartments",
        tenant: "Grace Mukamana",
        startDate: "2025-06-01",
        endDate: "2026-05-31",
        rentAmount: 1800,
        paymentCycle: "MONTHLY" as PaymentCycle,
        status: "ACTIVE" as LeaseStatus,
    },
    {
        id: "ls-103",
        unit: "Unit 3A – Sunset Apartments",
        property: "Sunset Apartments",
        tenant: "Emmanuel Ndayisaba",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        rentAmount: 22000,
        paymentCycle: "YEARLY" as PaymentCycle,
        status: "ACTIVE" as LeaseStatus,
    },
    {
        id: "ls-104",
        unit: "Room 1 – Garden View",
        property: "Garden View Residences",
        tenant: "Jeanne Uwase",
        startDate: "2024-06-01",
        endDate: "2025-05-31",
        rentAmount: 950,
        paymentCycle: "MONTHLY" as PaymentCycle,
        status: "ENDED" as LeaseStatus,
    },
    {
        id: "ls-105",
        unit: "Studio B – Heights Tower",
        property: "Heights Tower",
        tenant: "Robert Mugisha",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        rentAmount: 15000,
        paymentCycle: "YEARLY" as PaymentCycle,
        status: "ENDED" as LeaseStatus,
    },
];

const statusConfig: Record<LeaseStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    ACTIVE: { label: "Active", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    ENDED: { label: "Ended", className: "text-gray-600 bg-gray-50 border-gray-200", icon: AlertCircle },
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
    }),
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function LandlordLeasesPage() {
    const activeCount = mockLeases.filter((l) => l.status === "ACTIVE").length;
    const endedCount = mockLeases.filter((l) => l.status === "ENDED").length;

    return (
        <div>
            <LandlordHeader title="Leases" subtitle="Manage long-term rental contracts" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary pills */}
                <div className="flex flex-wrap gap-3">
                    {(["All", "ACTIVE", "ENDED"] as const).map((s) => {
                        const count = s === "All" ? mockLeases.length : mockLeases.filter((l) => l.status === s).length;
                        return (
                            <div
                                key={s}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${s === "All"
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : s === "ACTIVE"
                                        ? "border-green-200 text-green-700 bg-green-50"
                                        : "border-gray-200 text-gray-600 bg-gray-50"
                                    }`}
                            >
                                <span>{s === "All" ? "All Leases" : statusConfig[s].label}</span>
                                <span className="h-5 w-5 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Leases list */}
                <div className="space-y-4">
                    {mockLeases.map((lease, i) => {
                        const s = statusConfig[lease.status];
                        const StatusIcon = s.icon;
                        return (
                            <motion.div
                                key={lease.id}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="show"
                            >
                                <div className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <p className="text-sm font-semibold text-foreground truncate">{lease.unit}</p>
                                                <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${s.className}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {s.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-3.5 w-3.5 text-accent" />
                                                    <span>{lease.tenant}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-accent" />
                                                    <span>{formatDate(lease.startDate)} → {formatDate(lease.endDate)}</span>
                                                </div>
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                                                    {lease.paymentCycle}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <DollarSign className="h-4 w-4 text-accent" />
                                            <span className="text-lg font-bold text-foreground font-display">
                                                ${lease.rentAmount.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                /{lease.paymentCycle === "MONTHLY" ? "mo" : "yr"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
