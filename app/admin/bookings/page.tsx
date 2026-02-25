"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, XCircle, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "../components/AdminHeader";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

const mockBookings = [
    { id: "bk-301", unit: "Unit 3A – Green Apartments", tenant: "Alice Uwimana", landlord: "Jean Habimana", checkIn: "2026-03-05", checkOut: "2026-03-12", totalPrice: 840, status: "CONFIRMED" as BookingStatus },
    { id: "bk-302", unit: "Studio Loft – Heights Tower", tenant: "Marie Claire", landlord: "Peter Nkurunziza", checkIn: "2026-04-01", checkOut: "2026-04-03", totalPrice: 320, status: "PENDING" as BookingStatus },
    { id: "bk-303", unit: "Room 12 – Garden View", tenant: "Eric Mugabo", landlord: "Grace Mukamana", checkIn: "2026-03-15", checkOut: "2026-03-18", totalPrice: 450, status: "PENDING" as BookingStatus },
    { id: "bk-304", unit: "Villa Suite – Sunset Villas", tenant: "David Iradukunda", landlord: "Jean Habimana", checkIn: "2026-02-10", checkOut: "2026-02-14", totalPrice: 1200, status: "CONFIRMED" as BookingStatus },
    { id: "bk-305", unit: "Unit 5B – Green Apartments", tenant: "Sarah Ingabire", landlord: "Jean Habimana", checkIn: "2026-01-20", checkOut: "2026-01-25", totalPrice: 600, status: "CANCELLED" as BookingStatus },
    { id: "bk-306", unit: "Room 3 – Lake Kivu Duplex", tenant: "Patrick Uwase", landlord: "Alice Uwimana", checkIn: "2026-04-10", checkOut: "2026-04-15", totalPrice: 750, status: "PENDING" as BookingStatus },
];

const statusConfig: Record<BookingStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" as const } }),
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminBookingsPage() {
    const [filter, setFilter] = useState<"ALL" | BookingStatus>("ALL");
    const filtered = filter === "ALL" ? mockBookings : mockBookings.filter((b) => b.status === filter);

    const confirmedCount = mockBookings.filter((b) => b.status === "CONFIRMED").length;
    const pendingCount = mockBookings.filter((b) => b.status === "PENDING").length;
    const cancelledCount = mockBookings.filter((b) => b.status === "CANCELLED").length;

    return (
        <div>
            <AdminHeader title="All Bookings" subtitle="Manage and confirm booking requests" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{confirmedCount}</p>
                            <p className="text-xs text-muted-foreground">Confirmed</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{pendingCount}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{cancelledCount}</p>
                            <p className="text-xs text-muted-foreground">Cancelled</p>
                        </div>
                    </motion.div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((s) => (
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

                {/* Bookings table */}
                <motion.div className="glass-card rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>Unit / Tenant</span>
                        <span>Dates</span>
                        <span>Price</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    <div className="divide-y divide-border/40">
                        {filtered.map((booking, i) => {
                            const s = statusConfig[booking.status];
                            const StatusIcon = s.icon;
                            const nights = Math.round(
                                (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            );
                            return (
                                <motion.div
                                    key={booking.id}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors items-center"
                                >
                                    {/* Unit / Tenant */}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{booking.unit}</p>
                                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {booking.tenant}</span>
                                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {booking.landlord}</span>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-accent" />
                                        {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                                        <span className="text-foreground/40 ml-1">({nights}n)</span>
                                    </div>

                                    {/* Price */}
                                    <span className="text-sm font-bold text-foreground font-display whitespace-nowrap">
                                        ${booking.totalPrice.toLocaleString()}
                                    </span>

                                    {/* Status */}
                                    <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border w-fit ${s.className}`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {s.label}
                                    </span>

                                    {/* Actions */}
                                    {booking.status === "PENDING" ? (
                                        <div className="flex gap-2">
                                            <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white">Confirm</Button>
                                            <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">Cancel</Button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/50">—</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No bookings found.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
