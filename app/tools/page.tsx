import type { Metadata } from "next";
import { ToolCatalog } from "@/components/tool-catalog";

export const metadata: Metadata = {
  title: "Developer Tools | GaGet.dev",
  description: "Browse developer utilities by category, including JSON, encoding, security, and generators.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolCatalog />;
}
