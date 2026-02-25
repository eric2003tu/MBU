"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserCheck, CheckCircle2, Clock, XCircle, Eye, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "../components/AdminHeader";

type LandlordStatus = "PENDING" | "APPROVED" | "REJECTED";

const mockLandlords = [
    {
        id: "l-001", name: "Jean Habimana", email: "jean@example.com", phone: "+250 788 123 456",
        governmentId: "ID-98234", address: "KG 123 St, Kigali", taxId: "TAX-001234",
        bankAccount: "****4567", preferredPayment: "Bank Transfer",
        appliedDate: "2026-02-24", status: "PENDING" as LandlordStatus,
    },
    {
        id: "l-002", name: "Grace Mukamana", email: "grace@example.com", phone: "+250 788 234 567",
        governmentId: "ID-54321", address: "KN 45 Ave, Kigali", taxId: "TAX-005678",
        bankAccount: "****8901", preferredPayment: "Mobile Money",
        appliedDate: "2026-02-23", status: "PENDING" as LandlordStatus,
    },
    {
        id: "l-003", name: "Peter Nkurunziza", email: "peter@example.com", phone: "+250 788 345 678",
        governmentId: "ID-67890", address: "KK 78 St, Kigali", taxId: "TAX-009012",
        bankAccount: "****2345", preferredPayment: "Bank Transfer",
        appliedDate: "2026-02-22", status: "PENDING" as LandlordStatus,
    },
    {
        id: "l-004", name: "Alice Uwimana", email: "alice@example.com", phone: "+250 788 456 789",
        governmentId: "ID-11223", address: "KG 90 Ave, Kigali", taxId: "TAX-003456",
        bankAccount: "****6789", preferredPayment: "Bank Transfer",
        appliedDate: "2026-02-15", status: "APPROVED" as LandlordStatus,
    },
    {
        id: "l-005", name: "Eric Mugabo", email: "eric@example.com", phone: "+250 788 567 890",
        governmentId: "ID-44556", address: "KN 12 St, Kigali", taxId: "TAX-007890",
        bankAccount: "****0123", preferredPayment: "Mobile Money",
        appliedDate: "2026-02-10", status: "REJECTED" as LandlordStatus,
    },
];

const statusConfig: Record<LandlordStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    PENDING: { label: "Pending", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    APPROVED: { label: "Approved", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    REJECTED: { label: "Rejected", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" as const } }),
};

export default function LandlordsPage() {
    const [filter, setFilter] = useState<"ALL" | LandlordStatus>("ALL");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = filter === "ALL" ? mockLandlords : mockLandlords.filter((l) => l.status === filter);

    const pendingCount = mockLandlords.filter((l) => l.status === "PENDING").length;
    const approvedCount = mockLandlords.filter((l) => l.status === "APPROVED").length;
    const rejectedCount = mockLandlords.filter((l) => l.status === "REJECTED").length;

    return (
        <div>
            <AdminHeader title="Landlord Applications" subtitle="Review and manage landlord applications" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{pendingCount}</p>
                            <p className="text-xs text-muted-foreground">Pending Review</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{approvedCount}</p>
                            <p className="text-xs text-muted-foreground">Approved</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{rejectedCount}</p>
                            <p className="text-xs text-muted-foreground">Rejected</p>
                        </div>
                    </motion.div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
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

                {/* Landlords list */}
                <div className="space-y-4">
                    {filtered.map((landlord, i) => {
                        const s = statusConfig[landlord.status];
                        const StatusIcon = s.icon;
                        const isExpanded = expandedId === landlord.id;

                        return (
                            <motion.div
                                key={landlord.id}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="show"
                                className="glass-card rounded-2xl overflow-hidden"
                            >
                                <div className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link href={`/admin/landlords/${landlord.id}`} className="text-sm font-semibold text-foreground truncate hover:text-accent transition-colors">{landlord.name}</Link>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{landlord.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{landlord.phone}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground/70 mt-1">Applied {landlord.appliedDate}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${s.className}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {s.label}
                                            </span>
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : landlord.id)}
                                                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="border-t border-border/50 px-5 py-4 bg-secondary/20"
                                    >
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Government ID</p>
                                                <p className="font-medium text-foreground">{landlord.governmentId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Tax ID</p>
                                                <p className="font-medium text-foreground">{landlord.taxId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Bank Account</p>
                                                <p className="font-medium text-foreground">{landlord.bankAccount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Payment Preference</p>
                                                <p className="font-medium text-foreground">{landlord.preferredPayment}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-muted-foreground mb-1">Physical Address</p>
                                                <p className="font-medium text-foreground flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />{landlord.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-4 pt-4 border-t border-border/30">
                                            <Link href={`/admin/landlords/${landlord.id}`}>
                                                <Button size="sm" variant="outline" className="gap-1.5">
                                                    <Eye className="h-3.5 w-3.5" /> View Full Details
                                                </Button>
                                            </Link>
                                            {landlord.status === "PENDING" && (
                                                <>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                                                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5">
                                                        <XCircle className="h-3.5 w-3.5" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <UserCheck className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No landlord applications found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
