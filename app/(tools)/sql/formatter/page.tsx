import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "SQL Formatter Online", description: "Format SQL statements without executing queries or connecting to a database.", alternates: { canonical: "/sql/formatter" } };
export default function SqlPage() { return <ToolLayout category="SQL" title="SQL Formatter" description="Format common SQL clauses for readability. Statements are never executed; formatting is heuristic."><DeveloperToolWorkbench operation="sql" /></ToolLayout>; }
