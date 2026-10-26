import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ExtendedWorkbench } from "@/components/extended-workbench";
export const metadata: Metadata = { title: "Network & File Inspector", description: "Inspect IP addresses, CIDR ranges, MAC addresses, supplied headers, cookies, and local file bytes without network requests.", alternates: { canonical: "/inspection/network-file" } };
export default function NetworkFilePage(){return <ToolLayout category="Security" title="Network & File Inspector" description="Parse supplied network text and inspect local bytes. Results are informational and do not establish trust or file safety."><ExtendedWorkbench group="inspection"/></ToolLayout>;}
