import test from "node:test";
import assert from "node:assert/strict";
import { executeOperation, handleMcpPost, listCapabilities, MCP_MAX_REQUEST_BYTES } from "../lib/mcp/runtime.ts";

const token = "test-only-secret-token";
const post = (body, authorization = `Bearer ${token}`, headers = {}) => handleMcpPost(new Request("http://localhost/api/mcp", { method: "POST", headers: { authorization, "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }), token);

test("capability registry contains stable IDs, versions and finite limits", () => {
  const capabilities = listCapabilities();
  assert.ok(capabilities.length >= 5);
  assert.equal(new Set(capabilities.map(item => item.id)).size, capabilities.length);
  for (const item of capabilities) {
    assert.match(item.version, /^\d+\.\d+\.\d+$/);
    assert.ok(Object.values(item.limits).every(limit => Number.isFinite(limit) && limit > 0));
  }
});

test("allowlisted operations invoke real shared transformations", async () => {
  assert.equal(await executeOperation("encoding.transform", { mode: "base64", direction: "encode", input: "Hello" }), "SGVsbG8=");
  assert.deepEqual(await executeOperation("json.validate", { input: "{\"ok\":true}" }), { valid: true });
  assert.equal(await executeOperation("json.format", { input: "{\"ok\":true}" }), '{\n  "ok": true\n}');
  assert.throws(() => executeOperation("shell.exec", { command: "id" }), { code: "UNSUPPORTED_OPERATION" });
});

test("runtime rejects malformed inputs and over-limit data with stable errors", async () => {
  await assert.rejects(executeOperation("encoding.transform", { mode: "base64", direction: "encode", input: 42 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("encoding.transform", { mode: "base64", direction: "encode", input: "x".repeat(1_000_001) }), { code: "RESOURCE_LIMIT_EXCEEDED" });
  await assert.rejects(executeOperation("json.format", { input: "{broken" }), { code: "INVALID_INPUT" });
});

test("authentication is mandatory and missing server configuration disables the endpoint", async () => {
  const noAuth = await handleMcpPost(new Request("http://localhost/api/mcp", { method: "POST", body: "{}" }), token);
  assert.equal(noAuth.status, 401);
  const disabled = await handleMcpPost(new Request("http://localhost/api/mcp", { method: "POST", body: "{}" }), undefined);
  assert.equal(disabled.status, 503);
});

test("MCP initialize and tools/list implement JSON-RPC response envelopes", async () => {
  const initialized = await post({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "contract-test", version: "1" } } });
  assert.equal(initialized.status, 200);
  const init = await initialized.json();
  assert.equal(init.result.protocolVersion, "2025-11-25");
  assert.equal(init.result.serverInfo.name, "GaGet.dev MCP");
  const listed = await post({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  const tools = (await listed.json()).result.tools;
  assert.deepEqual(tools.map(tool => tool.name), ["list_capabilities", "execute_operation"]);
});

test("MCP tool call returns structured results and refuses disabled operation IDs", async () => {
  const good = await post({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "execute_operation", arguments: { operationId: "encoding.transform", arguments: { mode: "base64", direction: "encode", input: "hello" } } } });
  const result = (await good.json()).result;
  assert.equal(result.isError, false);
  assert.equal(result.structuredContent, "aGVsbG8=");
  const bad = await post({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "execute_operation", arguments: { operationId: "arbitrary.shell", arguments: { command: "whoami" } } } });
  assert.equal((await bad.json()).result.isError, true);
});

test("request body byte limits are enforced before protocol dispatch", async () => {
  const body = "x".repeat(MCP_MAX_REQUEST_BYTES + 1);
  const response = await post(body);
  assert.equal(response.status, 413);
});

test("protocol errors do not expose stack traces or internal file paths", async () => {
  const response = await post({ jsonrpc: "2.0", id: 9, method: "tools/call", params: { name: "execute_operation", arguments: { operationId: "json.format", arguments: { input: "{nope" } } } });
  const body = await response.text();
  assert.doesNotMatch(body, /stack|\/home\/|node_modules|\.ts:\d+/i);
});
