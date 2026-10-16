import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import { I18nProvider } from "@/components/i18n-provider";
import { isLocale, localeDirections, type Locale } from "@/lib/i18n/messages";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaget.dev";
const brandTitle = "GaGet.dev — Useful Tools, Made Simple";
const brandDescription = "Simple, free online tools for images, text, dates, files, and everyday tasks.";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const raw = h.get("x-gaget-locale") || "en";
  const locale: Locale = isLocale(raw) ? raw : "en";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: brandTitle, template: "%s | GaGet.dev" },
    description: brandDescription,
    applicationName: "GaGet.dev",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: ["/icon.svg"],
    },
    openGraph: {
      type: "website",
      siteName: "GaGet.dev",
      title: brandTitle,
      description: brandDescription,
      url: siteUrl,
    },
    twitter: {
      card: "summary",
      title: brandTitle,
      description: brandDescription,
    },
    robots: { index: locale === "en", follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const h = await headers();
  const raw = h.get("x-gaget-locale") || "en";
  const locale: Locale = isLocale(raw) ? raw : "en";

  return (
    <html lang={locale} dir={localeDirections[locale]} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <I18nProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
