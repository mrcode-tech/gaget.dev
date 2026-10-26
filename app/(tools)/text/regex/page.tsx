import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "Regex Tester Online", description: "Test regular expressions against sample text in your browser.", alternates: { canonical: "/text/regex" } };
export default function RegexPage() { return <ToolLayout category="Text" title="Regex Tester" description="Inspect matches, ranges, and capture groups without changing the original sample."><DeveloperToolWorkbench operation="regex" /></ToolLayout>; }
