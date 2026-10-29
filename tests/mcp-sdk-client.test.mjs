import test from "node:test";
import assert from "node:assert/strict";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { handleMcpPost } from "../lib/mcp/runtime.ts";

const token = "test-only-sdk-client-token";

test("maintained MCP SDK client initializes, discovers tools and invokes a real operation", async () => {
  const client = new Client({ name: "gaget-mcp-contract-test", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL("http://mcp.test/api/mcp"), {
    fetch: (url, init) => {
      const headers = new Headers(init?.headers);
      headers.set("authorization", `Bearer ${token}`);
      return handleMcpPost(new Request(url, { ...init, headers }), token);
    }
  });

  try {
    await client.connect(transport);
    const listed = await client.listTools();
    assert.deepEqual(listed.tools.map(tool => tool.name), ["list_capabilities", "execute_operation", "execute_workflow"]);

    const result = await client.callTool({
      name: "execute_operation",
      arguments: {
        operationId: "encoding.transform",
        arguments: { mode: "base64", direction: "encode", input: "hello" }
      }
    });
    assert.notEqual(result.isError, true);
    assert.equal(result.structuredContent?.success, true);
    assert.equal(result.structuredContent?.result, "aGVsbG8=");
  } finally {
    await client.close();
  }
});
