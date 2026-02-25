"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, MapPin, Home, Plus, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandlordHeader from "../components/LandlordHeader";

type PropertyType = "HOUSE" | "APARTMENT" | "ROOM" | "VILLA" | "STUDIO" | "COMMERCIAL" | "LAND" | "DUPLEX";

const mockProperties = [
    {
        id: "prop-001",
        title: "Sunset Apartments",
        property_type: "APARTMENT" as PropertyType,
        address: "KG 123 St, Kigali",
        city: "Kigali",
        units: 6,
        activeUnits: 5,
        occupancy: 83,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
    },
    {
        id: "prop-002",
        title: "Garden View Residences",
        property_type: "HOUSE" as PropertyType,
        address: "KN 45 Ave, Kigali",
        city: "Kigali",
        units: 4,
        activeUnits: 4,
        occupancy: 100,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    },
    {
        id: "prop-003",
        title: "Heights Tower",
        property_type: "STUDIO" as PropertyType,
        address: "KG 78 Rd, Kigali",
        city: "Kigali",
        units: 8,
        activeUnits: 6,
        occupancy: 75,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    },
    {
        id: "prop-004",
        title: "Musanze Commercial Plaza",
        property_type: "COMMERCIAL" as PropertyType,
        address: "NR 12 St, Musanze",
        city: "Musanze",
        units: 3,
        activeUnits: 2,
        occupancy: 67,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
    },
];

const typeColors: Record<PropertyType, string> = {
    HOUSE: "text-blue-600 bg-blue-50 border-blue-200",
    APARTMENT: "text-purple-600 bg-purple-50 border-purple-200",
    ROOM: "text-teal-600 bg-teal-50 border-teal-200",
    VILLA: "text-amber-600 bg-amber-50 border-amber-200",
    STUDIO: "text-pink-600 bg-pink-50 border-pink-200",
    COMMERCIAL: "text-indigo-600 bg-indigo-50 border-indigo-200",
    LAND: "text-green-600 bg-green-50 border-green-200",
    DUPLEX: "text-orange-600 bg-orange-50 border-orange-200",
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
    }),
};

export default function PropertiesPage() {
    return (
        <div>
            <LandlordHeader title="My Properties" subtitle="Manage your property portfolio" />

            <div className="p-6 mx-auto space-y-6">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            All Properties
                            <span className="h-5 w-5 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                                {mockProperties.length}
                            </span>
                        </div>
                    </div>
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                        <Plus className="h-3.5 w-3.5" />
                        Add Property
                    </Button>
                </div>

                {/* Properties grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockProperties.map((property, i) => (
                        <motion.div
                            key={property.id}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                        >
                            <Link href={`/landlord/properties/${property.id}`}>
                                <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${typeColors[property.property_type]}`}>
                                                {property.property_type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                            {property.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                            <MapPin className="h-3.5 w-3.5 text-accent" />
                                            <span>{property.address}, {property.city}</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Layers className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{property.activeUnits}/{property.units} units</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Home className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{property.occupancy}% occupied</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Manage <ArrowRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
