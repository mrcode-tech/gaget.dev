import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "CSV to JSON Converter Online", description: "Convert CSV tables to JSON and JSON object arrays to CSV locally.", alternates: { canonical: "/data/csv-json" } };
export default function CsvJsonPage() { return <ToolLayout category="Data Formats" title="CSV ↔ JSON" description="Convert between CSV tables and arrays of JSON objects with explicit direction and delimiter settings."><DeveloperToolWorkbench operation="csv-json" /></ToolLayout>; }
