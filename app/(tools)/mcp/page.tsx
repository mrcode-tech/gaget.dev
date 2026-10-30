import type { Metadata } from "next";
import { McpLandingPage } from "@/components/mcp-landing-page";
import { listCapabilities } from "@/lib/mcp/runtime";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "MCP & Integrations",
  description: "Explore GaGet.dev's Model Context Protocol integration, supported server operations, client setup, and bounded workflow examples.",
  alternates: { canonical: "/mcp" },
  openGraph: {
    title: "MCP & Integrations | GaGet.dev",
    description: "Connect compatible AI clients to supported GaGet.dev operations or explore a guided workflow example.",
    url: "/mcp",
    type: "website",
  },
};

export default function McpPage() {
  return <McpLandingPage capabilities={listCapabilities().map(({ id, version, description, limits, inputTypes, outputTypes, executionModes, availability, mcpExposure, privacy, deterministic }) => ({ id, version, description, limits, inputTypes, outputTypes, executionModes, availability, mcpExposure, privacy, deterministic }))} />;
}
