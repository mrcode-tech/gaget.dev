import type { Metadata } from "next";
import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "Free Online Developer Tools",
  description: "Discover free online developer utilities: JSON formatter, URL encoder, Base64 decoder, JWT inspector, UUID generator, and more.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeContent />;
}
