"use client";

import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Property } from "@/lib/data/properties";

interface PropertyCardProps {
    property: Property;
    index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/property/${property.id}`} className="group block">
                <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                {property.type === "rent" ? "For Rent" : "For Sale"}
                            </span>
                            {property.category === "commercial" && (
                                <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Commercial
                                </span>
                            )}
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
                            <span className="text-xs font-medium">{property.location}, {property.city}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-3 line-clamp-1 group-hover:text-accent transition-colors">
                            {property.title}
                        </h3>
                        <div className="flex items-center gap-4 text-muted-foreground text-xs mb-4">
                            {property.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <Bed className="h-3.5 w-3.5" />
                                    <span>{property.bedrooms} Beds</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Bath className="h-3.5 w-3.5" />
                                <span>{property.bathrooms} Baths</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Maximize className="h-3.5 w-3.5" />
                                <span>{property.area.toLocaleString()} sqft</span>
                            </div>
                        </div>
                        <div className="border-t border-border pt-3 flex items-center justify-between gap-2">
                            <span className="font-display text-xl font-bold text-accent">{property.priceLabel}</span>
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
