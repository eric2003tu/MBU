import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
    title: "EstateVue – Find Your Dream Property",
    description:
        "Discover exceptional homes and commercial spaces. Whether you're buying, renting, or investing — we make it effortless.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
