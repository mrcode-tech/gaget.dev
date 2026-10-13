import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { UuidWorkbench } from "@/components/tool-workbenches";

export const metadata: Metadata = {
  title: "UUID v4 Generator Online",
  description: "Generate one or multiple cryptographically random UUID v4 identifiers in your browser.",
  alternates: { canonical: "/generators/uuid" }
};

export default function UuidPage() {
  return <ToolLayout category="Generators" title="UUID v4 Generator" description="Generate unique UUID v4 identifiers using your browser's cryptographic random API. Copy or download generated values."><UuidWorkbench /></ToolLayout>;
}
