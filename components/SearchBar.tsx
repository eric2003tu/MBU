"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
    const router = useRouter();
    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (city) params.set("city", city);
        if (type) params.set("type", type);
        if (maxPrice) params.set("maxPrice", maxPrice);
        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="glass-card rounded-xl p-2 flex flex-col md:flex-row gap-2 w-full max-w-3xl">
            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-muted/50">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <input
                    type="text"
                    placeholder="City or Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                />
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 md:w-40">
                <Home className="h-4 w-4 text-accent shrink-0" />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-transparent text-sm text-foreground outline-none w-full appearance-none cursor-pointer"
                >
                    <option value="">All Types</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                </select>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 md:w-44">
                <DollarSign className="h-4 w-4 text-accent shrink-0" />
                <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-transparent text-sm text-foreground outline-none w-full appearance-none cursor-pointer"
                >
                    <option value="">Any Price</option>
                    <option value="500000">Up to $500K</option>
                    <option value="1000000">Up to $1M</option>
                    <option value="3000000">Up to $3M</option>
                    <option value="5000">Up to $5K/mo</option>
                </select>
            </div>
            <Button onClick={handleSearch} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-6">
                <Search className="h-4 w-4" />
                Search
            </Button>
        </div>
    );
};

export default SearchBar;
