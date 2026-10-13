import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { JwtWorkbench } from "@/components/tool-workbenches";

export const metadata: Metadata = {
  title: "JWT Decoder & Claims Inspector",
  description: "Decode JSON Web Token headers and claims, inspect expiration, and understand JWT contents locally in your browser.",
  alternates: { canonical: "/security/jwt-decoder" }
};

export default function JwtDecoderPage() {
  return <ToolLayout category="Security" title="JWT Decoder & Claims Inspector" description="Decode a compact JSON Web Token and inspect its header, payload, registered claims, and expiration. Decoding does not verify the signature."><JwtWorkbench /></ToolLayout>;
}
