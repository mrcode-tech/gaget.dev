import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { transformEncoding, type EncodingMode, type EncodingDirection } from "../tools/encoding-operations.ts";
import { transformText, type TextOperation } from "../tools/text-operations.ts";
import { diagnoseJson, compareJsonDocuments } from "../tools/json-workspace.ts";
import { transformDeveloperTool, type DeveloperOperation } from "../tools/developer-operations.ts";

export const MCP_MAX_REQUEST_BYTES = 1_000_000;
export const MCP_MAX_OUTPUT_BYTES = 2_000_000;
export const MCP_PROTOCOL_VERSION = "2025-11-25";
export type McpErrorCode = "INVALID_INPUT" | "UNSUPPORTED_OPERATION" | "RESOURCE_LIMIT_EXCEEDED" | "PROCESSING_FAILED" | "AUTHENTICATION_REQUIRED";
export class McpRuntimeError extends Error {
  readonly code: McpErrorCode;
  constructor(code: McpErrorCode, message: string) { super(message); this.code = code; this.name = "McpRuntimeError"; }
}
type JsonObject = Record<string, unknown>;
const isObject = (v: unknown): v is JsonObject => !!v && typeof v === "object" && !Array.isArray(v);
const stringField = (input: JsonObject, key: string, max = 200_000): string => {
  const value = input[key];
  if (typeof value !== "string") throw new McpRuntimeError("INVALID_INPUT", `'${key}' must be a string.`);
  if (value.length > max) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", `'${key}' exceeds the supported input limit.`);
  return value;
};
const assertAllowedKeys = (input: JsonObject, allowed: readonly string[]): void => {
  for (const key of Object.keys(input)) {
    if (!allowed.includes(key)) throw new McpRuntimeError("INVALID_INPUT", `Unknown argument '${key}'.`);
  }
};
const enumField = <T extends string>(input: JsonObject, key: string, allowed: readonly T[], fallback?: T): T => {
  const value = input[key];
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new McpRuntimeError("INVALID_INPUT", `'${key}' must be one of the supported values.`);
  }
  return value as T;
};
const schemas = {
  "encoding.transform": { type: "object", properties: { mode: { type: "string", enum: ["url","base64","base64url","base32","hex","binary","html-entities","unicode-escapes","quoted-printable","base58","base85","z85"] }, direction: { type: "string", enum: ["encode","decode"] }, input: { type: "string", maxLength: 1000000 } }, required: ["mode","direction","input"], additionalProperties: false },
  "text.transform": { type: "object", properties: { operation: { type: "string", enum: ["trim","sort-dedupe","case","normalize","escape","statistics","diff","find-replace","split-join"] }, input: { type: "string", maxLength: 200000 }, options: { type: "object" } }, required: ["operation","input"], additionalProperties: false },
  "json.validate": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.format": { type: "object", properties: { input: { type: "string", maxLength: 200000 }, indent: { type: "integer", minimum: 0, maximum: 8 } }, required: ["input"], additionalProperties: false },
  "json.minify": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.diff": { type: "object", properties: { before: { type: "string", maxLength: 200000 }, after: { type: "string", maxLength: 200000 } }, required: ["before","after"], additionalProperties: false },
  "developer.format": { type: "object", properties: { operation: { type: "string", enum: ["xml","sql","html","csv-json","curl"] }, input: { type: "string", maxLength: 200000 }, mode: { type: "string", enum: ["format","minify","json-to-csv"] }, delimiter: { type: "string", maxLength: 1 } }, required: ["operation","input"], additionalProperties: false }
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

const outputSchemas = {
  "encoding.transform": { type: "string" },
  "text.transform": { type: "string" },
  "json.validate": { type: "object", properties: { valid: { type: "boolean" }, diagnostics: { type: "array" } }, required: ["valid"], additionalProperties: false },
  "json.format": { type: "string" },
  "json.minify": { type: "string" },
  "json.diff": { type: "array", items: { type: "object", properties: { path: { type: "string" }, kind: { type: "string", enum: ["added","removed","changed"] } }, required: ["path","kind"] } },
  "developer.format": { type: "string" }
} as const;

export function listCapabilities() {
  return capabilityList.map(capability => ({
    ...capability,
    inputSchema: schemas[capability.id],
    outputSchema: outputSchemas[capability.id]
  }));
}
export async function executeOperation(operationId: string, rawInput: unknown): Promise<unknown> {
  if (!isObject(rawInput)) throw new McpRuntimeError("INVALID_INPUT", "Operation arguments must be a JSON object.");
  const allowedKeys: Record<string, readonly string[]> = {
    "encoding.transform": ["mode", "direction", "input"],
    "text.transform": ["operation", "input", "options"],
    "json.validate": ["input"],
    "json.format": ["input", "indent"],
    "json.minify": ["input"],
    "json.diff": ["before", "after"],
    "developer.format": ["operation", "input", "mode", "delimiter"]
  };
  const allowed = allowedKeys[operationId];
  if (!allowed) throw new McpRuntimeError("UNSUPPORTED_OPERATION", "This operation is not enabled for MCP execution.");
  assertAllowedKeys(rawInput, allowed);
  let result: unknown;
  try {
    switch (operationId) {
      case "encoding.transform": {
        const mode = enumField(rawInput, "mode", ["url","base64","base64url","base32","hex","binary","html-entities","unicode-escapes","quoted-printable","base58","base85","z85"] as const) as EncodingMode;
        const direction = enumField(rawInput, "direction", ["encode","decode"] as const) as EncodingDirection;
        const input = stringField(rawInput, "input", 1_000_000);
        result = transformEncoding(mode, direction, input);
        break;
      }
      case "text.transform": {
        const operation = enumField(rawInput, "operation", ["trim","sort-dedupe","case","normalize","escape","statistics","diff","find-replace","split-join"] as const) as TextOperation;
        const input = stringField(rawInput, "input");
        if (rawInput.options !== undefined && !isObject(rawInput.options)) throw new McpRuntimeError("INVALID_INPUT", "'options' must be an object.");
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
        let indent = 0;
        if (operationId === "json.format") {
          indent = rawInput.indent === undefined ? 2 : rawInput.indent as number;
          if (!Number.isInteger(indent) || indent < 0 || indent > 8) throw new McpRuntimeError("INVALID_INPUT", "'indent' must be an integer from 0 to 8.");
        }
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
        const operation = enumField(rawInput, "operation", ["xml","sql","html","csv-json","curl"] as const) as DeveloperOperation;
        const input = stringField(rawInput, "input");
        const mode = enumField(rawInput, "mode", ["format","minify","json-to-csv"] as const, "format");
        const delimiter = rawInput.delimiter === undefined ? "," : stringField(rawInput, "delimiter", 1);
        if (delimiter.length !== 1) throw new McpRuntimeError("INVALID_INPUT", "'delimiter' must be exactly one character.");
        result = transformDeveloperTool(operation, input, { mode, delimiter });
        break;
      }
      default: throw new McpRuntimeError("UNSUPPORTED_OPERATION", "This operation is not enabled for MCP execution.");
    }
  } catch (error) {
    if (error instanceof McpRuntimeError) throw error;
    // Domain/library exceptions can contain input fragments, internal paths or implementation details.
    // Keep the public error stable and deliberately non-diagnostic.
    throw new McpRuntimeError("PROCESSING_FAILED", "The operation failed. Check the input and supported options.");
  }
  const bytes = new TextEncoder().encode(JSON.stringify(result)).byteLength;
  if (bytes > MCP_MAX_OUTPUT_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Operation result exceeds the supported output limit.");
  return result;
}

const mcpHandler = createMcpHandler(() => {
  const server = new McpServer({ name: "GaGet.dev MCP", version: "1.0.0" });
  server.registerTool(
    "list_capabilities",
    {
      title: "List GaGet capabilities",
      description: "List the approved server-executable operations, schemas, and resource limits.",
      inputSchema: z.object({}),
      outputSchema: z.object({ capabilities: z.array(z.unknown()) })
    },
    async () => {
      const capabilities = listCapabilities();
      return {
        content: [{ type: "text", text: JSON.stringify(capabilities) }],
        structuredContent: { capabilities }
      };
    }
  );
  server.registerTool(
    "execute_operation",
    {
      title: "Execute a GaGet operation",
      description: "Execute one approved, bounded operation. It never executes code, runs shell commands, or makes network requests.",
      inputSchema: z.object({
        operationId: z.enum(["encoding.transform", "text.transform", "json.validate", "json.format", "json.minify", "json.diff", "developer.format"]),
        arguments: z.record(z.string(), z.unknown())
      }),
      outputSchema: z.object({
        success: z.boolean(),
        operationId: z.string(),
        result: z.unknown().optional(),
        error: z.object({ code: z.string(), message: z.string() }).optional()
      })
    },
    async ({ operationId, arguments: operationArguments }) => {
      try {
        const result = await executeOperation(operationId, operationArguments);
        return {
          content: [{ type: "text", text: JSON.stringify(result) }],
          structuredContent: { success: true, operationId, result }
        };
      } catch (error) {
        const runtimeError = error instanceof McpRuntimeError
          ? error
          : new McpRuntimeError("PROCESSING_FAILED", "The operation failed. Check the input and supported options.");
        return {
          content: [{ type: "text", text: runtimeError.message }],
          structuredContent: { success: false, operationId, error: { code: runtimeError.code, message: runtimeError.message } },
          isError: true
        };
      }
    }
  );
  return server;
}, { responseMode: "json" });

export async function handleMcpPost(request: Request, configuredToken: string | undefined): Promise<Response> {
  if (!configuredToken) return Response.json({ error: "MCP endpoint is not configured. Set MCP_AUTH_TOKEN before enabling remote access." }, { status: 503 });
  const authorization = request.headers.get("authorization") ?? "";
  if (authorization !== `Bearer ${configuredToken}`) return Response.json({ error: "Authentication required." }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader && /^\\d+$/.test(lengthHeader) && Number(lengthHeader) > MCP_MAX_REQUEST_BYTES) {
    return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
  }
  let raw: string;
  try {
    const reader = request.body?.getReader();
    if (!reader) raw = "";
    else {
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > MCP_MAX_REQUEST_BYTES) {
          await reader.cancel().catch(() => undefined);
          return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      raw = new TextDecoder().decode(bytes);
    }
  } catch {
    return Response.json({ error: "Unable to read request body." }, { status: 400 });
  }
  if (new TextEncoder().encode(raw).byteLength > MCP_MAX_REQUEST_BYTES) {
    return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
  }
  return mcpHandler.fetch(new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: raw
  }));
}
