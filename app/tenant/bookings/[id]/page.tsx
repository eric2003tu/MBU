"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Phone,
    Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../../components/TenantHeader";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

const bookingDetails: Record<string, {
    id: string; unit: string; property: string; city: string; address: string;
    checkIn: string; checkOut: string; totalPrice: number; status: BookingStatus;
    image: string; maxGuests: number; rentalType: string; pricePerNight: number;
    landlordName: string; landlordPhone: string; landlordEmail: string;
    payments: { date: string; amount: number; method: string; status: string }[];
}> = {
    "bk-001": {
        id: "bk-001", unit: "Unit 3A – Green Apartments", property: "Green Apartments",
        city: "New York", address: "500 Amsterdam Ave", checkIn: "2026-03-05",
        checkOut: "2026-03-12", totalPrice: 840, status: "CONFIRMED",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        maxGuests: 4, rentalType: "DAILY", pricePerNight: 120,
        landlordName: "Sarah Mitchell", landlordPhone: "+1 (555) 234-5678",
        landlordEmail: "sarah@greenapts.com",
        payments: [{ date: "2026-02-15", amount: 840, method: "Credit Card", status: "PAID" }],
    },
    "bk-002": {
        id: "bk-002", unit: "Studio Loft – Heights Tower", property: "Heights Tower",
        city: "Chicago", address: "222 Wacker Dr", checkIn: "2026-04-01",
        checkOut: "2026-04-03", totalPrice: 320, status: "PENDING",
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        maxGuests: 2, rentalType: "DAILY", pricePerNight: 160,
        landlordName: "James Taylor", landlordPhone: "+1 (555) 876-5432",
        landlordEmail: "james@heightstower.com",
        payments: [],
    },
};

const statusConfig: Record<BookingStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    PENDING: { label: "Pending Review", className: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
    CANCELLED: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const booking = bookingDetails[id];

    if (!booking) {
        return (
            <div>
                <TenantHeader title="Booking Not Found" />
                <div className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">This booking could not be found.</p>
                    <Link href="/tenant/bookings">
                        <Button variant="outline">← Back to Bookings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const s = statusConfig[booking.status];
    const StatusIcon = s.icon;
    const nights = Math.round(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div>
            <TenantHeader title="Booking Details" subtitle={`Booking #${booking.id.toUpperCase()}`} />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <Link href="/tenant/bookings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors w-fit">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bookings
                </Link>

                {/* Hero image + status */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    <div className="relative h-52 sm:h-64 overflow-hidden">
                        <img
                            src={booking.image}
                            alt={booking.unit}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                            <div>
                                <h2 className="font-display text-xl font-bold text-white">{booking.unit}</h2>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <MapPin className="h-3.5 w-3.5 text-white/70" />
                                    <span className="text-sm text-white/80">{booking.address}, {booking.city}</span>
                                </div>
                            </div>
                            <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${s.className}`}>
                                <StatusIcon className="h-4 w-4" />
                                {s.label}
                            </span>
                        </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">
                        {[
                            { label: "Check-in", value: formatDate(booking.checkIn), icon: Calendar },
                            { label: "Check-out", value: formatDate(booking.checkOut), icon: Calendar },
                            { label: "Duration", value: `${nights} nights`, icon: Clock },
                            { label: "Guests", value: `Up to ${booking.maxGuests}`, icon: Users },
                        ].map((item) => (
                            <div key={item.label} className="px-5 py-4">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <item.icon className="h-3.5 w-3.5" />
                                    <span className="text-xs">{item.label}</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Two-col: Pricing + Landlord */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Pricing */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-5 space-y-3"
                    >
                        <h3 className="font-display font-semibold text-foreground">Pricing Breakdown</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>${booking.pricePerNight} × {nights} nights</span>
                                <span>${(booking.pricePerNight * nights).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Service fee</span>
                                <span>${(booking.totalPrice - booking.pricePerNight * nights).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-foreground">
                                <span>Total</span>
                                <span>${booking.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payments */}
                        {booking.payments.length > 0 ? (
                            <div className="mt-2 space-y-2">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment History</h4>
                                {booking.payments.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                                        <CreditCard className="h-4 w-4 text-green-600 shrink-0" />
                                        <div className="flex-1 min-w-0 text-xs">
                                            <p className="font-medium text-green-700">${p.amount} – {p.method}</p>
                                            <p className="text-green-600/70">{new Date(p.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                            {p.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            booking.status === "PENDING" && (
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Pay Now
                                </Button>
                            )
                        )}
                    </motion.div>

                    {/* Landlord Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="glass-card rounded-2xl p-5 space-y-4"
                    >
                        <h3 className="font-display font-semibold text-foreground">Landlord Contact</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm">
                                {booking.landlordName.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground text-sm">{booking.landlordName}</p>
                                <p className="text-xs text-muted-foreground">Property Owner</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <a href={`tel:${booking.landlordPhone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
                                <Phone className="h-4 w-4 text-accent" />
                                {booking.landlordPhone}
                            </a>
                            <a href={`mailto:${booking.landlordEmail}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors">
                                <Mail className="h-4 w-4 text-accent" />
                                {booking.landlordEmail}
                            </a>
                        </div>
                        {booking.status === "CONFIRMED" && (
                            <Button variant="outline" className="w-full text-sm mt-2">
                                Message Landlord
                            </Button>
                        )}
                        {booking.status === "PENDING" && (
                            <Button variant="outline" className="w-full text-sm text-red-600 border-red-200 hover:bg-red-50 mt-2">
                                Cancel Booking
                            </Button>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
