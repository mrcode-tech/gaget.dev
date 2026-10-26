import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { EncodingWorkbench } from "@/components/encoding-workbench";
import type { EncodingMode } from "@/lib/tools/encoding-operations";

export const metadata: Metadata = {
  title: "Encoding & Decoding Workbench Online",
  description: "Encode and decode URL components, Base64, Base64url, Base32, hexadecimal, binary bytes, HTML entities and Unicode escapes locally in your browser.",
  alternates: { canonical: "/encoding/url" }
};

export default async function EncodingPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const params = await searchParams;
  const allowed: EncodingMode[] = ["url", "base64", "base64url", "base32", "hex", "binary", "html-entities", "unicode-escapes"];
  const mode = allowed.includes(params.mode as EncodingMode) ? params.mode as EncodingMode : "url";
  return <ToolLayout category="Encoding" title="Encoding & Decoding" description="Convert between common text representations and byte encodings in one browser-local workbench. Encoding is not encryption."><EncodingWorkbench initialMode={mode} /></ToolLayout>;
}
