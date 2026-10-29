import { transformEncoding, type EncodingMode, type EncodingDirection } from "../tools/encoding-operations.ts";
import { transformText, type TextOperation } from "../tools/text-operations.ts";
import { diagnoseJson, compareJsonDocuments } from "../tools/json-workspace.ts";
import { transformDeveloperTool, type DeveloperOperation } from "../tools/developer-operations.ts";

export const MCP_MAX_REQUEST_BYTES = 1_000_000;
export const MCP_MAX_OUTPUT_BYTES = 2_000_000;
export const MCP_PROTOCOL_VERSION = "2025-11-25";
export type McpErrorCode = "INVALID_INPUT" | "UNSUPPORTED_OPERATION" | "RESOURCE_LIMIT_EXCEEDED" | "PROCESSING_FAILED" | "AUTHENTICATION_REQUIRED";
export class McpRuntimeError extends Error {
  constructor(readonly code: McpErrorCode, message: string) { super(message); this.name = "McpRuntimeError"; }
}
type JsonObject = Record<string, unknown>;
const isObject = (v: unknown): v is JsonObject => !!v && typeof v === "object" && !Array.isArray(v);
const stringField = (input: JsonObject, key: string, max = 200_000): string => {
  const value = input[key];
  if (typeof value !== "string") throw new McpRuntimeError("INVALID_INPUT", `'${key}' must be a string.`);
  if (value.length > max) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", `'${key}' exceeds the supported input limit.`);
  return value;
};
const schemas = {
  "encoding.transform": { type: "object", properties: { mode: { type: "string", enum: ["url","base64","base64url","base32","hex","binary","html-entities","unicode-escapes","quoted-printable","base58","base85","z85"] }, direction: { type: "string", enum: ["encode","decode"] }, input: { type: "string", maxLength: 1000000 } }, required: ["mode","direction","input"], additionalProperties: false },
  "text.transform": { type: "object", properties: { operation: { type: "string", enum: ["trim","sort-dedupe","case","normalize","escape","statistics","diff","find-replace","split-join"] }, input: { type: "string", maxLength: 200000 }, options: { type: "object" } }, required: ["operation","input"], additionalProperties: false },
  "json.validate": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.format": { type: "object", properties: { input: { type: "string", maxLength: 200000 }, indent: { type: "integer", minimum: 0, maximum: 8 } }, required: ["input"], additionalProperties: false },
  "json.minify": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.diff": { type: "object", properties: { before: { type: "string", maxLength: 200000 }, after: { type: "string", maxLength: 200000 } }, required: ["before","after"], additionalProperties: false },
  "developer.format": { type: "object", properties: { operation: { type: "string", enum: ["xml","sql","html","csv-json"] }, input: { type: "string", maxLength: 200000 }, mode: { type: "string", enum: ["format","minify","json-to-csv"] }, delimiter: { type: "string", maxLength: 1 } }, required: ["operation","input"], additionalProperties: false }
} as const;

const capabilityList = [
  { id: "encoding.transform", version: "1.0.0", description: "Encode or decode bounded text. Does not perform network requests.", limits: { maxInputCharacters: 1000000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "text.transform", version: "1.0.0", description: "Run an allowlisted bounded text transformation.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.validate", version: "1.0.0", description: "Validate JSON syntax and return safe diagnostics.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.format", version: "1.0.0", description: "Format valid JSON.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.minify", version: "1.0.0", description: "Minify valid JSON.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.diff", version: "1.0.0", description: "Compare two JSON documents.", limits: { maxInputCharactersPerDocument: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "developer.format", version: "1.0.0", description: "Format/minify supported XML, SQL, HTML text, or convert CSV/JSON. Does not execute input.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } }
] as const;

export function listCapabilities() { return capabilityList; }
export async function executeOperation(operationId: string, rawInput: unknown): Promise<unknown> {
  if (!isObject(rawInput)) throw new McpRuntimeError("INVALID_INPUT", "Operation arguments must be a JSON object.");
  let result: unknown;
  try {
    switch (operationId) {
      case "encoding.transform": {
        const mode = stringField(rawInput, "mode", 32) as EncodingMode;
        const direction = stringField(rawInput, "direction", 8) as EncodingDirection;
        const input = stringField(rawInput, "input", 1_000_000);
        result = transformEncoding(mode, direction, input);
        break;
      }
      case "text.transform": {
        const operation = stringField(rawInput, "operation", 32) as TextOperation;
        const input = stringField(rawInput, "input");
        const options = isObject(rawInput.options) ? rawInput.options : {};
        result = transformText(operation, input, options as Parameters<typeof transformText>[2]);
        break;
      }
      case "json.validate": {
        const input = stringField(rawInput, "input");
        const parsed = diagnoseJson(input);
        result = parsed.ok ? { valid: true } : { valid: false, diagnostics: parsed.diagnostics };
        break;
      }
      case "json.format":
      case "json.minify": {
        const input = stringField(rawInput, "input");
        const parsed = diagnoseJson(input);
        if (!parsed.ok) throw new McpRuntimeError("INVALID_INPUT", "Input is not valid JSON.");
        const indent = operationId === "json.minify" ? 0 : (typeof rawInput.indent === "number" ? Math.min(8, Math.max(0, Math.floor(rawInput.indent))) : 2);
        result = JSON.stringify(parsed.value, null, indent);
        break;
      }
      case "json.diff": {
        const before = stringField(rawInput, "before");
        const after = stringField(rawInput, "after");
        if (!diagnoseJson(before).ok || !diagnoseJson(after).ok) throw new McpRuntimeError("INVALID_INPUT", "Both inputs must be valid JSON.");
        result = compareJsonDocuments(before, after);
        break;
      }
      case "developer.format": {
        const operation = stringField(rawInput, "operation", 16) as DeveloperOperation;
        const input = stringField(rawInput, "input");
        const mode = typeof rawInput.mode === "string" ? rawInput.mode : "format";
        const delimiter = typeof rawInput.delimiter === "string" ? rawInput.delimiter : ",";
        result = transformDeveloperTool(operation, input, { mode, delimiter });
        break;
      }
      default: throw new McpRuntimeError("UNSUPPORTED_OPERATION", "This operation is not enabled for MCP execution.");
    }
  } catch (error) {
    if (error instanceof McpRuntimeError) throw error;
    throw new McpRuntimeError("PROCESSING_FAILED", error instanceof Error ? error.message.slice(0, 300) : "The operation failed.");
  }
  const bytes = new TextEncoder().encode(JSON.stringify(result)).byteLength;
  if (bytes > MCP_MAX_OUTPUT_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Operation result exceeds the supported output limit.");
  return result;
}

function rpcError(id: unknown, code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}
export async function handleMcpPost(request: Request, configuredToken: string | undefined): Promise<Response> {
  if (!configuredToken) return Response.json({ error: "MCP endpoint is not configured. Set MCP_AUTH_TOKEN before enabling remote access." }, { status: 503 });
  const authorization = request.headers.get("authorization") ?? "";
  if (authorization !== `Bearer ${configuredToken}`) return Response.json({ error: "Authentication required." }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MCP_MAX_REQUEST_BYTES) return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
  let raw: string;
  try { raw = await request.text(); } catch { return Response.json({ error: "Unable to read request body." }, { status: 400 }); }
  if (new TextEncoder().encode(raw).byteLength > MCP_MAX_REQUEST_BYTES) return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
  let message: unknown;
  try { message = JSON.parse(raw); } catch { return Response.json(rpcError(null, -32700, "Parse error"), { status: 400 }); }
  if (!isObject(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string") return Response.json(rpcError(isObject(message) ? message.id : null, -32600, "Invalid Request"), { status: 400 });
  const id = message.id;
  if (message.method === "notifications/initialized" || message.method === "notifications/cancelled") return new Response(null, { status: 202 });
  if (message.method === "ping") return Response.json({ jsonrpc: "2.0", id, result: {} });
  if (message.method === "initialize") {
    return Response.json({ jsonrpc: "2.0", id, result: { protocolVersion: MCP_PROTOCOL_VERSION, capabilities: { tools: { listChanged: false } }, serverInfo: { name: "GaGet.dev MCP", version: "1.0.0" }, instructions: "Only listed bounded operations are available. Inputs are processed server-side after explicit transfer; do not send secrets or files unless required." } });
  }
  if (message.method === "tools/list") {
    return Response.json({ jsonrpc: "2.0", id, result: { tools: [
      { name: "list_capabilities", description: "List approved server-executable operations and limits.", inputSchema: { type: "object", properties: {}, additionalProperties: false } },
      { name: "execute_operation", description: "Execute one allowlisted bounded operation. Never executes code or makes network requests.", inputSchema: { type: "object", properties: { operationId: { type: "string", enum: capabilityList.map(c => c.id) }, arguments: { type: "object" } }, required: ["operationId","arguments"], additionalProperties: false } }
    ] } });
  }
  if (message.method === "tools/call") {
    const params = isObject(message.params) ? message.params : {};
    const name = params.name;
    const args = isObject(params.arguments) ? params.arguments : {};
    try {
      let result: unknown;
      if (name === "list_capabilities") result = listCapabilities();
      else if (name === "execute_operation") {
        const operationId = typeof args.operationId === "string" ? args.operationId : "";
        if (!capabilityList.some(capability => capability.id === operationId)) throw new McpRuntimeError("UNSUPPORTED_OPERATION", "This operation is not enabled for MCP execution.");
        result = await executeOperation(operationId, args.arguments);
      } else throw new McpRuntimeError("UNSUPPORTED_OPERATION", "Unknown MCP tool.");
      return Response.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result, isError: false } });
    } catch (error) {
      const message = error instanceof McpRuntimeError ? error.message : "The operation failed.";
      return Response.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: message }], isError: true } });
    }
  }
  if (id === undefined) return new Response(null, { status: 202 });
  return Response.json(rpcError(id, -32601, "Method not found"), { status: 200 });
}
