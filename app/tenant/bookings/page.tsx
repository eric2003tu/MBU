"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, CheckCircle2, Clock, XCircle, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../components/TenantHeader";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

const mockBookings = [
    {
        id: "bk-001",
        unit: "Unit 3A – Green Apartments",
        property: "Green Apartments",
        city: "New York",
        checkIn: "2026-03-05",
        checkOut: "2026-03-12",
        totalPrice: 840,
        status: "CONFIRMED" as BookingStatus,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
    },
    {
        id: "bk-002",
        unit: "Studio Loft – Heights Tower",
        property: "Heights Tower",
        city: "Chicago",
        checkIn: "2026-04-01",
        checkOut: "2026-04-03",
        totalPrice: 320,
        status: "PENDING" as BookingStatus,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    },
    {
        id: "bk-003",
        unit: "Room 12 – Garden View",
        property: "Garden View Residences",
        city: "Austin",
        checkIn: "2026-01-10",
        checkOut: "2026-01-15",
        totalPrice: 500,
        status: "CANCELLED" as BookingStatus,
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80",
    },
];

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
        transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" },
    }),
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BookingsPage() {
    return (
        <div>
            <TenantHeader title="My Bookings" subtitle="Manage your short-term rental bookings" />

            <div className="p-6 max-w-5xl mx-auto space-y-6">
                {/* Summary pills */}
                <div className="flex flex-wrap gap-3">
                    {(["All", "CONFIRMED", "PENDING", "CANCELLED"] as const).map((s) => {
                        const count = s === "All" ? mockBookings.length : mockBookings.filter((b) => b.status === s).length;
                        return (
                            <div
                                key={s}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${s === "All"
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : s === "CONFIRMED"
                                            ? "border-green-200 text-green-700 bg-green-50"
                                            : s === "PENDING"
                                                ? "border-amber-200 text-amber-700 bg-amber-50"
                                                : "border-red-200 text-red-700 bg-red-50"
                                    }`}
                            >
                                <span>{s === "All" ? "All" : statusConfig[s].label}</span>
                                <span className="h-5 w-5 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                    <Link href="/tenant/browse" className="ml-auto">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                            <Plus className="h-3.5 w-3.5" />
                            New Booking
                        </Button>
                    </Link>
                </div>

                {/* Bookings list */}
                <div className="space-y-4">
                    {mockBookings.map((booking, i) => {
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
                            >
                                <Link href={`/tenant/bookings/${booking.id}`}>
                                    <div className="glass-card rounded-2xl overflow-hidden flex gap-0 hover:shadow-lg transition-shadow cursor-pointer group">
                                        <div className="w-28 sm:w-36 shrink-0 relative overflow-hidden">
                                            <img
                                                src={booking.image}
                                                alt={booking.unit}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 p-4 min-w-0">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                                                        {booking.unit}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{booking.city}</p>
                                                </div>
                                                <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${s.className}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {s.label}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-accent" />
                                                    <span>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
                                                </div>
                                                <span className="text-foreground/40">·</span>
                                                <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-base font-bold text-foreground font-display">
                                                    ${booking.totalPrice.toLocaleString()}
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
            </div>
        </div>
    );
}
