"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    SlidersHorizontal, MapPin, Users, Building2,
    Search, X, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { propertyClient, type PropertyFull, type PropertyListParams } from "@/lib/propertyClient";

const PROPERTY_TYPES = ["HOUSE", "APARTMENT", "ROOM", "VILLA", "STUDIO", "COMMERCIAL", "LAND", "DUPLEX"];

const typeColors: Record<string, string> = {
    HOUSE: "text-blue-600 bg-blue-50 border-blue-200",
    APARTMENT: "text-purple-600 bg-purple-50 border-purple-200",
    ROOM: "text-teal-600 bg-teal-50 border-teal-200",
    VILLA: "text-amber-600 bg-amber-50 border-amber-200",
    STUDIO: "text-pink-600 bg-pink-50 border-pink-200",
    COMMERCIAL: "text-indigo-600 bg-indigo-50 border-indigo-200",
    LAND: "text-green-600 bg-green-50 border-green-200",
    DUPLEX: "text-orange-600 bg-orange-50 border-orange-200",
};

const LIMIT = 12;

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" as const },
    }),
};

function PropertyCardSkeleton() {
    return (
        <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
            </div>
        </div>
    );
}

function PropertiesContent() {
    const searchParams = useSearchParams();

    const [properties, setProperties] = useState<PropertyFull[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [searchInput, setSearchInput] = useState(search);
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
    const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");
    const [showFilters, setShowFilters] = useState(false);

    const totalPages = Math.ceil(total / LIMIT);

    const fetchProperties = useCallback(async (params: PropertyListParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await propertyClient.getAll(params);
            setProperties(data.items);
            setTotal(data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load properties.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties({
            page,
            limit: LIMIT,
            search: search || undefined,
            city: cityFilter || undefined,
            property_type: typeFilter || undefined,
        });
    }, [fetchProperties, page, search, cityFilter, typeFilter]);

    // Derive unique cities from loaded items for the filter dropdown
    const cities = useMemo(() => [...new Set(properties.map((p) => p.city).filter(Boolean))], [properties]);

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch(""); setSearchInput(""); setTypeFilter(""); setCityFilter(""); setPage(1);
    };

    const hasFilters = search || typeFilter || cityFilter;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="container mx-auto px-4">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                            Browse Properties
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {loading ? "Loading…" : `${total} propert${total !== 1 ? "ies" : "y"} found`}
                        </p>
                    </div>

                    {/* Search + filter toolbar */}
                    <div className="glass-card rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by title or city…"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full h-10 pl-9 pr-4 rounded-xl bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                            />
                        </div>
                        <Button onClick={handleSearch} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-5">
                            Search
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className="gap-2 h-10"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters {hasFilters && <span className="h-2 w-2 rounded-full bg-accent" />}
                        </Button>
                    </div>

                    {/* Expanded filters */}
                    {showFilters && (
                        <div className="glass-card rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Property Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                                    className="w-full text-sm bg-muted border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-accent/40"
                                >
                                    <option value="">All Types</option>
                                    {PROPERTY_TYPES.map((t) => (
                                        <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
                                <select
                                    value={cityFilter}
                                    onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                                    className="w-full text-sm bg-muted border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-accent/40"
                                >
                                    <option value="">All Cities</option>
                                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
                                    <X className="h-3.5 w-3.5" /> Clear All
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Type pill filters */}
                    <div className="flex gap-2 flex-wrap mb-6">
                        <button
                            onClick={() => { setTypeFilter(""); setPage(1); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${typeFilter === ""
                                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                }`}
                        >
                            All Types
                        </button>
                        {PROPERTY_TYPES.map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTypeFilter(t); setPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${typeFilter === t
                                    ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                    : "bg-secondary border-border/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                    }`}
                            >
                                {t.charAt(0) + t.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 mb-6 flex items-center justify-between">
                            <span>{error}</span>
                            <Button variant="outline" size="sm" onClick={() => fetchProperties({ page, limit: LIMIT })}>Retry</Button>
                        </div>
                    )}

                    {/* Grid — loading skeletons */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-20 space-y-3">
                            <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                            <p className="text-muted-foreground">No properties match your criteria.</p>
                            <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property, i) => {
                                const image = property.images?.[0]?.url;
                                const firstPlan = property.units?.flatMap((u) => u.pricingPlans)?.[0];
                                const typeColor = typeColors[property.property_type] ?? "text-gray-600 bg-gray-50 border-gray-200";
                                const totalGuests = property.units?.reduce((s, u) => s + u.max_guests, 0) ?? 0;

                                return (
                                    <motion.div
                                        key={property.property_id}
                                        custom={i}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        <Link href={`/property/${property.property_id}`}>
                                            <div className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer h-full">
                                                {/* Image */}
                                                <div className="relative h-48 overflow-hidden bg-muted">
                                                    {image ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            src={image}
                                                            alt={property.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Building2 className="h-10 w-10 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                                    <div className="absolute top-3 left-3">
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${typeColor}`}>
                                                            {property.property_type}
                                                        </span>
                                                    </div>
                                                    {property.units?.length > 0 && (
                                                        <div className="absolute bottom-3 right-3">
                                                            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-black/50 text-white">
                                                                {property.units.length} unit{property.units.length !== 1 ? "s" : ""}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Body */}
                                                <div className="p-4 space-y-3">
                                                    <div>
                                                        <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                                                            {property.title}
                                                        </h3>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                                            <span className="text-xs text-muted-foreground truncate">
                                                                {property.address}, {property.city}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            {firstPlan ? (
                                                                <>
                                                                    <span className="text-base font-bold text-foreground font-display">
                                                                        ${Number(firstPlan.price).toLocaleString()}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground ml-1">
                                                                        /{firstPlan.rental_type === "DAILY" ? "night" : firstPlan.rental_type === "MONTHLY" ? "mo" : "yr"}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground italic">Contact for pricing</span>
                                                            )}
                                                        </div>
                                                        {totalGuests > 0 && (
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Users className="h-3 w-3" /> {totalGuests} guests
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Button size="sm" variant="outline" className="w-full text-xs group-hover:border-accent/60 transition-colors">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && !loading && (
                        <div className="flex items-center justify-center gap-3 mt-10">
                            <Button
                                variant="outline" size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
                            </span>
                            <Button
                                variant="outline" size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="gap-1"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
        }>
            <PropertiesContent />
        </Suspense>
    );
}