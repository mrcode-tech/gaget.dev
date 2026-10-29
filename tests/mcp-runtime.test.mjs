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

test("charset conversion is explicit, bounded, and composable in workflows", async () => {
  assert.equal(await executeOperation("encoding.charset", { direction: "encode", charset: "utf-8", input: "Hello" }), "48656c6c6f");
  assert.equal(await executeOperation("encoding.charset", { direction: "decode", charset: "utf-16be", input: "00480069" }), "Hi");
  assert.equal(await executeOperation("encoding.charset", { direction: "encode", charset: "windows-1252", input: "€" }), "80");
  await assert.rejects(executeOperation("encoding.charset", { direction: "decode", charset: "utf-8", input: "zz" }), { code: "PROCESSING_FAILED" });
  await assert.rejects(executeOperation("encoding.charset", { direction: "encode", charset: "unsupported", input: "x" }), { code: "INVALID_INPUT" });
  const workflow = await executeWorkflow({ schemaVersion: 1, steps: [
    { id: "to_hex", operationId: "encoding.charset", arguments: { direction: "encode", charset: "utf-8", input: "Hi" } },
    { id: "back", operationId: "encoding.charset", arguments: { direction: "decode", charset: "utf-8", input: { "$ref": "to_hex.result" } } }
  ] });
  assert.equal(workflow.result, "Hi");
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
  assert.equal(JSON.parse(result.result).result,"aXc");
  await assert.rejects(executeWorkflow({schemaVersion:1,steps:[
    {id:"first",operationId:"json.format",arguments:{input:"{}"}},
    {id:"second",operationId:"text.transform",arguments:{operation:"trim",input:"x",options:{nested:{$ref:"first.result"}}}}
  ]}), {code:"INVALID_INPUT"});
});
test("additional MCP capabilities advertise stable schemas and finite limits", () => {
  const ids = listCapabilities().map(item => item.id);
  for (const id of ["security.hash","security.jwt.decode","generator.sample","data.inspect","datetime.convert","datetime.arithmetic","datetime.compare"]) assert.ok(ids.includes(id), id);
});

test("JSON sort, escape, unescape, and bounded search operations are available", async () => {
  assert.equal(await executeOperation("json.sort-keys", { input: '{"z":1,"a":{"y":2,"b":3}}' }), '{\n  "a": {\n    "b": 3,\n    "y": 2\n  },\n  "z": 1\n}');
  assert.equal(await executeOperation("json.escape", { input: 'a"b\n' }), 'a\\"b\\n');
  assert.equal(await executeOperation("json.unescape", { input: 'a\\"b\\n' }), 'a"b\n');
  const found = await executeOperation("json.find", { input: '{"name":"Alice","nested":{"name":"Bob"}}', query: "name", match: "both" });
  assert.equal(found.matches.length, 2);
  assert.equal(found.truncated, false);
  await assert.rejects(executeOperation("json.find", { input: "{}", query: "" }), { code: "INVALID_INPUT" });
});

test("request body streams that stall are cancelled after the read deadline", async () => {
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new TextEncoder().encode('{"jsonrpc":"2.0","id":1,"method":"tools/list"}')); }
  });
  const request = new Request("http://localhost/api/mcp", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: stream,
    duplex: "half"
  });
  const response = await handleMcpPost(request, token);
  assert.equal(response.status, 408);
});


test("MCP text operations do not expose regex execution until it is safely bounded", async () => {
  await assert.rejects(executeOperation("text.transform", { operation: "regex-test", input: "abc", options: { pattern: "(a+)+" } }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("text.transform", { operation: "find-replace", input: "abc", options: { pattern: "a", replacement: "x", regexFind: true } }), { code: "INVALID_INPUT" });
});

test("image transformations support bounded grayscale, blur, and tonal adjustments", async () => {
  const { default: sharp } = await import("sharp");
  const png = await sharp({ create: { width: 8, height: 6, channels: 3, background: "#336699" } }).png().toBuffer();
  const inputBase64 = png.toString("base64");
  for (const actionArgs of [{ action: "grayscale" }, { action: "blur", sigma: 1.2 }, { action: "adjust", brightness: 1.1, contrast: 1.2, saturation: 0.8 }]) {
    const result = await executeOperation("image.transform", { inputBase64, ...actionArgs });
    assert.equal(result.width, 8);
    assert.equal(result.height, 6);
    assert.ok(Buffer.from(result.dataBase64, "base64").byteLength > 0);
  }
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "blur" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "adjust", brightness: 10 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "grayscale", sigma: 1 }), { code: "INVALID_INPUT" });
});

test("workflow can select a bounded image data field as its final text output", async () => {
  const { default: sharp } = await import("sharp");
  const png = await sharp({ create: { width: 4, height: 3, channels: 3, background: "#336699" } }).png().toBuffer();
  const workflow = await executeWorkflow({ schemaVersion: 1, steps: [
    { id: "crop", operationId: "image.transform", arguments: { inputBase64: png.toString("base64"), action: "crop", left: 0, top: 0, width: 3, height: 2 } },
    { id: "resize", operationId: "image.transform", arguments: { inputBase64: { $ref: "crop.result.dataBase64" }, action: "resize", width: 2, height: 2 } }
  ], output: { $ref: "resize.result.dataBase64" } });
  assert.equal(workflow.success, true);
  assert.equal(typeof workflow.result, "string");
  assert.ok(Buffer.from(workflow.result, "base64").byteLength > 0);
  await assert.rejects(executeWorkflow({ schemaVersion: 1, steps: [{ id: "validate", operationId: "json.validate", arguments: { input: "{}" } }], output: { $ref: "validate.result.valid" } }), { code: "INVALID_INPUT" });
});

test("image crop and resize can be chained through explicit bounded dataBase64 references", async () => {
  const { default: sharp } = await import("sharp");
  const png = await sharp({ create: { width: 4, height: 3, channels: 3, background: "#336699" } }).png().toBuffer();
  const workflow = await executeWorkflow({ schemaVersion: 1, steps: [
    { id: "crop", operationId: "image.transform", arguments: { inputBase64: png.toString("base64"), action: "crop", left: 1, top: 1, width: 2, height: 2 } },
    { id: "resize", operationId: "image.transform", arguments: { inputBase64: { $ref: "crop.result.dataBase64" }, action: "resize", width: 1, height: 1 } }
  ] });
  assert.equal(workflow.success, true);
  assert.equal(workflow.steps.length, 2);
  assert.equal(workflow.result.width, 1);
  assert.equal(workflow.result.height, 1);
  await assert.rejects(executeWorkflow({ schemaVersion: 1, steps: [
    { id: "crop", operationId: "image.transform", arguments: { inputBase64: png.toString("base64"), action: "crop", left: 0, top: 0, width: 2, height: 2 } },
    { id: "bad", operationId: "image.transform", arguments: { inputBase64: { $ref: "crop.result.width" }, action: "resize", width: 1 } }
  ] }), { code: "INVALID_INPUT" });
});

test("workflow tool returns schema-conforming structured errors for invalid references", async () => {
  const response = await post({jsonrpc:"2.0",id:88,method:"tools/call",params:{name:"execute_workflow",arguments:{schemaVersion:1,steps:[
    {id:"bad",operationId:"text.transform",arguments:{operation:"trim",input:{$ref:"missing.result"}}}
  ]}}});
  const payload = await parseProtocolResponse(response);
  assert.equal(payload.result.isError, true);
  assert.equal(payload.result.structuredContent.success, false);
  assert.equal(payload.result.structuredContent.error.code, "INVALID_INPUT");
});

test("image inspection and transformations use bounded raster bytes", async () => {
  const { default: sharp } = await import("sharp");
  const png = await sharp({ create: { width: 3, height: 2, channels: 3, background: "#336699" } }).png().toBuffer();
  const inputBase64 = png.toString("base64");
  const inspected = await executeOperation("image.inspect", { inputBase64 });
  assert.equal(inspected.width, 3);
  assert.equal(inspected.height, 2);
  assert.equal(inspected.format, "png");
  assert.equal(inspected.aspectRatio, 1.5);
  assert.equal(inspected.pixelCount, 6);
  const cropped = await executeOperation("image.transform", { inputBase64, action: "crop", left: 1, top: 0, width: 2, height: 1 });
  assert.equal(cropped.width, 2);
  assert.equal(cropped.height, 1);
  const normalizedCrop = await executeOperation("image.transform", { inputBase64, action: "crop", leftRatio: 0, topRatio: 0, widthRatio: 2 / 3, heightRatio: 0.5 });
  assert.equal(normalizedCrop.width, 2);
  assert.equal(normalizedCrop.height, 1);
  const transformed = await executeOperation("image.transform", { inputBase64, action: "resize", width: 1 });
  assert.equal(transformed.width, 1);
  assert.equal(transformed.height, 1);
  const contained = await executeOperation("image.transform", { inputBase64, action: "resize", width: 4, height: 4, fit: "contain" });
  assert.ok(contained.width <= 4 && contained.height <= 4);
  const filled = await executeOperation("image.transform", { inputBase64, action: "resize", width: 4, height: 4, fit: "fill" });
  assert.equal(filled.width, 4);
  assert.equal(filled.height, 4);
  const covered = await executeOperation("image.transform", { inputBase64, action: "resize", width: 4, height: 4, fit: "cover", position: "northwest" });
  assert.equal(covered.width, 4);
  assert.equal(covered.height, 4);
  assert.ok(Buffer.from(transformed.dataBase64, "base64").length <= 600_000);
  await assert.rejects(executeOperation("image.inspect", { inputBase64: "not-base64" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "rotate", degrees: 45 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "resize", width: 2, fit: "stretch" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "grayscale", position: "centre" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "rotate", degrees: 90, width: 1 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "resize", width: 1, quality: 80 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "flip", format: "png" }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "crop", left: 2, top: 0, width: 2, height: 1 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "crop", left: -1, top: 0, width: 1, height: 1 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "crop", leftRatio: 0.8, topRatio: 0, widthRatio: 0.5, heightRatio: 0.5 }), { code: "INVALID_INPUT" });
  await assert.rejects(executeOperation("image.transform", { inputBase64, action: "crop", left: 0, top: 0, width: 1, height: 1, widthRatio: 0.5, heightRatio: 0.5 }), { code: "INVALID_INPUT" });
});
