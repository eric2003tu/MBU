"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, Calendar, Clock, CheckCircle2, XCircle,
    CreditCard, Loader2, AlertCircle, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../../components/TenantHeader";
import { bookingClient, type Booking } from "@/lib/bookingClient";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

const statusConfig: Record<BookingStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending Review", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDateTime(d: string) {
    return new Date(d).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
    });
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        bookingClient
            .getById(id)
            .then((data) => setBooking(data))
            .catch((err: Error) => setError(err.message ?? "Failed to load booking"))
            .finally(() => setLoading(false));
    }, [id]);

    /* ── Loading ── */
    if (loading) {
        return (
            <div>
                <TenantHeader title="Booking Details" />
                <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                    <p className="text-muted-foreground text-sm">Loading booking details…</p>
                </div>
            </div>
        );
    }

    /* ── Error / Not found ── */
    if (error || !booking) {
        return (
            <div>
                <TenantHeader title="Booking Not Found" />
                <div className="p-6 text-center py-20">
                    <div className="inline-flex h-20 w-20 rounded-full bg-red-50 items-center justify-center mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">Booking Not Found</h2>
                    <p className="text-muted-foreground mb-6">{error ?? "This booking could not be found."}</p>
                    <Link href="/tenant/bookings">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bookings
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    /* ── Derived data ── */
    const status = (booking.status as BookingStatus) || "PENDING";
    const s = statusConfig[status] ?? statusConfig.PENDING;
    const StatusIcon = s.icon;
    const nights = Math.max(
        1,
        Math.round(
            (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
            (1000 * 60 * 60 * 24)
        )
    );
    const totalPrice = Number(booking.total_price);
    const unitName = booking.unit?.unit_name ?? `Unit ${booking.unit_id.slice(0, 8)}`;

    return (
        <div>
            <TenantHeader title="Booking Details" subtitle={`Booking #${booking.booking_id.slice(0, 8).toUpperCase()}`} />

            <div className="p-6 mx-auto space-y-6">
                <Link href="/tenant/bookings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors w-fit group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Bookings
                </Link>

                {/* Status + ID header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-6 space-y-4"
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="font-display text-xl font-bold text-foreground">{unitName}</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Booking ID: <span className="font-mono text-xs">{booking.booking_id}</span>
                            </p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${s.className}`}>
                            <StatusIcon className="h-4 w-4" />
                            {s.label}
                        </span>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Check-in", value: formatDate(booking.check_in), icon: Calendar },
                            { label: "Check-out", value: formatDate(booking.check_out), icon: Calendar },
                            { label: "Duration", value: `${nights} night${nights !== 1 ? "s" : ""}`, icon: Clock },
                            { label: "Total Price", value: `$${totalPrice.toLocaleString()}`, icon: DollarSign },
                        ].map((item) => (
                            <div key={item.label} className="bg-secondary rounded-xl p-4">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <item.icon className="h-3.5 w-3.5 text-accent" />
                                    <span className="text-xs">{item.label}</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Two-column: Pricing + Status info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Pricing breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-5 space-y-3"
                    >
                        <h3 className="font-display font-semibold text-foreground">Pricing Breakdown</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                                <span>${totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-foreground">
                                <span>Total</span>
                                <span className="font-display">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {status === "PENDING" && (
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-2">
                                <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-700">
                                    Payment will be collected once the landlord confirms your booking.
                                </p>
                            </div>
                        )}

                        {status === "CONFIRMED" && (
                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mt-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                <p className="text-xs text-green-700">
                                    Your booking has been confirmed by the landlord.
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Booking metadata */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="glass-card rounded-2xl p-5 space-y-4"
                    >
                        <h3 className="font-display font-semibold text-foreground">Booking Information</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Booking ID", value: booking.booking_id },
                                { label: "Unit ID", value: booking.unit_id },
                                ...(booking.created_at
                                    ? [{ label: "Created", value: formatDateTime(booking.created_at) }]
                                    : []),
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                    <p className="text-sm font-medium text-foreground font-mono break-all">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {status === "PENDING" && (
                            <Button variant="outline" className="w-full text-sm text-red-600 border-red-200 hover:bg-red-50 mt-2">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                            </Button>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
