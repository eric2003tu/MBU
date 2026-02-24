import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-display text-6xl font-bold text-foreground mb-4">404</h1>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button>Go Home</Button>
                </Link>
                <Link href="/properties">
                    <Button variant="outline">Browse Properties</Button>
                </Link>
            </div>
        </div>
    );
}
