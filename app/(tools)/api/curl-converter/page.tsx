import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "cURL Converter Online", description: "Inspect supported cURL command options and generate request snippets without sending requests.", alternates: { canonical: "/api/curl-converter" } };
export default function CurlPage() { return <ToolLayout category="Web & API" title="cURL Converter" description="Inspect a cURL command and generate a redacted request preview. Commands are parsed only and never executed."><DeveloperToolWorkbench operation="curl" /></ToolLayout>; }
