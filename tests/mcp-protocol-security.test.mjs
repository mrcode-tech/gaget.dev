import test from "node:test";
import assert from "node:assert/strict";
import { handleMcpPost } from "../lib/mcp/runtime.ts";

const token = "regression-secret";
const request = (payload, auth = `Bearer ${token}`, extraHeaders = {}) => new Request("http://localhost/api/mcp", { method: "POST", headers: { authorization: auth, "content-type": "application/json", ...extraHeaders }, body: typeof payload === "string" ? payload : JSON.stringify(payload) });
const call = (operationId, args) => ({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "execute_operation", arguments: { operationId, arguments: args } } });

test("rejects invalid JSON and malformed JSON-RPC requests", async () => {
  assert.equal((await handleMcpPost(request("{"), token)).status, 400);
  const invalid = await handleMcpPost(request({ method: "tools/list", id: 1 }), token);
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, -32600);
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
    assert.equal((await response.json()).result.isError, true);
  }
});

test("does not execute cURL text or treat HTML as active markup", async () => {
  const curl = await handleMcpPost(request(call("developer.format", { operation: "curl", input: "curl https://example.invalid" })), token);
  const curlResult = (await curl.json()).result;
  assert.equal(curlResult.isError, false);
  assert.match(curlResult.structuredContent, /never sends the request/i);
  const html = await handleMcpPost(request(call("developer.format", { operation: "html", input: "<script>alert(1)</script>", mode: "format" })), token);
  assert.equal((await html.json()).result.isError, false);
  assert.equal(html.headers.get("content-type")?.includes("application/json"), true);
});
