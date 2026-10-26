import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { CsvJsonWorkbench } from "@/components/csv-json-workbench";

export const metadata: Metadata = {
  title: "CSV to JSON Converter",
  description: "Convert CSV tables to JSON arrays and JSON arrays of scalar objects to CSV locally in your browser.",
  alternates: { canonical: "/data/csv-json" }
};

export default function CsvJsonPage() {
  return <ToolLayout category="Data Formats" title="CSV ↔ JSON" description="Convert tabular CSV data and arrays of JSON objects. Headers must be unique, values remain strings in CSV-to-JSON conversion, and nested values are rejected."><CsvJsonWorkbench /></ToolLayout>;
}
