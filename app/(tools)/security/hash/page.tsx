import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
export const metadata: Metadata = { title: "Hash & Checksum Generator Online", description: "Generate SHA-2 digests, HMACs and CRC32 checksums for text or local files in your browser.", alternates: { canonical: "/security/hash" } };
export default function HashPage() { return <ToolLayout category="Security" title="Hash & Checksum Generator" description="Generate SHA-2 digests, HMACs and CRC32 checksums from text or local files. Hashing is one-way, not encryption."><DeveloperToolWorkbench operation="hash" /></ToolLayout>; }
