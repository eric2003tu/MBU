"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandlordHeader from "../components/LandlordHeader";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

const mockBookings = [
    {
        id: "bk-101",
        unit: "Unit 2B – Sunset Apartments",
        property: "Sunset Apartments",
        tenant: "Alice Uwimana",
        checkIn: "2026-03-10",
        checkOut: "2026-03-14",
        totalPrice: 480,
        guests: 2,
        status: "PENDING" as BookingStatus,
    },
    {
        id: "bk-102",
        unit: "Room 5 – Garden View",
        property: "Garden View Residences",
        tenant: "Jean Habimana",
        checkIn: "2026-03-18",
        checkOut: "2026-03-20",
        totalPrice: 240,
        guests: 1,
        status: "CONFIRMED" as BookingStatus,
    },
    {
        id: "bk-103",
        unit: "Studio A – Heights Tower",
        property: "Heights Tower",
        tenant: "Marie Claire",
        checkIn: "2026-04-01",
        checkOut: "2026-04-05",
        totalPrice: 600,
        guests: 3,
        status: "PENDING" as BookingStatus,
    },
    {
        id: "bk-104",
        unit: "Unit 1A – Sunset Apartments",
        property: "Sunset Apartments",
        tenant: "David Rwema",
        checkIn: "2026-02-20",
        checkOut: "2026-02-22",
        totalPrice: 160,
        guests: 1,
        status: "CANCELLED" as BookingStatus,
    },
    {
        id: "bk-105",
        unit: "Unit 3A – Sunset Apartments",
        property: "Sunset Apartments",
        tenant: "Claudine Ingabire",
        checkIn: "2026-03-25",
        checkOut: "2026-03-30",
        totalPrice: 600,
        guests: 4,
        status: "CONFIRMED" as BookingStatus,
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
        transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const },
    }),
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function LandlordBookingsPage() {
    const pendingCount = mockBookings.filter((b) => b.status === "PENDING").length;
    const confirmedCount = mockBookings.filter((b) => b.status === "CONFIRMED").length;

    return (
        <div>
            <LandlordHeader title="Bookings" subtitle="Manage incoming short-term rental bookings" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary pills */}
                <div className="flex flex-wrap gap-3">
                    {(["All", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((s) => {
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
                                <div className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3">
                                                <p className="text-sm font-semibold text-foreground truncate">{booking.unit}</p>
                                                <span className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${s.className}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {s.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-3.5 w-3.5 text-accent" />
                                                    <span>{booking.tenant} · {booking.guests} guest{booking.guests !== 1 ? "s" : ""}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-accent" />
                                                    <span>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)} · {nights} night{nights !== 1 ? "s" : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-lg font-bold text-foreground font-display">
                                                ${booking.totalPrice.toLocaleString()}
                                            </span>
                                            {booking.status === "PENDING" && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8">
                                                        Confirm
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-xs h-8 text-red-500 border-red-200 hover:bg-red-50">
                                                        Decline
                                                    </Button>
                                                </div>
                                            )}
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
