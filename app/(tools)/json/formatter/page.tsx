import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { JsonWorkbench } from "@/components/tool-workbenches";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online",
  description: "Format, minify, and validate JSON online. Get readable output and clear syntax errors with GaGet.dev.",
  alternates: { canonical: "/json/formatter" },
  openGraph: { title: "JSON Formatter & Validator", description: "Format, minify, and validate JSON in your browser.", url: "/json/formatter", type: "website" }
};

export default function JsonFormatterPage() {
  return <ToolLayout category="JSON" title="JSON Formatter & Validator" description="Format, minify, and validate JSON. Paste a document to make it readable or check its syntax." workspace><JsonWorkbench /></ToolLayout>;
}
