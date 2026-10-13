import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaget.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "GaGet.dev — Developer Tools in One Place", template: "%s | GaGet.dev" },
  description: "Free online developer utilities to format, validate, decode, compare, and generate data. Fast browser-based tools with privacy in mind.",
  applicationName: "GaGet.dev",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "GaGet.dev",
    title: "GaGet.dev — Developer Tools in One Place",
    description: "Simple, fast developer utilities for everyday work.",
    url: siteUrl
  },
  twitter: { card: "summary_large_image", title: "GaGet.dev — Developer Tools in One Place", description: "Simple, fast developer utilities for everyday work." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f8fafc" }, { media: "(prefers-color-scheme: dark)", color: "#0b1020" }]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning>
    <body className={`${inter.variable} font-sans`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AppSidebar />
        <div className="min-h-screen lg:pl-[248px]"><AppHeader />{children}</div>
      </ThemeProvider>
    </body>
  </html>;
}
