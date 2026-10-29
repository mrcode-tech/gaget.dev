import test from "node:test";
import assert from "node:assert/strict";
import { handleMcpPost } from "../lib/mcp/runtime.ts";

const token = "regression-secret";
const parseProtocolResponse = async (response) => {
  const body = await response.text();
  const eventData = body.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trim()).at(-1);
  return JSON.parse(eventData ?? body);
};
const request = (payload, auth = `Bearer ${token}`, extraHeaders = {}) => new Request("http://localhost/api/mcp", { method: "POST", headers: { authorization: auth, "content-type": "application/json", accept: "application/json, text/event-stream", ...extraHeaders }, body: typeof payload === "string" ? payload : JSON.stringify(payload) });
const call = (operationId, args) => ({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "execute_operation", arguments: { operationId, arguments: args } } });

test("rejects invalid JSON and malformed JSON-RPC requests", async () => {
  assert.equal((await handleMcpPost(request("{"), token)).status, 400);
  const invalid = await handleMcpPost(request({ method: "tools/list", id: 1 }), token);
  assert.equal(invalid.status, 400);
  assert.equal((await parseProtocolResponse(invalid)).error.code, -32600);
});

test("rejects incorrect bearer tokens without echoing supplied credentials", async () => {
  const response = await handleMcpPost(request({ jsonrpc: "2.0", id: 1, method: "tools/list" }, "Bearer attacker-supplied"), token);
  assert.equal(response.status, 401);
  assert.doesNotMatch(await response.text(), /attacker-supplied|regression-secret/);
});

test("refuses remote operation execution unless explicit bearer authorization is configured", async () => {
  const response = await handleMcpPost(request(call("encoding.transform", { mode: "base64", direction: "encode", input: "private" })), undefined);
  assert.equal(response.status, 503);
});

test("malicious and unapproved operation IDs cannot access filesystem, shell or network", async () => {
  for (const operationId of ["../../etc/passwd", "shell.exec", "fetch.url", "node.import", "__proto__"]) {
    const response = await handleMcpPost(request(call(operationId, { input: "test" })), token);
    const payload = await parseProtocolResponse(response);
    assert.ok(payload.result?.isError === true || payload.error, JSON.stringify(payload));
  }
});

test("does not execute cURL text or treat HTML as active markup", async () => {
  const curl = await handleMcpPost(request(call("developer.format", { operation: "curl", input: "curl https://example.invalid" })), token);
  const curlResult = (await parseProtocolResponse(curl)).result;
  assert.notEqual(curlResult.isError, true);
  assert.match(curlResult.structuredContent.result, /never sends the request/i);
  const html = await handleMcpPost(request(call("developer.format", { operation: "html", input: "<script>alert(1)</script>", mode: "format" })), token);
  assert.notEqual((await parseProtocolResponse(html)).result?.isError, true);
  const contentType = html.headers.get("content-type") ?? "";
  assert.ok(contentType.includes("application/json") || contentType.includes("text/event-stream"));
});

test("request body limit is enforced while streaming when Content-Length is absent", async () => {
  const oversized = "x".repeat(1_000_001);
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(oversized.slice(0, 500_000)));
      controller.enqueue(new TextEncoder().encode(oversized.slice(500_000)));
      controller.close();
    }
  });
  const req = new Request("http://localhost/api/mcp", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body,
    // A streamed request deliberately has no Content-Length header.
    duplex: "half"
  });
  assert.equal((await handleMcpPost(req, token)).status, 413);
});

test("invalid operation errors do not expose parser internals", async () => {
  const response = await handleMcpPost(request(call("json.format", { input: "{broken" })), token);
  const body = await response.text();
  assert.doesNotMatch(body, /Unexpected token|JSON at position|stack|node_modules|home/i);
});
