"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft, MapPin, Users, Layers, Home, Calendar,
    CheckCircle2, Clock, CreditCard, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "../../components/AdminHeader";

type PropertyType = "HOUSE" | "APARTMENT" | "ROOM" | "VILLA" | "STUDIO" | "COMMERCIAL" | "LAND" | "DUPLEX";

const typeColors: Record<PropertyType, string> = {
    HOUSE: "text-blue-600 bg-blue-50 border-blue-200",
    APARTMENT: "text-indigo-600 bg-indigo-50 border-indigo-200",
    ROOM: "text-cyan-600 bg-cyan-50 border-cyan-200",
    VILLA: "text-emerald-600 bg-emerald-50 border-emerald-200",
    STUDIO: "text-purple-600 bg-purple-50 border-purple-200",
    COMMERCIAL: "text-orange-600 bg-orange-50 border-orange-200",
    LAND: "text-stone-600 bg-stone-50 border-stone-200",
    DUPLEX: "text-pink-600 bg-pink-50 border-pink-200",
};

const mockProperties: Record<string, {
    id: string; title: string; type: PropertyType; address: string; city: string;
    description: string; landlord: { id: string; name: string };
    image: string; createdAt: string;
    units: { id: string; name: string; maxGuests: number; isActive: boolean; monthlyPrice: number }[];
    bookings: { id: string; tenant: string; dates: string; status: string; price: number }[];
}> = {
    "p-001": {
        id: "p-001", title: "Green Apartments", type: "APARTMENT",
        address: "KG 123 St", city: "Kigali",
        description: "Modern apartment complex in the heart of Kigali with beautiful garden views, 24/7 security, and high-speed internet. Each unit is fully furnished with modern appliances.",
        landlord: { id: "l-004", name: "Alice Uwimana" },
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        createdAt: "2025-06-20",
        units: [
            { id: "u-001", name: "Unit 1A", maxGuests: 2, isActive: true, monthlyPrice: 800 },
            { id: "u-002", name: "Unit 2B", maxGuests: 3, isActive: true, monthlyPrice: 950 },
            { id: "u-003", name: "Unit 3A", maxGuests: 2, isActive: true, monthlyPrice: 840 },
            { id: "u-004", name: "Unit 4C", maxGuests: 4, isActive: true, monthlyPrice: 1200 },
            { id: "u-005", name: "Unit 5B", maxGuests: 3, isActive: true, monthlyPrice: 1800 },
            { id: "u-006", name: "Unit 6A", maxGuests: 2, isActive: false, monthlyPrice: 750 },
        ],
        bookings: [
            { id: "bk-301", tenant: "Alice Uwimana", dates: "Mar 5 – Mar 12, 2026", status: "CONFIRMED", price: 840 },
            { id: "bk-305", tenant: "Sarah Ingabire", dates: "Jan 20 – Jan 25, 2026", status: "CANCELLED", price: 600 },
        ],
    },
    "p-002": {
        id: "p-002", title: "Sunset Villas", type: "VILLA",
        address: "KN 45 Ave", city: "Kigali",
        description: "Luxurious villa complex overlooking the sunset. Features private pools, expansive gardens, and premium finishes throughout.",
        landlord: { id: "l-001", name: "Jean Habimana" },
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        createdAt: "2025-08-15",
        units: [
            { id: "u-007", name: "Villa Suite A", maxGuests: 6, isActive: true, monthlyPrice: 3500 },
            { id: "u-008", name: "Villa Suite B", maxGuests: 4, isActive: true, monthlyPrice: 2800 },
            { id: "u-009", name: "Villa Suite C", maxGuests: 8, isActive: true, monthlyPrice: 4200 },
        ],
        bookings: [
            { id: "bk-304", tenant: "David Iradukunda", dates: "Feb 10 – Feb 14, 2026", status: "CONFIRMED", price: 1200 },
        ],
    },
};

const statusMap: Record<string, { label: string; className: string }> = {
    CONFIRMED: { label: "Confirmed", className: "text-green-600 bg-green-50 border-green-200" },
    PENDING: { label: "Pending", className: "text-amber-600 bg-amber-50 border-amber-200" },
    CANCELLED: { label: "Cancelled", className: "text-red-600 bg-red-50 border-red-200" },
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function PropertyDetailPage() {
    const params = useParams();
    const propertyId = params.id as string;
    const property = mockProperties[propertyId];

    if (!property) {
        return (
            <div>
                <AdminHeader title="Property Not Found" />
                <div className="p-6 text-center">
                    <p className="text-muted-foreground">No property found with ID: {propertyId}</p>
                    <Link href="/admin/properties">
                        <Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="h-4 w-4" /> Back to Properties</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const activeUnits = property.units.filter((u) => u.isActive).length;
    const totalCapacity = property.units.reduce((sum, u) => sum + u.maxGuests, 0);

    return (
        <div>
            <AdminHeader title="Property Details" subtitle={property.title} />

            <div className="p-6 mx-auto space-y-6">
                {/* Back link */}
                <Link href="/admin/properties" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Properties
                </Link>

                {/* Hero image + property info */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                    <div className="h-56 relative overflow-hidden">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full border backdrop-blur-sm ${typeColors[property.type]}`}>
                            {property.type}
                        </span>
                    </div>
                    <div className="p-6">
                        <h2 className="font-display text-xl font-semibold text-foreground">{property.title}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3.5 w-3.5" /> {property.address}, {property.city}
                        </p>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{property.description}</p>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/40 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5" /> Landlord:
                                <Link href={`/admin/landlords/${property.landlord.id}`} className="text-accent hover:underline font-medium">
                                    {property.landlord.name}
                                </Link>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" /> Listed {new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Units", value: property.units.length, icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Active Units", value: activeUnits, icon: Home, color: "text-green-500", bg: "bg-green-500/10" },
                        { label: "Guest Capacity", value: totalCapacity, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
                        { label: "Total Bookings", value: property.bookings.length, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
                    ].map((stat) => (
                        <motion.div key={stat.label} variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl p-5 flex items-start gap-4">
                            <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold font-display text-foreground">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Rental Units */}
                <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/50">
                        <h3 className="font-display font-semibold text-foreground">Rental Units</h3>
                    </div>
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border/50 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <span>Unit Name</span>
                        <span>Max Guests</span>
                        <span>Monthly Price</span>
                        <span>Status</span>
                    </div>
                    <div className="divide-y divide-border/40">
                        {property.units.map((unit) => (
                            <div key={unit.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors items-center">
                                <p className="text-sm font-medium text-foreground">{unit.name}</p>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" /> {unit.maxGuests}
                                </span>
                                <span className="text-sm font-bold text-foreground font-display">
                                    ${unit.monthlyPrice.toLocaleString()}/mo
                                </span>
                                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border w-fit ${unit.isActive ? "text-green-700 bg-green-50 border-green-200" : "text-gray-500 bg-gray-50 border-gray-200"}`}>
                                    {unit.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Bookings */}
                {property.bookings.length > 0 && (
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-border/50">
                            <h3 className="font-display font-semibold text-foreground">Recent Bookings</h3>
                        </div>
                        <div className="divide-y divide-border/40">
                            {property.bookings.map((booking) => {
                                const bs = statusMap[booking.status];
                                return (
                                    <div key={booking.id} className="px-5 py-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{booking.tenant}</p>
                                            <p className="text-xs text-muted-foreground">{booking.dates}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-sm font-bold text-foreground font-display">${booking.price}</span>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${bs.className}`}>
                                                {bs.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
