import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { UrlWorkbench } from "@/components/tool-workbenches";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder Online",
  description: "Encode or decode URL components and percent-encoded text instantly in your browser.",
  alternates: { canonical: "/encoding/url" }
};

export default function UrlPage() {
  return <ToolLayout category="Encoding" title="URL Encoder & Decoder" description="Encode text for safe use inside URL components, or decode percent-encoded strings back into readable text."><UrlWorkbench /></ToolLayout>;
}
