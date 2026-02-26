"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Layers, Home, Users, DollarSign, Settings, Loader2, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandlordHeader from "../../components/LandlordHeader";
import { propertyClient, PropertyFull, UnitWithDetails } from "@/lib/propertyClient";

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

function getUnitOccupancy(unit: UnitWithDetails): string {
    if (!unit.is_active) return "Inactive";
    if (unit.bookings && unit.bookings.length > 0) return "Occupied";
    return "Vacant";
}

export default function PropertyDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [property, setProperty] = useState<PropertyFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        async function fetchProperty() {
            try {
                setLoading(true);
                setError(null);
                const data = await propertyClient.getById(id);
                setProperty(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load property";
                setError(message);
            } finally {
                setLoading(false);
            }
        }
        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <div>
                <LandlordHeader title="Property Details" />
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="text-sm text-muted-foreground">Loading property…</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div>
                <LandlordHeader title="Property Details" />
                <div className="p-6">
                    <Link href="/landlord/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Properties
                    </Link>
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="h-7 w-7 text-red-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-foreground">Failed to load property</p>
                            <p className="text-xs text-muted-foreground mt-1">{error ?? "Property not found"}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const units = property.units ?? [];
    const activeCount = units.filter((u) => u.is_active).length;
    const occupiedCount = units.filter((u) => u.bookings && u.bookings.length > 0).length;
    const heroImage = property.images && property.images.length > 0 ? property.images[0].url : null;

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
                    <div className="relative h-56 overflow-hidden bg-muted">
                        {heroImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={heroImage} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="h-16 w-16 text-muted-foreground/30" />
                            </div>
                        )}
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
                        {property.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                        )}
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

                    {units.length === 0 && (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <p className="text-sm text-muted-foreground">No rental units have been added yet.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {units.map((unit, i) => {
                            const occupancy = getUnitOccupancy(unit);
                            return (
                                <motion.div
                                    key={unit.unit_id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" as const }}
                                    className={`glass-card rounded-2xl p-5 ${!unit.is_active ? "opacity-60" : ""}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-sm font-semibold text-foreground">{unit.unit_name}</h4>
                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${occupancyColors[occupancy]}`}>
                                                    {occupancy}
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
                                            {unit.pricingPlans.length > 0 ? (
                                                unit.pricingPlans.map((p) => (
                                                    <div key={p.pricing_id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${rentalTypeColors[p.rental_type] ?? "text-gray-600 bg-gray-50"}`}>
                                                        <DollarSign className="h-3 w-3" />
                                                        <span>${p.price}/{p.rental_type === "DAILY" ? "night" : p.rental_type === "MONTHLY" ? "mo" : "yr"}</span>
                                                        {p.minimum_stay > 1 && (
                                                            <span className="text-[10px] opacity-70">min {p.minimum_stay}</span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">No pricing set</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
