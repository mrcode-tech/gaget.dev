import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "XML Formatter Online", description: "Format or minify XML text locally in your browser.", alternates: { canonical: "/xml/formatter" } };
export default function XmlPage() { return <ToolLayout category="Data Formats" title="XML Formatter" description="Format or minify XML source. This tool does not perform schema validation or resolve external entities."><DeveloperToolWorkbench operation="xml" /></ToolLayout>; }
