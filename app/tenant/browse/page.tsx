"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenantHeader from "../components/TenantHeader";

const propertyTypes = ["All", "HOUSE", "APARTMENT", "ROOM", "STUDIO", "VILLA", "COMMERCIAL"];

const mockProperties = [
    {
        id: "p-1",
        title: "Luxury Penthouse Suite",
        type: "APARTMENT",
        city: "New York",
        address: "500 Park Ave",
        price: 3500,
        rentalType: "MONTHLY",
        maxGuests: 4,
        rating: 4.9,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
        available: true,
    },
    {
        id: "p-2",
        title: "Cozy Downtown Studio",
        type: "STUDIO",
        city: "Chicago",
        address: "222 Wacker Dr",
        price: 95,
        rentalType: "DAILY",
        maxGuests: 2,
        rating: 4.7,
        reviews: 28,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
        available: true,
    },
    {
        id: "p-3",
        title: "Modern Family Villa",
        type: "VILLA",
        city: "Miami",
        address: "88 Ocean Dr",
        price: 5200,
        rentalType: "MONTHLY",
        maxGuests: 8,
        rating: 4.8,
        reviews: 19,
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
        available: true,
    },
    {
        id: "p-4",
        title: "Suburban Family Home",
        type: "HOUSE",
        city: "Austin",
        address: "301 Cedar Ln",
        price: 2100,
        rentalType: "MONTHLY",
        maxGuests: 6,
        rating: 4.5,
        reviews: 33,
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
        available: false,
    },
    {
        id: "p-5",
        title: "Executive Suite Room",
        type: "ROOM",
        city: "Los Angeles",
        address: "1 Sunset Blvd",
        price: 65,
        rentalType: "DAILY",
        maxGuests: 1,
        rating: 4.6,
        reviews: 15,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
        available: true,
    },
    {
        id: "p-6",
        title: "Commercial Office Space",
        type: "COMMERCIAL",
        city: "San Francisco",
        address: "50 Market St",
        price: 8000,
        rentalType: "MONTHLY",
        maxGuests: 20,
        rating: 4.4,
        reviews: 8,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
        available: true,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
    }),
};

export default function BrowsePage() {
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All");

    const cities = ["All", ...Array.from(new Set(mockProperties.map((p) => p.city)))];

    const filtered = mockProperties.filter((p) => {
        const matchesType = selectedType === "All" || p.type === selectedType;
        const matchesCity = selectedCity === "All" || p.city === selectedCity;
        const matchesSearch =
            !search ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.city.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesCity && matchesSearch;
    });

    return (
        <div>
            <TenantHeader title="Browse Properties" subtitle="Find and book your perfect rental" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Search & Filters */}
                <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search properties, cities…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                        />
                    </div>
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="h-10 px-3 rounded-xl bg-secondary border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition"
                    >
                        {cities.map((c) => (
                            <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
                        ))}
                    </select>
                </div>

                {/* Type filter pills */}
                <div className="flex gap-2 flex-wrap">
                    {propertyTypes.map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedType === t
                                    ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                    : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}
                        >
                            {t === "All" ? "All Types" : t.charAt(0) + t.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filtered.length}</span> properties
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((p, i) => (
                        <motion.div
                            key={p.id}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-accent text-accent-foreground uppercase tracking-wide">
                                        {p.type}
                                    </span>
                                </div>
                                {!p.available && (
                                    <div className="absolute top-3 right-3">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500 text-white">
                                            Unavailable
                                        </span>
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-semibold text-white">{p.rating}</span>
                                    <span className="text-xs text-white/70">({p.reviews})</span>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                                        {p.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{p.address}, {p.city}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-bold text-foreground font-display">
                                            ${p.price.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-1">
                                            / {p.rentalType === "DAILY" ? "night" : p.rentalType === "MONTHLY" ? "month" : "year"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        {p.maxGuests} guests
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/property/${p.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                            View Details
                                        </Button>
                                    </Link>
                                    {p.available && (
                                        <Link href={`/tenant/bookings?unit=${p.id}`} className="flex-1">
                                            <Button size="sm" className="w-full text-xs bg-accent text-accent-foreground hover:bg-accent/90">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Book Now
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">No properties found. Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
