import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { JsonWorkbench } from "@/components/tool-workbenches";
export const metadata: Metadata = {
  title: "JSON Compare Online",
  description: "Compare two JSON documents by structural path in one browser-based workspace.",
  alternates: { canonical: "/json/formatter" },
  robots: { index: false, follow: true },
};
export default function JsonDiffPage() {
  return <ToolLayout category="JSON" title="JSON Formatter & Validator" description="Compare two JSON documents by structural path, or switch to formatting, minifying, and validation in the same workspace." workspace><JsonWorkbench initialMode="compare" /></ToolLayout>;
}
