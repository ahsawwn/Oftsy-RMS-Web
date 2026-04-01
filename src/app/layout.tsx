import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
    title: "Oftsy RMS | ABH Holdings",
    description: "Realestate Management System for ABH Holdings (SMC-PRIVATE) LIMITED",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${outfit.className} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    themes={['light', 'dark', 'theme-ocean', 'theme-forest', 'theme-rose']}
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}