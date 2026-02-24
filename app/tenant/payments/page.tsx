"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock, XCircle, Download, TrendingUp, DollarSign, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../components/TenantHeader";

type PaymentStatus = "PAID" | "PENDING" | "FAILED";

const mockPayments = [
    { id: "p-001", description: "Monthly Rent – Lease #L-0041 (Unit 5B)", date: "2026-02-01", amount: 1800, method: "Bank Transfer", status: "PAID" as PaymentStatus, type: "LEASE" },
    { id: "p-002", description: "Booking – Unit 3A (Green Apartments)", date: "2026-01-20", amount: 840, method: "Credit Card", status: "PAID" as PaymentStatus, type: "BOOKING" },
    { id: "p-003", description: "Monthly Rent – Lease #L-0041 (Unit 5B)", date: "2026-01-01", amount: 1800, method: "Bank Transfer", status: "PAID" as PaymentStatus, type: "LEASE" },
    { id: "p-004", description: "Security Deposit – Unit 5B", date: "2025-08-25", amount: 3600, method: "Bank Transfer", status: "PAID" as PaymentStatus, type: "DEPOSIT" },
    { id: "p-005", description: "Booking – Studio Loft (Heights Tower)", date: "2026-03-10", amount: 320, method: "Credit Card", status: "PENDING" as PaymentStatus, type: "BOOKING" },
    { id: "p-006", description: "Monthly Rent – Lease #L-0041 (Unit 5B)", date: "2025-12-01", amount: 1800, method: "Credit Card", status: "PAID" as PaymentStatus, type: "LEASE" },
];

const statusConfig: Record<PaymentStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    PAID: { label: "Paid", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    FAILED: { label: "Failed", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

const methodIcons: Record<string, string> = {
    "Bank Transfer": "🏦",
    "Credit Card": "💳",
    "Cash": "💵",
};

const typeColors: Record<string, string> = {
    LEASE: "text-blue-600 bg-blue-50 border-blue-200",
    BOOKING: "text-purple-600 bg-purple-50 border-purple-200",
    DEPOSIT: "text-slate-600 bg-slate-50 border-slate-200",
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

export default function PaymentsPage() {
    const [filter, setFilter] = useState<"ALL" | PaymentStatus>("ALL");

    const totalPaid = mockPayments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = mockPayments.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0);

    const filtered = filter === "ALL" ? mockPayments : mockPayments.filter((p) => p.status === filter);

    return (
        <div>
            <TenantHeader title="Payments" subtitle="Track all your rental payments" />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">${totalPaid.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Paid</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">${pendingAmount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                            <ArrowDownRight className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{mockPayments.length}</p>
                            <p className="text-xs text-muted-foreground">Total Transactions</p>
                        </div>
                    </motion.div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "PAID", "PENDING", "FAILED"] as const).map((s) => (
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
                    <Button variant="ghost" size="sm" className="ml-auto gap-1.5 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>

                {/* Payments table-like list */}
                <motion.div className="glass-card rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>Description</span>
                        <span>Date</span>
                        <span>Amount</span>
                        <span>Status</span>
                    </div>

                    <div className="divide-y divide-border/40">
                        {filtered.map((payment, i) => {
                            const s = statusConfig[payment.status];
                            const StatusIcon = s.icon;
                            return (
                                <motion.div
                                    key={payment.id}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors items-center"
                                >
                                    {/* Description */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center text-base shrink-0">
                                            {methodIcons[payment.method] ?? "💰"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{payment.description}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeColors[payment.type]}`}>
                                                    {payment.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{payment.method}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                                        {new Date(payment.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>

                                    {/* Amount */}
                                    <span className="text-sm font-bold text-foreground font-display whitespace-nowrap">
                                        ${payment.amount.toLocaleString()}
                                    </span>

                                    {/* Status */}
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
                            <DollarSign className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No payments found.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
