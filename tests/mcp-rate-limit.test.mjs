import test from "node:test";
import assert from "node:assert/strict";
import { handleMcpPost, MCP_MAX_REQUESTS_PER_MINUTE } from "../lib/mcp/runtime.ts";

const token = "mcp-rate-limit-test-token-32-bytes-minimum";
test("per-process MCP rate limiting rejects excessive authenticated calls", async () => {
  let response;
  for (let i = 0; i < MCP_MAX_REQUESTS_PER_MINUTE + 1; i++) {
    response = await handleMcpPost(new Request("http://localhost/api/mcp", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: i + 1, method: "tools/list" })
    }), token);
    if (response.status === 429) break;
  }
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
});
