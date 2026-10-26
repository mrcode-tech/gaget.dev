import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "Hash Generator Online", description: "Generate SHA-256, SHA-384, and SHA-512 digests locally in your browser.", alternates: { canonical: "/security/hash" } };
export default function HashPage() { return <ToolLayout category="Security" title="Hash Generator" description="Generate a cryptographic digest from text using browser-native SHA-2 algorithms. Hashing is one-way, not encryption."><DeveloperToolWorkbench operation="hash" /></ToolLayout>; }
