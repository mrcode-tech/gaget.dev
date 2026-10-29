import test from "node:test";
import assert from "node:assert/strict";
import { executeOperation, executeWorkflow, handleMcpPost, listCapabilities, MCP_MAX_REQUEST_BYTES, MCP_MAX_WORKFLOW_STEPS } from "../lib/mcp/runtime.ts";

const token = "test-only-secret-token";
const parseProtocolResponse = async (response) => {
  const body = await response.text();
  const eventData = body.split("\n").filter(line => line.startsWith("data:")).map(line => line.slice(5).trim()).at(-1);
  return JSON.parse(eventData ?? body);
};
const post = (body, authorization = `Bearer ${token}`, headers = {}) => handleMcpPost(new Request("http://localhost/api/mcp", { method: "POST", headers: { authorization, "content-type": "application/json", accept: "application/json, text/event-stream", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) }), token);

test("capability registry contains stable IDs, versions and finite limits", () => {
  const capabilities = listCapabilities();
  assert.ok(capabilities.length >= 5);
  assert.equal(new Set(capabilities.map(item => item.id)).size, capabilities.length);
  for (const item of capabilities) {
    assert.match(item.version, /^\d+\.\d+\.\d+$/);
    assert.ok(Object.values(item.limits).every(limit => Number.isFinite(limit) && limit > 0));
    assert.equal(item.inputSchema.type, "object");
    assert.ok(item.outputSchema.type);
  }
});

test("allowlisted operations invoke real shared transformations", async () => {
  assert.equal(await executeOperation("encoding.transform", { mode: "base64", direction: "encode", input: "Hello" }), "SGVsbG8=");
  assert.deepEqual(await executeOperation("json.validate", { input: "{\"ok\":true}" }), { valid: true });
  assert.equal(await executeOperation("json.format", { input: "{\"ok\":true}" }), '{\n  "ok": true\n}');
  await assert.rejects(executeOperation("shell.exec", { command: "id" }), { code: "UNSUPPORTED_OPERATION" });
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
  const init = await parseProtocolResponse(initialized);
  assert.equal(init.result.protocolVersion, "2025-11-25");
  assert.equal(init.result.serverInfo.name, "GaGet.dev MCP");
  const listed = await post({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  const tools = (await parseProtocolResponse(listed)).result.tools;
  assert.deepEqual(tools.map(tool => tool.name), ["list_capabilities", "execute_operation", "execute_workflow"]);
});

test("MCP tool call returns structured results and refuses disabled operation IDs", async () => {
  const good = await post({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "execute_operation", arguments: { operationId: "encoding.transform", arguments: { mode: "base64", direction: "encode", input: "hello" } } } });
  const result = (await parseProtocolResponse(good)).result;
  assert.notEqual(result.isError, true);
  assert.equal(result.structuredContent.success, true);
  assert.equal(result.structuredContent.result, "aGVsbG8=");
  const bad = await post({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "execute_operation", arguments: { operationId: "arbitrary.shell", arguments: { command: "whoami" } } } });
  const badResult = await parseProtocolResponse(bad);
  assert.ok(badResult.result?.isError === true || badResult.result?.structuredContent?.success === false || badResult.error);
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

test("operation schemas reject unknown fields and invalid enum values", async () => {
  await assert.rejects(executeOperation("encoding.transform", { mode: "base64", direction: "encode", input: "x", extra: true }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("encoding.transform", { mode: "made-up", direction: "encode", input: "x" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("json.format", { input: '{"ok":true}', indent: 99 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("developer.format", { operation: "sql", input: "select 1", mode: "execute" }), { code: "INVALID_INPUT" });
});

test("bounded workflows execute typed sequential operations and return a result manifest", async () => {
  const result = await executeWorkflow({
    schemaVersion: 1,
    steps: [
      { id: "format", operationId: "json.format", arguments: { input: '{"ok":true}', indent: 2 } },
      { id: "trim", operationId: "text.transform", arguments: { operation: "trim", input: { $ref: "format.result" } } }
    ]
  });
  assert.equal(result.success, true);
  assert.equal(result.steps.length, 2);
  assert.equal(result.result, '{\n  "ok": true\n}');
  assert.ok(result.totalOutputBytes > 0);
});
test("workflow rejects forward, missing, object, and non-text references", async () => {
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[
    {id:"first",operationId:"text.transform",arguments:{operation:"trim",input:{$ref:"later.result"}}},
    {id:"later",operationId:"json.format",arguments:{input:"{}"}}
  ]}), {code:"INVALID_INPUT"});
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[
    {id:"check",operationId:"json.validate",arguments:{input:"{}"}},
    {id:"use",operationId:"text.transform",arguments:{operation:"trim",input:{$ref:"check.result"}}}
  ]}), {code:"INVALID_INPUT"});
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[
    {id:"first",operationId:"text.transform",arguments:{operation:"trim",input:{nested:{$ref:"first.result"}}}}
  ]}), {code:"INVALID_INPUT"});
});
test("workflow enforces schema, step, reference, deadline and cancellation limits", async () => {
  await assert.rejects(executeWorkflow({schemaVersion:2,steps:[{id:"a",operationId:"json.format",arguments:{input:"{}"}}]}), {code:"INVALID_INPUT"});
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:Array.from({length:MCP_MAX_WORKFLOW_STEPS+1},(_,i)=>({id:"s"+i,operationId:"text.transform",arguments:{operation:"trim",input:"x"}}))}), {code:"RESOURCE_LIMIT_EXCEEDED"});
  const controller = new AbortController(); controller.abort();
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[{id:"a",operationId:"json.format",arguments:{input:"{}"}}]},{signal:controller.signal}), {code:"CANCELLED"});
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[{id:"a",operationId:"json.format",arguments:{input:"{}"}}]},{deadlineMs:0}), {code:"INVALID_INPUT"});
});
test("MCP execute_workflow tool is discoverable and returns a safe manifest", async () => {
  const response = await post({jsonrpc:"2.0",id:17,method:"tools/call",params:{name:"execute_workflow",arguments:{schemaVersion:1,steps:[
    {id:"format",operationId:"json.format",arguments:{input:'{"ok":true}',indent:2}},
    {id:"trim",operationId:"text.transform",arguments:{operation:"trim",input:{$ref:"format.result"}}}
  ]}}});
  const payload = await parseProtocolResponse(response);
  assert.equal(payload.result.structuredContent.success,true);
  assert.equal(payload.result.structuredContent.steps.length,2);
});

test("security hash operation distinguishes digest and HMAC and protects keys", async () => {
  assert.equal(await executeOperation("security.hash", { input: "abc", mode: "digest", algorithm: "SHA-256" }), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  await assert.rejects(executeOperation("security.hash", { input: "abc", mode: "hmac" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("security.hash", { input: "abc", mode: "digest", key: "secret" }), { code: "INVALID_INPUT" });
});
test("JWT decoder returns claims without implying signature verification", async () => {
  const token = Buffer.from(JSON.stringify({alg:"none",typ:"JWT"})).toString("base64url") + "." + Buffer.from(JSON.stringify({sub:"123",exp:1})).toString("base64url") + ".";
  const result = await executeOperation("security.jwt.decode", { token });
  assert.equal(result.signatureVerified, false);
  assert.equal(result.claims.sub, "123");
  assert.match(result.note, /does not verify/i);
  await assert.rejects(executeOperation("security.jwt.decode", { token: "not.a.jwt" }), { code: "INVALID_INPUT" });
});
test("bounded synthetic data and offline inspection operations work without network access", async () => {
  const uuid = await executeOperation("generator.sample", { operation: "uuid", count: 2 });
  assert.equal(uuid.split("\n").length, 2);
  await assert.rejects(executeOperation("generator.sample", { operation: "uuid", count: 101 }), { code: "INVALID_INPUT" });
  const parsed = await executeOperation("data.inspect", { operation: "url-parse", input: "https://example.test/path?q=1" });
  assert.match(parsed, /networkRequestsMade": false/);
  await assert.rejects(executeOperation("data.inspect", { operation: "url-parse", input: "https://example.test", options: { unexpected: true } }), { code: "INVALID_INPUT" });
});
test("date-time operations require explicit offsets and handle UTC arithmetic deterministically", async () => {
  const converted = await executeOperation("datetime.convert", { mode: "iso-to-epoch", input: "2024-01-01T00:00:00Z" });
  assert.equal(converted.epochMilliseconds, 1704067200000);
  const added = await executeOperation("datetime.arithmetic", { input: "2024-01-01T00:00:00Z", amount: 1, unit: "days" });
  assert.equal(added.result, "2024-01-02T00:00:00.000Z");
  const compared = await executeOperation("datetime.compare", { left: "2024-01-01T00:00:00Z", right: "2023-12-31T19:00:00-05:00" });
  assert.equal(compared.relation, "equal");
  await assert.rejects(executeOperation("datetime.convert", { mode: "format", input: "2024-01-01T00:00:00" }), { code: "INVALID_INPUT" });
});

test("workflow accepts bounded literal options but rejects nested references", async () => {
  const result = await executeWorkflow({schemaVersion:1,steps:[
    {id:"replace",operationId:"text.transform",arguments:{operation:"find-replace",input:"abc",options:{pattern:"b",replacement:"X"}}}
  ]});
  assert.equal(result.result,"aXc");
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[
    {id:"first",operationId:"json.format",arguments:{input:"{}"}},
    {id:"second",operationId:"text.transform",arguments:{operation:"trim",input:"x",options:{nested:{$ref:"first.result"}}}}
  ]}), {code:"INVALID_INPUT"});
});
test("additional MCP capabilities advertise stable schemas and finite limits", () => {
  const ids = listCapabilities().map(item => item.id);
  for (const id of ["security.hash","security.jwt.decode","generator.sample","data.inspect","datetime.convert","datetime.arithmetic","datetime.compare"]) assert.ok(ids.includes(id), id);
});
