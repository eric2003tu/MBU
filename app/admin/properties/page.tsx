"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Home, MapPin, Users, Layers } from "lucide-react";
import AdminHeader from "../components/AdminHeader";

type PropertyType = "HOUSE" | "APARTMENT" | "ROOM" | "VILLA" | "STUDIO" | "COMMERCIAL" | "LAND" | "DUPLEX";

const mockProperties = [
    { id: "p-001", title: "Green Apartments", type: "APARTMENT" as PropertyType, city: "Kigali", address: "KG 123 St", landlord: "Alice Uwimana", units: 6, activeUnits: 5, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" },
    { id: "p-002", title: "Sunset Villas", type: "VILLA" as PropertyType, city: "Kigali", address: "KN 45 Ave", landlord: "Jean Habimana", units: 3, activeUnits: 3, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" },
    { id: "p-003", title: "Heights Tower", type: "STUDIO" as PropertyType, city: "Kigali", address: "KK 78 St", landlord: "Peter Nkurunziza", units: 12, activeUnits: 10, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
    { id: "p-004", title: "Garden View Residences", type: "HOUSE" as PropertyType, city: "Musanze", address: "NM 90 Ave", landlord: "Grace Mukamana", units: 4, activeUnits: 4, image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80" },
    { id: "p-005", title: "Downtown Commercial Hub", type: "COMMERCIAL" as PropertyType, city: "Kigali", address: "KG 56 Ave", landlord: "Eric Mugabo", units: 8, activeUnits: 6, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
    { id: "p-006", title: "Lake Kivu Duplex", type: "DUPLEX" as PropertyType, city: "Rubavu", address: "RB 34 St", landlord: "Alice Uwimana", units: 2, activeUnits: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
];

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

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" as const } }),
};

export default function AdminPropertiesPage() {
    const [filterType, setFilterType] = useState<"ALL" | PropertyType>("ALL");
    const filtered = filterType === "ALL" ? mockProperties : mockProperties.filter((p) => p.type === filterType);

    const totalUnits = mockProperties.reduce((sum, p) => sum + p.units, 0);
    const activeUnits = mockProperties.reduce((sum, p) => sum + p.activeUnits, 0);

    return (
        <div>
            <AdminHeader title="All Properties" subtitle="Overview of all properties in the system" />

            <div className="p-6 mx-auto space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{mockProperties.length}</p>
                            <p className="text-xs text-muted-foreground">Total Properties</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                            <Layers className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{totalUnits}</p>
                            <p className="text-xs text-muted-foreground">Total Units</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                            <Home className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xl font-bold font-display text-foreground">{activeUnits}</p>
                            <p className="text-xs text-muted-foreground">Active Units</p>
                        </div>
                    </motion.div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "HOUSE", "APARTMENT", "VILLA", "STUDIO", "COMMERCIAL", "DUPLEX"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${filterType === t
                                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}
                        >
                            {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Properties grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((property, i) => (
                        <motion.div
                            key={property.id}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                        >
                            <Link href={`/admin/properties/${property.id}`}>
                                <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                                    <div className="h-40 relative overflow-hidden">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className={`absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${typeColors[property.type]}`}>
                                            {property.type}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                                            {property.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" />{property.address}, {property.city}
                                        </p>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {property.landlord}
                                            </span>
                                            <span className="text-xs font-semibold text-foreground">
                                                {property.activeUnits}/{property.units} units
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No properties found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
