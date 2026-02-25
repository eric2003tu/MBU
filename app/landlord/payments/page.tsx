"use client";

import { motion, type Variants } from "framer-motion";
import { DollarSign, TrendingUp, CreditCard, Calendar, CheckCircle2, AlertCircle, Clock, ArrowDownRight, ArrowUpRight } from "lucide-react";
import LandlordHeader from "../components/LandlordHeader";

const revenueSummary = [
    { label: "Total Revenue", value: "$42,600", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", change: "+12%", trend: "up" },
    { label: "This Month", value: "$5,850", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", change: "+8%", trend: "up" },
    { label: "Pending Collection", value: "$2,150", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", change: "3 invoices", trend: "neutral" },
    { label: "Overdue", value: "$950", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", change: "1 invoice", trend: "down" },
];

const mockPayments = [
    { id: "pay-101", description: "Monthly Rent – Lease #L-101", tenant: "Peter Nkurunziza", property: "Sunset Apartments", date: "2026-02-01", amount: 1200, method: "Bank Transfer", status: "PAID" },
    { id: "pay-102", description: "Monthly Rent – Lease #L-102", tenant: "Grace Mukamana", property: "Sunset Apartments", date: "2026-02-01", amount: 1800, method: "Mobile Money", status: "PAID" },
    { id: "pay-103", description: "Booking Payment – BK-102", tenant: "Jean Habimana", property: "Garden View Residences", date: "2026-02-10", amount: 240, method: "Mobile Money", status: "PAID" },
    { id: "pay-104", description: "Monthly Rent – Lease #L-098", tenant: "Grace Mukamana", property: "Sunset Apartments", date: "2026-02-01", amount: 950, method: "Bank Transfer", status: "OVERDUE" },
    { id: "pay-105", description: "Booking Deposit – BK-103", tenant: "Marie Claire", property: "Heights Tower", date: "2026-02-15", amount: 300, method: "Mobile Money", status: "PENDING" },
    { id: "pay-106", description: "Yearly Lease – Lease #L-103", tenant: "Emmanuel Ndayisaba", property: "Sunset Apartments", date: "2026-01-01", amount: 22000, method: "Bank Transfer", status: "PAID" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    PAID: { label: "Paid", className: "text-green-700 bg-green-50 border-green-200" },
    PENDING: { label: "Pending", className: "text-amber-700 bg-amber-50 border-amber-200" },
    OVERDUE: { label: "Overdue", className: "text-red-700 bg-red-50 border-red-200" },
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function LandlordPaymentsPage() {
    return (
        <div>
            <LandlordHeader title="Payments & Revenue" subtitle="Track your income and outstanding payments" />

            <div className="p-6 mx-auto space-y-8">
                {/* Revenue summary */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
                >
                    {revenueSummary.map((stat) => (
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
                                    {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                                    {stat.trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                                    <span className="text-xs text-muted-foreground/70">{stat.change}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Payment history */}
                <motion.section variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/50">
                        <h2 className="font-display text-base font-semibold text-foreground">Payment History</h2>
                    </div>

                    {/* Table header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/30 bg-secondary/30">
                        <div className="col-span-4">Description</div>
                        <div className="col-span-2">Tenant</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-1">Method</div>
                        <div className="col-span-2 text-right">Amount</div>
                        <div className="col-span-1 text-right">Status</div>
                    </div>

                    {/* Table rows */}
                    <div className="divide-y divide-border/30">
                        {mockPayments.map((payment) => {
                            const st = statusConfig[payment.status];
                            return (
                                <div key={payment.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors">
                                    <div className="col-span-4">
                                        <p className="text-sm font-medium text-foreground truncate">{payment.description}</p>
                                        <p className="text-xs text-muted-foreground md:hidden mt-0.5">{payment.tenant} · {formatDate(payment.date)}</p>
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        <span className="text-sm text-muted-foreground truncate">{payment.tenant}</span>
                                    </div>
                                    <div className="col-span-2 hidden md:flex items-center">
                                        <span className="text-sm text-muted-foreground">{formatDate(payment.date)}</span>
                                    </div>
                                    <div className="col-span-1 hidden md:flex items-center">
                                        <span className="text-xs text-muted-foreground">{payment.method}</span>
                                    </div>
                                    <div className="col-span-2 flex items-center justify-end">
                                        <span className="text-sm font-bold text-foreground">${payment.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${st.className}`}>
                                            {st.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
