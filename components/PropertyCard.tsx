"use client";

import Link from "next/link";
import { MapPin, Home, Heart, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { PropertyFull } from "@/lib/propertyClient";

interface PropertyCardProps {
    property: PropertyFull;
    index?: number;
}

/** Pick the lowest price from all units' pricing plans */
function getLowestPrice(property: PropertyFull): { price: number; rentalType: string } | null {
    let lowest: { price: number; rentalType: string } | null = null;
    for (const unit of property.units ?? []) {
        for (const plan of unit.pricingPlans ?? []) {
            const p = Number(plan.price);
            if (!isNaN(p) && (lowest === null || p < lowest.price)) {
                lowest = { price: p, rentalType: plan.rental_type };
            }
        }
    }
    return lowest;
}

function formatPrice(value: number, rentalType: string): string {
    const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 0 });
    switch (rentalType) {
        case "DAILY":
            return `${formatted} RWF/day`;
        case "MONTHLY":
            return `${formatted} RWF/mo`;
        case "YEARLY":
            return `${formatted} RWF/yr`;
        default:
            return `${formatted} RWF`;
    }
}

function getPropertyImage(property: PropertyFull): string {
    return property.images?.[0]?.url ?? "/images/placeholder-property.jpg";
}

function getTotalGuests(property: PropertyFull): number {
    return (property.units ?? []).reduce((sum, u) => sum + (u.max_guests ?? 0), 0);
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
    const priceInfo = getLowestPrice(property);
    const image = getPropertyImage(property);
    const unitCount = property.units?.length ?? 0;
    const maxGuests = getTotalGuests(property);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/property/${property.property_id}`} className="group block">
                <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                {property.property_type}
                            </span>
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                        >
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                            <MapPin className="h-3.5 w-3.5 text-accent" />
                            <span className="text-xs font-medium">{property.address}, {property.city}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-3 line-clamp-1 group-hover:text-accent transition-colors">
                            {property.title}
                        </h3>
                        <div className="flex items-center gap-4 text-muted-foreground text-xs mb-4">
                            {unitCount > 0 && (
                                <div className="flex items-center gap-1">
                                    <Home className="h-3.5 w-3.5" />
                                    <span>{unitCount} {unitCount === 1 ? "Unit" : "Units"}</span>
                                </div>
                            )}
                            {maxGuests > 0 && (
                                <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{maxGuests} Guests</span>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-border pt-3 flex items-center justify-between gap-2">
                            <span className="font-display text-lg font-bold text-accent">
                                {priceInfo ? formatPrice(priceInfo.price, priceInfo.rentalType) : "Contact for price"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-full transition-colors duration-200">
                                View Details <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default PropertyCard;
