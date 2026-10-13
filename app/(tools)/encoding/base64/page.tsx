import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { Base64Workbench } from "@/components/tool-workbenches";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder Online",
  description: "Encode UTF-8 text to Base64 or decode Base64 back into readable text. Process data in your browser.",
  alternates: { canonical: "/encoding/base64" }
};

export default function Base64Page() {
  return <ToolLayout category="Encoding" title="Base64 Encoder & Decoder" description="Convert UTF-8 text to Base64 and decode Base64 text back to its original representation."><Base64Workbench /></ToolLayout>;
}
