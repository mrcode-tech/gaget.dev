import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { HashWorkbench } from "@/components/hash-workbench";

export const metadata: Metadata = {
  title: "Hash Generator — SHA-256, SHA-384, SHA-512",
  description: "Calculate SHA-256, SHA-384, and SHA-512 digests for UTF-8 text or small files locally in your browser.",
  alternates: { canonical: "/security/hash" }
};

export default function HashGeneratorPage() {
  return <ToolLayout category="Security" title="Hash Generator" description="Calculate SHA-256, SHA-384, or SHA-512 digests for text and files using the browser Web Crypto API."><HashWorkbench /></ToolLayout>;
}
