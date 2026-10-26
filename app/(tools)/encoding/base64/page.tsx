import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder Online",
  description: "Legacy Base64 route; the encoding workbench now includes Base64 mode.",
  alternates: { canonical: "/encoding/url" }
};

export default function Base64Page() {
  redirect("/encoding/url?mode=base64");
}
