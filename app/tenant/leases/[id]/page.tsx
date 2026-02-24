"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, DollarSign, FileText, CheckCircle2, XCircle, Phone, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../../components/TenantHeader";

type LeaseStatus = "ACTIVE" | "ENDED";

const leaseDetails: Record<string, {
    id: string; unit: string; property: string; city: string; address: string;
    startDate: string; endDate: string; rentAmount: number; paymentCycle: string;
    status: LeaseStatus; image: string; landlordName: string;
    landlordPhone: string; landlordEmail: string;
    payments: { date: string; amount: number; method: string; status: string }[];
}> = {
    "l-001": {
        id: "l-001", unit: "Unit 5B – Riverside Complex", property: "Riverside Complex",
        city: "New York", address: "300 Riverside Dr", startDate: "2025-09-01", endDate: "2026-08-31",
        rentAmount: 1800, paymentCycle: "MONTHLY", status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        landlordName: "David Chen", landlordPhone: "+1 (555) 111-2233", landlordEmail: "david@riverside.com",
        payments: [
            { date: "2026-02-01", amount: 1800, method: "Bank Transfer", status: "PAID" },
            { date: "2026-01-01", amount: 1800, method: "Bank Transfer", status: "PAID" },
            { date: "2025-12-01", amount: 1800, method: "Credit Card", status: "PAID" },
        ],
    },
    "l-002": {
        id: "l-002", unit: "Studio 2A – Midtown Suites", property: "Midtown Suites",
        city: "Chicago", address: "100 Michigan Ave", startDate: "2024-01-01", endDate: "2024-12-31",
        rentAmount: 950, paymentCycle: "MONTHLY", status: "ENDED",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        landlordName: "Emily Ross", landlordPhone: "+1 (555) 887-6654", landlordEmail: "emily@midtownsuites.com",
        payments: [
            { date: "2024-12-01", amount: 950, method: "Bank Transfer", status: "PAID" },
            { date: "2024-11-01", amount: 950, method: "Bank Transfer", status: "PAID" },
        ],
    },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getProgress(start: string, end: string) {
    const now = Date.now();
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.min(100, Math.max(0, Math.round(((now - s) / (e - s)) * 100)));
}

export default function LeaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const lease = leaseDetails[id];

    if (!lease) {
        return (
            <div>
                <TenantHeader title="Lease Not Found" />
                <div className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">This lease could not be found.</p>
                    <Link href="/tenant/leases"><Button variant="outline">← Back to Leases</Button></Link>
                </div>
            </div>
        );
    }

    const progress = getProgress(lease.startDate, lease.endDate);
    const isActive = lease.status === "ACTIVE";

    return (
        <div>
            <TenantHeader title="Lease Agreement" subtitle={`Lease #${lease.id.toUpperCase()}`} />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <Link href="/tenant/leases" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors w-fit">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Leases
                </Link>

                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
                    <div className="relative h-52 overflow-hidden">
                        <img src={lease.image} alt={lease.unit} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                            <div>
                                <h2 className="font-display text-xl font-bold text-white">{lease.unit}</h2>
                                <p className="text-sm text-white/70">{lease.address}, {lease.city}</p>
                            </div>
                            <span className={`text-sm font-medium px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${isActive ? "text-green-700 bg-green-50 border-green-200" : "text-slate-600 bg-slate-100 border-slate-200"}`}>
                                {isActive ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                {isActive ? "Active" : "Ended"}
                            </span>
                        </div>
                    </div>

                    {/* Lease Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">
                        {[
                            { label: "Start Date", value: formatDate(lease.startDate), icon: Calendar },
                            { label: "End Date", value: formatDate(lease.endDate), icon: Calendar },
                            { label: "Monthly Rent", value: `$${lease.rentAmount.toLocaleString()}`, icon: DollarSign },
                            { label: "Payment Cycle", value: lease.paymentCycle.charAt(0) + lease.paymentCycle.slice(1).toLowerCase(), icon: FileText },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                    <item.icon className="h-3.5 w-3.5" />
                                    <span className="text-xs">{item.label}</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Progress */}
                    <div className="px-5 py-4 border-t border-border/50">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span>Lease duration progress</span>
                            <span>{progress}% complete</span>
                        </div>
                        <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                className="h-full rounded-full bg-accent"
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-muted-foreground/70 mt-1">
                            <span>{formatDate(lease.startDate)}</span>
                            <span>{formatDate(lease.endDate)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Payment history + contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Payment history */}
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display font-semibold text-foreground">Payment History</h3>
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
                                <Download className="h-3 w-3" />
                                Export
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {lease.payments.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 bg-secondary/50 rounded-xl px-3 py-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">${p.amount}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()} · {p.method}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {isActive && (
                            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-1">
                                <DollarSign className="h-4 w-4 mr-2" />
                                Pay Next Cycle
                            </Button>
                        )}
                    </motion.div>

                    {/* Landlord */}
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-5 space-y-4">
                        <h3 className="font-display font-semibold text-foreground">Landlord</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm">
                                {lease.landlordName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-foreground">{lease.landlordName}</p>
                                <p className="text-xs text-muted-foreground">Property Owner</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <a href={`tel:${lease.landlordPhone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
                                <Phone className="h-4 w-4 text-accent" />{lease.landlordPhone}
                            </a>
                            <a href={`mailto:${lease.landlordEmail}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
                                <Mail className="h-4 w-4 text-accent" />{lease.landlordEmail}
                            </a>
                        </div>
                        <Button variant="outline" className="w-full text-sm">Contact Landlord</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
