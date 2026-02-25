"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Search, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { authenticated, user, loading, logout } = useAuth();

    const links = [
        { href: "/", label: "Home" },
        { href: "/properties", label: "Properties" },
        { href: "/properties?type=rent", label: "Rent" },
        { href: "/properties?type=buy", label: "Buy" },
    ];

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        router.push("/");
        router.refresh();
    };

    // Initials from name or email
    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : user?.email?.[0]?.toUpperCase() ?? "U";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <nav className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-accent" />
                    <span className="font-display text-xl font-semibold text-foreground">MBU Properties</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-accent ${pathname === link.href.split("?")[0] ? "text-accent" : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop right actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/properties">
                        <Button variant="ghost" size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </Link>

                    {/* Show skeleton while loading auth state */}
                    {loading ? (
                        <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
                    ) : authenticated ? (
                        /* User menu */
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((o) => !o)}
                                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border hover:border-accent/40 transition-colors"
                            >
                                <div className="h-7 w-7 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">
                                    {initials}
                                </div>
                                <span className="text-sm text-foreground font-medium max-w-[100px] truncate">
                                    {user?.full_name?.split(" ")[0] ?? "Account"}
                                </span>
                                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {userMenuOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-52 z-20 glass-card rounded-xl shadow-lg py-1 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-border/50">
                                            <p className="text-sm font-semibold text-foreground truncate">{user?.full_name ?? "Account"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm" className="gap-2">
                                <User className="h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-background border-b border-border px-4 py-4 space-y-3">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-medium text-muted-foreground hover:text-accent py-2"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="pt-2 border-t border-border">
                        {authenticated ? (
                            <div className="space-y-2">
                                <div className="px-1 py-2">
                                    <p className="text-sm font-semibold text-foreground">{user?.full_name ?? "Account"}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive py-2 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                                    <User className="h-4 w-4" />
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
