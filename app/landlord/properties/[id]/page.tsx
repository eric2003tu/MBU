"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Layers, Home, Users, Calendar, DollarSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandlordHeader from "../../components/LandlordHeader";

const property = {
    id: "prop-001",
    title: "Sunset Apartments",
    property_type: "APARTMENT",
    address: "KG 123 St, Kigali",
    city: "Kigali",
    description: "A modern apartment building located in the heart of Kigali, offering comfortable living spaces with excellent amenities and nearby services.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
};

const units = [
    { id: "u-001", name: "Unit 1A – Ground Floor", max_guests: 2, is_active: true, pricing: [{ type: "DAILY", price: 80, min_stay: 1 }, { type: "MONTHLY", price: 1200, min_stay: 1 }], occupancy: "Occupied" },
    { id: "u-002", name: "Unit 1B – Ground Floor", max_guests: 3, is_active: true, pricing: [{ type: "DAILY", price: 100, min_stay: 1 }, { type: "MONTHLY", price: 1500, min_stay: 1 }], occupancy: "Vacant" },
    { id: "u-003", name: "Unit 2A – First Floor", max_guests: 4, is_active: true, pricing: [{ type: "DAILY", price: 120, min_stay: 2 }, { type: "MONTHLY", price: 1800, min_stay: 3 }], occupancy: "Occupied" },
    { id: "u-004", name: "Unit 2B – First Floor", max_guests: 2, is_active: true, pricing: [{ type: "DAILY", price: 80, min_stay: 1 }, { type: "MONTHLY", price: 1200, min_stay: 1 }], occupancy: "Occupied" },
    { id: "u-005", name: "Unit 3A – Second Floor", max_guests: 4, is_active: true, pricing: [{ type: "MONTHLY", price: 2000, min_stay: 6 }], occupancy: "Occupied" },
    { id: "u-006", name: "Unit 3B – Second Floor", max_guests: 2, is_active: false, pricing: [{ type: "MONTHLY", price: 1200, min_stay: 1 }], occupancy: "Inactive" },
];

const rentalTypeColors: Record<string, string> = {
    DAILY: "text-blue-600 bg-blue-50",
    MONTHLY: "text-purple-600 bg-purple-50",
    YEARLY: "text-green-600 bg-green-50",
};

const occupancyColors: Record<string, string> = {
    Occupied: "text-green-600 bg-green-50 border-green-200",
    Vacant: "text-amber-600 bg-amber-50 border-amber-200",
    Inactive: "text-gray-500 bg-gray-50 border-gray-200",
};

export default function PropertyDetailPage() {
    const activeCount = units.filter((u) => u.is_active).length;
    const occupiedCount = units.filter((u) => u.occupancy === "Occupied").length;

    return (
        <div>
            <LandlordHeader title={property.title} subtitle={`${property.property_type} · ${property.city}`} />

            <div className="p-6 mx-auto space-y-6">
                {/* Back link */}
                <Link href="/landlord/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Properties
                </Link>

                {/* Property header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card rounded-2xl overflow-hidden"
                >
                    <div className="relative h-56 overflow-hidden">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-5">
                            <h2 className="font-display text-2xl font-bold text-white">{property.title}</h2>
                            <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {property.address}
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                        <div className="flex flex-wrap gap-6 mt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Layers className="h-4 w-4 text-accent" />
                                <span className="text-foreground font-medium">{units.length}</span>
                                <span className="text-muted-foreground">Total Units</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Home className="h-4 w-4 text-green-500" />
                                <span className="text-foreground font-medium">{activeCount}</span>
                                <span className="text-muted-foreground">Active</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span className="text-foreground font-medium">{occupiedCount}</span>
                                <span className="text-muted-foreground">Occupied</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Units list */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg font-semibold text-foreground">Rental Units</h3>
                        <Button size="sm" variant="outline" className="gap-1.5">
                            <Settings className="h-3.5 w-3.5" />
                            Manage Units
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {units.map((unit, i) => (
                            <motion.div
                                key={unit.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" as const }}
                                className={`glass-card rounded-2xl p-5 ${!unit.is_active ? "opacity-60" : ""}`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-sm font-semibold text-foreground">{unit.name}</h4>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${occupancyColors[unit.occupancy]}`}>
                                                {unit.occupancy}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" /> Max {unit.max_guests} guests
                                            </span>
                                        </div>
                                    </div>

                                    {/* Pricing plans */}
                                    <div className="flex flex-wrap gap-2">
                                        {unit.pricing.map((p) => (
                                            <div key={p.type} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${rentalTypeColors[p.type]}`}>
                                                <DollarSign className="h-3 w-3" />
                                                <span>${p.price}/{p.type === "DAILY" ? "night" : p.type === "MONTHLY" ? "mo" : "yr"}</span>
                                                {p.min_stay > 1 && (
                                                    <span className="text-[10px] opacity-70">min {p.min_stay}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
