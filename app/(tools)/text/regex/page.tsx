import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { TextRegexWorkbench } from "@/components/text-regex-workbench";
export const metadata: Metadata = { title: "Text & Regex Workbench Online", description: "Test and replace regular expressions, transform text, normalize Unicode, inspect text statistics and compare text locally.", alternates: { canonical: "/text/regex" } };
export default function TextRegexPage() { return <ToolLayout category="Text" title="Text & Regex Workbench" description="Test patterns and apply common text transformations in one browser-local workspace."><TextRegexWorkbench /></ToolLayout>; }
