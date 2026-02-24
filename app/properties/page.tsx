"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { properties, type PropertyType, type PropertyCategory } from "@/lib/data/properties";

export default function PropertiesPage() {
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState<PropertyType | "">(
        (searchParams.get("type") as PropertyType) || ""
    );
    const [categoryFilter, setCategoryFilter] = useState<PropertyCategory | "">("");
    const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");
    const [sortBy, setSortBy] = useState("newest");
    const [minBeds, setMinBeds] = useState(0);

    const cities = useMemo(() => [...new Set(properties.map((p) => p.city))], []);

    const filtered = useMemo(() => {
        let result = [...properties];
        if (typeFilter) result = result.filter((p) => p.type === typeFilter);
        if (categoryFilter) result = result.filter((p) => p.category === categoryFilter);
        if (cityFilter) result = result.filter((p) => p.city.toLowerCase().includes(cityFilter.toLowerCase()));
        if (minBeds > 0) result = result.filter((p) => p.bedrooms >= minBeds);

        const maxPrice = searchParams.get("maxPrice");
        if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

        switch (sortBy) {
            case "price-asc": result.sort((a, b) => a.price - b.price); break;
            case "price-desc": result.sort((a, b) => b.price - a.price); break;
            default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return result;
    }, [typeFilter, categoryFilter, cityFilter, sortBy, minBeds, searchParams]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Properties</h1>
                        <p className="text-muted-foreground mt-2">{filtered.length} properties found</p>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex gap-2 flex-wrap">
                            <Button variant={typeFilter === "" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("")}>All</Button>
                            <Button variant={typeFilter === "buy" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("buy")}>Buy</Button>
                            <Button variant={typeFilter === "rent" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("rent")}>Rent</Button>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm bg-muted border border-border rounded-md px-3 py-2 outline-none"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Filters panel */}
                    {showFilters && (
                        <div className="glass-card rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
                                <select
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                    className="w-full text-sm bg-muted border border-border rounded-md px-3 py-2 outline-none"
                                >
                                    <option value="">All Cities</option>
                                    {cities.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value as PropertyCategory | "")}
                                    className="w-full text-sm bg-muted border border-border rounded-md px-3 py-2 outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Min Bedrooms</label>
                                <select
                                    value={minBeds}
                                    onChange={(e) => setMinBeds(Number(e.target.value))}
                                    className="w-full text-sm bg-muted border border-border rounded-md px-3 py-2 outline-none"
                                >
                                    <option value={0}>Any</option>
                                    <option value={1}>1+</option>
                                    <option value={2}>2+</option>
                                    <option value={3}>3+</option>
                                    <option value={4}>4+</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setTypeFilter(""); setCategoryFilter(""); setCityFilter(""); setMinBeds(0); }}
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((property, i) => (
                                <PropertyCard key={property.id} property={property} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">No properties match your criteria.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => { setTypeFilter(""); setCategoryFilter(""); setCityFilter(""); setMinBeds(0); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}