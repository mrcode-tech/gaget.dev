import { listCapabilities } from "@/lib/mcp/runtime";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const capabilities = listCapabilities().map(({ id, version, description, limits, inputSchema, outputSchema }) => ({
    id, version, description, limits, inputSchema, outputSchema,
  }));
  return Response.json({
    protocol: "Model Context Protocol",
    transport: "Streamable HTTP",
    endpointPath: "/api/mcp",
    authentication: "Bearer token configured server-side; no credentials are returned by this endpoint.",
    protocolTools: ["list_capabilities", "execute_operation", "execute_workflow"],
    capabilities,
  }, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
