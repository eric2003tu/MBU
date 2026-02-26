"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Calendar, CheckCircle2, Clock, XCircle, ArrowRight, Plus,
    Loader2, AlertCircle, CalendarX2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../components/TenantHeader";
import { bookingClient, type Booking } from "@/lib/bookingClient";
import { getAuthToken } from "@/lib/auth";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

const statusConfig: Record<BookingStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
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

/** Decode user_id from JWT */
function getUserIdFromToken(): string | null {
    const token = getAuthToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub ?? payload.user_id ?? null;
    } catch {
        return null;
    }
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"All" | BookingStatus>("All");

    useEffect(() => {
        setLoading(true);
        setError(null);

        const userId = getUserIdFromToken();
        bookingClient
            .getAll(userId ? { user_id: userId } : undefined)
            .then((data) => setBookings(data))
            .catch((err: Error) => setError(err.message ?? "Failed to load bookings"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

    const countByStatus = (s: BookingStatus) => bookings.filter((b) => b.status === s).length;

    return (
        <div>
            <TenantHeader title="My Bookings" subtitle="Manage your short-term rental bookings" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary pills */}
                <div className="flex flex-wrap gap-3">
                    {(["All", "CONFIRMED", "PENDING", "CANCELLED"] as const).map((s) => {
                        const count = s === "All" ? bookings.length : countByStatus(s);
                        const isActive = filter === s;
                        return (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${isActive
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : s === "CONFIRMED"
                                        ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                                        : s === "PENDING"
                                            ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                                            : s === "CANCELLED"
                                                ? "border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                                                : "border-border text-muted-foreground hover:bg-secondary"
                                    }`}
                            >
                                <span>{s === "All" ? "All" : statusConfig[s].label}</span>
                                <span className="h-5 w-5 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                    <Link href="/tenant/browse" className="ml-auto">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            New Booking
                        </Button>
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                        <p className="text-muted-foreground text-sm">Loading your bookings…</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="glass-card rounded-2xl p-8 text-center space-y-3">
                        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                        <h3 className="font-display font-semibold text-foreground">Failed to load bookings</h3>
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="glass-card rounded-2xl p-8 text-center space-y-3">
                        <CalendarX2 className="h-10 w-10 text-muted-foreground mx-auto" />
                        <h3 className="font-display font-semibold text-foreground">
                            {filter === "All" ? "No bookings yet" : `No ${statusConfig[filter].label.toLowerCase()} bookings`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {filter === "All"
                                ? "Browse available properties to make your first booking."
                                : "Try selecting a different filter above."}
                        </p>
                        {filter === "All" && (
                            <Link href="/tenant/browse">
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
                                    Browse Properties
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Bookings list */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="space-y-4">
                        {filtered.map((booking, i) => {
                            const status = (booking.status as BookingStatus) || "PENDING";
                            const s = statusConfig[status] ?? statusConfig.PENDING;
                            const StatusIcon = s.icon;
                            const nights = Math.round(
                                (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) /
                                (1000 * 60 * 60 * 24)
                            );
                            const unitName = booking.unit?.unit_name ?? `Unit ${booking.unit_id.slice(0, 8)}`;

                            return (
                                <motion.div
                                    key={booking.booking_id}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Link href={`/tenant/bookings/${booking.booking_id}`}>
                                        <div className="glass-card rounded-2xl overflow-hidden flex gap-0 hover:shadow-lg transition-shadow cursor-pointer group">
                                            <div className="flex-1 p-4 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                                                            {unitName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            Booking #{booking.booking_id.slice(0, 8).toUpperCase()}
                                                        </p>
                                                    </div>
                                                    <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${s.className}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {s.label}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-accent" />
                                                        <span>{formatDate(booking.check_in)} → {formatDate(booking.check_out)}</span>
                                                    </div>
                                                    <span className="text-foreground/40">·</span>
                                                    <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-base font-bold text-foreground font-display">
                                                        ${Number(booking.total_price).toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        View details <ArrowRight className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
