import { handleMcpPost } from "@/lib/mcp/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleMcpPost(request, process.env.MCP_AUTH_TOKEN);
}

export async function GET(): Promise<Response> {
  return Response.json({ error: "Use the MCP Streamable HTTP POST endpoint." }, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE(): Promise<Response> {
  return Response.json({ error: "Session termination is not supported by this stateless endpoint." }, { status: 405, headers: { Allow: "POST" } });
}
