import type { Metadata } from "next";
import { ToolCatalog } from "@/components/tool-catalog";

export const metadata: Metadata = {
  title: "All Browser Tools",
  description: "Browse and search GaGet.dev browser utilities and media workspaces by category.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolCatalog />;
}
