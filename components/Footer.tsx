import Link from "next/link";
import { Home, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Home className="h-5 w-5 text-accent" />
                            <span className="font-display text-xl font-semibold">MBU Properties</span>
                        </div>
                        <p className="text-sm text-primary-foreground/70 leading-relaxed">
                            Professional property management, sales brokerage, valuation, and compliance services in Rwanda.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-display text-lg mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            {["Home", "Properties", "About", "Contact"].map((link) => (
                                <Link
                                    key={link}
                                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                                    className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-display text-lg mb-4">Property Types</h4>
                        <div className="space-y-2">
                            {["Residential", "Commercial", "Rentals", "Luxury"].map((type) => (
                                <Link
                                    key={type}
                                    href="/properties"
                                    className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                                >
                                    {type}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-display text-lg mb-4">Contact</h4>
                        <div className="space-y-3 text-sm text-primary-foreground/70">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-accent shrink-0" />
                                <span>Kigali, Rwanda</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-accent shrink-0" />
                                <span>+250 788 000 000</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-accent shrink-0" />
                                <span>info@mbuproperties.rw</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
                    <p>© 2026 MB&U Company Ltd. All rights reserved.</p>
                    <p className="mt-2">Developed by <Link href="https://github.com/RUYANGA" className="hover:text-accent transition-colors">Merci RUYANGA</Link></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
