import { handleMcpPost } from "@/lib/mcp/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const token = process.env.MCP_AUTH_TOKEN;
  if (!token || new TextEncoder().encode(token).byteLength < 32) {
    return Response.json({ error: "MCP_AUTH_TOKEN must be configured with at least 32 bytes of secret material." }, { status: 503 });
  }
  return handleMcpPost(request, token);
}

export async function GET(): Promise<Response> {
  return Response.json({ error: "Use the MCP Streamable HTTP POST endpoint." }, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE(): Promise<Response> {
  return Response.json({ error: "Session termination is not supported by this stateless endpoint." }, { status: 405, headers: { Allow: "POST" } });
}
