import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "HTML Formatter Online", description: "Format or minify HTML markup as text in your browser.", alternates: { canonical: "/web/html-formatter" } };
export default function HtmlPage() { return <ToolLayout category="Web & API" title="HTML Formatter" description="Format or minify markup as text. The result is never rendered as active HTML."><DeveloperToolWorkbench operation="html" /></ToolLayout>; }
