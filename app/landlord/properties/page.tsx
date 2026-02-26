"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Home, Plus, ArrowRight, Layers, Loader2, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandlordHeader from "../components/LandlordHeader";
import { propertyClient, PropertyFull, PropertyType } from "@/lib/propertyClient";

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
    const router = useRouter();
    const [properties, setProperties] = useState<PropertyFull[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProperties() {
            try {
                setLoading(true);
                setError(null);
                const data = await propertyClient.getAll();
                setProperties(data.items);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load properties";
                setError(message);
            } finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, []);

    const getUnitStats = (property: PropertyFull) => {
        const units = property.units ?? [];
        const totalUnits = units.length;
        const activeUnits = units.filter((u) => u.is_active).length;
        const unitsWithBookings = units.filter((u) => u.bookings && u.bookings.length > 0).length;
        const occupancy = totalUnits > 0 ? Math.round((unitsWithBookings / totalUnits) * 100) : 0;
        return { totalUnits, activeUnits, occupancy };
    };

    const getPropertyImage = (property: PropertyFull): string | null => {
        if (property.images && property.images.length > 0) {
            return property.images[0].url;
        }
        return null;
    };

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
                                {loading ? "…" : properties.length}
                            </span>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                        onClick={() => router.push("/landlord/properties/new")}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Property
                    </Button>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        <p className="text-sm text-muted-foreground">Loading properties…</p>
                    </div>
                )}

                {/* Error state */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="h-7 w-7 text-red-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-foreground">Failed to load properties</p>
                            <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && properties.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                            <Building2 className="h-7 w-7 text-accent" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-foreground">No properties yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Create your first property listing to get started.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                            onClick={() => router.push("/landlord/properties/new")}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Property
                        </Button>
                    </div>
                )}

                {/* Properties grid */}
                {!loading && !error && properties.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {properties.map((property, i) => {
                            const { totalUnits, activeUnits, occupancy } = getUnitStats(property);
                            const image = getPropertyImage(property);

                            return (
                                <motion.div
                                    key={property.property_id}
                                    custom={i}
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Link href={`/landlord/properties/${property.property_id}`}>
                                        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                                            <div className="relative h-48 overflow-hidden bg-muted">
                                                {image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={image}
                                                        alt={property.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Building2 className="h-12 w-12 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${typeColors[property.property_type] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
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
                                                    <span>{property.address}{property.city ? `, ${property.city}` : ""}</span>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Layers className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground">{activeUnits}/{totalUnits} units</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Home className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm text-muted-foreground">{occupancy}% occupied</span>
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
