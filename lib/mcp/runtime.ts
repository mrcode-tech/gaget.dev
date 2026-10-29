import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { timingSafeEqual } from "node:crypto";
import sharp from "sharp";
import * as z from "zod/v4";
import { transformEncoding, convertCharset, type EncodingMode, type EncodingDirection, type SupportedCharset } from "../tools/encoding-operations.ts";
import { transformText, type TextOperation } from "../tools/text-operations.ts";
import { diagnoseJson, compareJsonDocuments, sortJsonKeys, escapeJsonStringContents, unescapeJsonStringContents } from "../tools/json-workspace.ts";
import { transformDeveloperTool, type DeveloperOperation } from "../tools/developer-operations.ts";
import { computeHash, type HashMode, type DigestAlgorithm } from "../tools/security-operations.ts";
import { generateSampleData, type SampleGeneratorOperation } from "../tools/sample-data-generator.ts";
import { runExtendedOperation, type ExtendedOperation, type ExtendedOptions } from "../tools/extended-operations.ts";

export const MCP_MAX_REQUEST_BYTES = 1_000_000;
export const MCP_MAX_OUTPUT_BYTES = 2_000_000;
export const MCP_MAX_IMAGE_INPUT_BYTES = 600_000;
export const MCP_MAX_IMAGE_OUTPUT_BYTES = 600_000;
export const MCP_MAX_IMAGE_PIXELS = 16_000_000;
export const MCP_MAX_CONCURRENT_REQUESTS = 8;
export const MCP_MAX_REQUESTS_PER_MINUTE = 120;
export const MCP_BODY_READ_TIMEOUT_MS = 5_000;
export const MCP_PROTOCOL_VERSION = "2025-11-25";
export type McpErrorCode = "INVALID_INPUT" | "UNSUPPORTED_OPERATION" | "UNSUPPORTED_EXECUTION_MODE" | "UNSUPPORTED_FORMAT" | "RESOURCE_LIMIT_EXCEEDED" | "TIMEOUT" | "CANCELLED" | "PROCESSING_FAILED" | "DEPENDENCY_UNAVAILABLE" | "AUTHENTICATION_REQUIRED" | "PERMISSION_DENIED";
export class McpRuntimeError extends Error {
  readonly code: McpErrorCode;
  constructor(code: McpErrorCode, message: string) { super(message); this.code = code; this.name = "McpRuntimeError"; }
}
type JsonObject = Record<string, unknown>;
const isObject = (v: unknown): v is JsonObject => !!v && typeof v === "object" && !Array.isArray(v);
function decodeBoundedImageBase64(value: string): Buffer {
  if (value.length === 0 || value.length > 800_000 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new McpRuntimeError("INVALID_INPUT", "'inputBase64' must be valid bounded standard base64.");
  }
  const bytes = Buffer.from(value, "base64");
  if (bytes.byteLength === 0 || bytes.byteLength > MCP_MAX_IMAGE_INPUT_BYTES || bytes.toString("base64") !== value) {
    throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Image input must be at most 600,000 bytes.");
  }
  return bytes;
}
function inspectPcmWav(bytes: Buffer): Record<string, unknown> {
  if (bytes.byteLength < 44 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WAVE") {
    throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Only RIFF/WAVE audio files are supported by audio.inspect.");
  }
  const riffEnd = bytes.readUInt32LE(4) + 8;
  if (riffEnd !== bytes.byteLength) throw new McpRuntimeError("INVALID_INPUT", "WAV container length does not match the supplied bytes.");
  let offset = 12;
  let formatCode: number | undefined;
  let channels: number | undefined;
  let sampleRate: number | undefined;
  let byteRate: number | undefined;
  let blockAlign: number | undefined;
  let bitDepth: number | undefined;
  let dataBytes: number | undefined;
  const chunkIds: string[] = [];
  while (offset + 8 <= riffEnd) {
    const id = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    const end = start + size;
    if (end > riffEnd || end < start) throw new McpRuntimeError("INVALID_INPUT", "WAV chunk length exceeds the container boundary.");
    chunkIds.push(id);
    if (id === "fmt ") {
      if (size < 16) throw new McpRuntimeError("INVALID_INPUT", "WAV format chunk is incomplete.");
      formatCode = bytes.readUInt16LE(start);
      channels = bytes.readUInt16LE(start + 2);
      sampleRate = bytes.readUInt32LE(start + 4);
      byteRate = bytes.readUInt32LE(start + 8);
      blockAlign = bytes.readUInt16LE(start + 12);
      bitDepth = bytes.readUInt16LE(start + 14);
    } else if (id === "data" && dataBytes === undefined) {
      dataBytes = size;
    }
    offset = end + (size % 2);
  }
  if (offset !== riffEnd || formatCode === undefined || channels === undefined || sampleRate === undefined || byteRate === undefined || blockAlign === undefined || bitDepth === undefined || dataBytes === undefined) {
    throw new McpRuntimeError("INVALID_INPUT", "WAV is missing a required format or audio-data chunk.");
  }
  if (formatCode !== 1 && formatCode !== 3) throw new McpRuntimeError("UNSUPPORTED_FORMAT", "WAV encoding must be uncompressed PCM or IEEE floating-point audio.");
  const supportedDepth = formatCode === 1 ? [8,16,24,32].includes(bitDepth) : [32,64].includes(bitDepth);
  if (channels < 1 || channels > 8 || sampleRate < 8000 || sampleRate > 192000 || !supportedDepth || blockAlign !== channels * bitDepth / 8 || byteRate !== sampleRate * blockAlign || dataBytes % blockAlign !== 0) {
    throw new McpRuntimeError("UNSUPPORTED_FORMAT", "WAV channel count, sample rate, bit depth, or frame alignment is outside supported limits.");
  }
  const frames = dataBytes / blockAlign;
  return {
    format: "wav",
    encoding: formatCode === 1 ? "pcm" : "ieee-float",
    bytes: bytes.byteLength,
    durationSeconds: Number((frames / sampleRate).toFixed(6)),
    sampleRate,
    channels,
    bitDepth,
    frames,
    dataBytes,
    hasMetadataChunks: chunkIds.some(id => !["fmt ", "data"].includes(id)),
    chunkIds
  };
}
function analyzePcmWav(bytes: Buffer): Record<string, unknown> {
  const metadata = inspectPcmWav(bytes);
  let offset = 12, formatCode = 0, channels = 0, bitDepth = 0, dataOffset = -1, dataBytes = 0;
  while (offset + 8 <= bytes.byteLength) {
    const id = bytes.toString("ascii", offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8, end = start + size;
    if (end > bytes.byteLength || end < start) throw new McpRuntimeError("INVALID_INPUT", "WAV chunk length exceeds the container boundary.");
    if (id === "fmt ") { formatCode = bytes.readUInt16LE(start); channels = bytes.readUInt16LE(start + 2); bitDepth = bytes.readUInt16LE(start + 14); }
    else if (id === "data" && dataOffset < 0) { dataOffset = start; dataBytes = size; }
    offset = end + (size % 2);
  }
  if (dataOffset < 0 || channels < 1 || dataBytes === 0) throw new McpRuntimeError("INVALID_INPUT", "WAV audio data is empty or incomplete.");
  const bytesPerSample = bitDepth / 8, sampleCount = dataBytes / bytesPerSample;
  const sums = Array<number>(channels).fill(0), squares = Array<number>(channels).fill(0), peaks = Array<number>(channels).fill(0), clipped = Array<number>(channels).fill(0);
  for (let i = 0; i < sampleCount; i++) {
    const position = dataOffset + i * bytesPerSample;
    let sample: number;
    if (formatCode === 3 && bitDepth === 32) sample = bytes.readFloatLE(position);
    else if (formatCode === 3 && bitDepth === 64) sample = bytes.readDoubleLE(position);
    else if (bitDepth === 8) sample = (bytes.readUInt8(position) - 128) / 128;
    else if (bitDepth === 16) sample = bytes.readInt16LE(position) / 32768;
    else if (bitDepth === 24) { let integer = bytes.readUIntLE(position, 3); if (integer & 0x800000) integer -= 0x1000000; sample = integer / 8388608; }
    else if (bitDepth === 32) sample = bytes.readInt32LE(position) / 2147483648;
    else throw new McpRuntimeError("UNSUPPORTED_FORMAT", "This WAV sample format is not supported for analysis.");
    if (!Number.isFinite(sample)) throw new McpRuntimeError("INVALID_INPUT", "WAV audio contains non-finite floating-point samples.");
    const channel = i % channels, magnitude = Math.abs(sample);
    sums[channel] += sample; squares[channel] += sample * sample; peaks[channel] = Math.max(peaks[channel], magnitude);
    if (magnitude >= 1) clipped[channel]++;
  }
  const framesPerChannel = sampleCount / channels;
  const channelsSummary = peaks.map((peak, channel) => ({ channel: channel + 1, peak: Number(peak.toFixed(8)), peakDbfs: peak === 0 ? null : Number((20 * Math.log10(peak)).toFixed(6)), rms: Number(Math.sqrt(squares[channel] / framesPerChannel).toFixed(8)), dcOffset: Number((sums[channel] / framesPerChannel).toFixed(8)), clippedSamples: clipped[channel] }));
  const peak = Math.max(...peaks), totalSquares = squares.reduce((sum, value) => sum + value, 0), totalSum = sums.reduce((sum, value) => sum + value, 0);
  return { format: metadata.format, sampleRate: metadata.sampleRate, channels, bitDepth, durationSeconds: metadata.durationSeconds, sampleCount, peak: Number(peak.toFixed(8)), peakDbfs: peak === 0 ? null : Number((20 * Math.log10(peak)).toFixed(6)), rms: Number(Math.sqrt(totalSquares / sampleCount).toFixed(8)), dcOffset: Number((totalSum / sampleCount).toFixed(8)), clippedSamples: clipped.reduce((sum, value) => sum + value, 0), channelsSummary };
}

function trimPcmWav(bytes: Buffer, startSeconds: number, endSeconds: number): Record<string, unknown> {
  const metadata = inspectPcmWav(bytes);
  const durationSeconds = metadata.durationSeconds as number;
  const sampleRate = metadata.sampleRate as number;
  const frames = metadata.frames as number;
  if (!Number.isFinite(startSeconds) || startSeconds < 0 || startSeconds >= durationSeconds) throw new McpRuntimeError("INVALID_INPUT", "'startSeconds' must be within the audio duration.");
  if (!Number.isFinite(endSeconds) || endSeconds <= startSeconds || endSeconds > durationSeconds) throw new McpRuntimeError("INVALID_INPUT", "'endSeconds' must be greater than startSeconds and no greater than the audio duration.");
  let offset = 12, formatCode = 0, channels = 0, bitDepth = 0, dataOffset = -1, dataBytes = 0;
  while (offset + 8 <= bytes.byteLength) {
    const id = bytes.toString("ascii", offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8, end = start + size;
    if (end > bytes.byteLength || end < start) throw new McpRuntimeError("INVALID_INPUT", "WAV chunk length exceeds the container boundary.");
    if (id === "fmt ") { formatCode = bytes.readUInt16LE(start); channels = bytes.readUInt16LE(start + 2); bitDepth = bytes.readUInt16LE(start + 14); }
    else if (id === "data" && dataOffset < 0) { dataOffset = start; dataBytes = size; }
    offset = end + (size % 2);
  }
  if (dataOffset < 0 || channels < 1 || dataBytes === 0) throw new McpRuntimeError("INVALID_INPUT", "WAV audio data is empty or incomplete.");
  const bytesPerFrame = channels * bitDepth / 8;
  const firstFrame = Math.floor(startSeconds * sampleRate);
  const lastFrame = Math.min(frames, Math.ceil(endSeconds * sampleRate));
  if (lastFrame <= firstFrame) throw new McpRuntimeError("INVALID_INPUT", "The selected trim range is shorter than one audio frame.");
  const frameStart = Math.min(dataBytes, firstFrame * bytesPerFrame);
  const frameEnd = Math.min(dataBytes, lastFrame * bytesPerFrame);
  const audioData = bytes.subarray(dataOffset + frameStart, dataOffset + frameEnd);
  const output = Buffer.alloc(44 + audioData.byteLength);
  output.write("RIFF", 0, "ascii"); output.writeUInt32LE(output.byteLength - 8, 4); output.write("WAVE", 8, "ascii");
  output.write("fmt ", 12, "ascii"); output.writeUInt32LE(16, 16); output.writeUInt16LE(formatCode, 20); output.writeUInt16LE(channels, 22);
  output.writeUInt32LE(sampleRate, 24); output.writeUInt32LE(sampleRate * bytesPerFrame, 28); output.writeUInt16LE(bytesPerFrame, 32); output.writeUInt16LE(bitDepth, 34);
  output.write("data", 36, "ascii"); output.writeUInt32LE(audioData.byteLength, 40); audioData.copy(output, 44);
  if (output.byteLength > MCP_MAX_IMAGE_OUTPUT_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Trimmed audio exceeds the 600,000-byte output limit.");
  return { format: "wav", startSeconds, endSeconds, durationSeconds: (lastFrame - firstFrame) / sampleRate, sampleRate, channels, bitDepth, frames: lastFrame - firstFrame, bytes: output.byteLength, dataBase64: output.toString("base64") };
}

function normalizePcmWav(bytes: Buffer, targetDbfs: number): Record<string, unknown> {
  inspectPcmWav(bytes);
  if (!Number.isFinite(targetDbfs) || targetDbfs < -30 || targetDbfs > 0) throw new McpRuntimeError("INVALID_INPUT", "'targetDbfs' must be between -30 and 0 dBFS.");
  let offset = 12, formatCode = 0, channels = 0, sampleRate = 0, bitDepth = 0, dataOffset = -1, dataBytes = 0;
  while (offset + 8 <= bytes.byteLength) {
    const id = bytes.toString("ascii", offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8, end = start + size;
    if (end > bytes.byteLength || end < start) throw new McpRuntimeError("INVALID_INPUT", "WAV chunk length exceeds the container boundary.");
    if (id === "fmt ") { formatCode = bytes.readUInt16LE(start); channels = bytes.readUInt16LE(start + 2); sampleRate = bytes.readUInt32LE(start + 4); bitDepth = bytes.readUInt16LE(start + 14); }
    else if (id === "data" && dataOffset < 0) { dataOffset = start; dataBytes = size; }
    offset = end + (size % 2);
  }
  if (formatCode !== 1) throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Audio normalization currently supports integer PCM WAV only.");
  if (dataOffset < 0 || channels < 1 || dataBytes === 0) throw new McpRuntimeError("INVALID_INPUT", "WAV audio data is empty or incomplete.");
  const bytesPerSample = bitDepth / 8, sampleCount = dataBytes / bytesPerSample;
  const readSample = (sourceBytes: Buffer, position: number): number => {
    if (bitDepth === 8) return (sourceBytes.readUInt8(position) - 128) / 128;
    if (bitDepth === 16) return sourceBytes.readInt16LE(position) / 32768;
    if (bitDepth === 24) { let integer = sourceBytes.readUIntLE(position, 3); if (integer & 0x800000) integer -= 0x1000000; return integer / 8388608; }
    if (bitDepth === 32) return sourceBytes.readInt32LE(position) / 2147483648;
    throw new McpRuntimeError("UNSUPPORTED_FORMAT", "This PCM bit depth is not supported for normalization.");
  };
  const source = Array<number>(sampleCount);
  let peakBefore = 0;
  for (let i = 0; i < sampleCount; i++) { const value = readSample(bytes, dataOffset + i * bytesPerSample); source[i] = value; peakBefore = Math.max(peakBefore, Math.abs(value)); }
  const targetPeak = Math.pow(10, targetDbfs / 20);
  const gain = peakBefore === 0 ? 1 : targetPeak / peakBefore;
  const output = Buffer.from(bytes);
  let peakAfter = 0, fullScaleSamples = 0;
  for (let i = 0; i < sampleCount; i++) {
    const position = dataOffset + i * bytesPerSample;
    const scaled = Math.max(-1, Math.min(1, source[i] * gain));
    if (bitDepth === 8) output.writeUInt8(Math.max(0, Math.min(255, Math.round(scaled * 128 + 128))), position);
    else if (bitDepth === 16) output.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(scaled * 32768))), position);
    else if (bitDepth === 24) output.writeIntLE(Math.max(-8388608, Math.min(8388607, Math.round(scaled * 8388608))), position, 3);
    else if (bitDepth === 32) output.writeInt32LE(Math.max(-2147483648, Math.min(2147483647, Math.round(scaled * 2147483648))), position);
    const actual = readSample(output, position);
    peakAfter = Math.max(peakAfter, Math.abs(actual));
    if (Math.abs(actual) >= 1) fullScaleSamples++;
  }
  return { format: "wav", sampleRate, channels, bitDepth, targetDbfs, peakBefore: Number(peakBefore.toFixed(8)), peakAfter: Number(peakAfter.toFixed(8)), gainDb: peakBefore === 0 ? 0 : Number((20 * Math.log10(gain)).toFixed(6)), fullScaleSamples, bytes: output.byteLength, dataBase64: output.toString("base64") };
}


type IsoBmffBox = { type: string; start: number; payloadStart: number; end: number; children: IsoBmffBox[] };
function inspectIsoBmff(bytes: Buffer): Record<string, unknown> {
  let parsedBoxCount = 0;
  const containerTypes = new Set(["moov","trak","mdia","minf","stbl","edts","dinf","udta","mvex","moof","traf"]);
  const parseBoxes = (start: number, end: number, depth: number): IsoBmffBox[] => {
    if (depth > 8) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Video container nesting exceeds 8 levels.");
    const boxes: IsoBmffBox[] = [];
    let offset = start;
    while (offset < end) {
      if (end - offset < 8) throw new McpRuntimeError("INVALID_INPUT", "ISO BMFF box header is truncated.");
      const size32 = bytes.readUInt32BE(offset), type = bytes.toString("ascii", offset + 4, offset + 8);
      let headerBytes = 8, size: number;
      if (size32 === 1) {
        if (end - offset < 16) throw new McpRuntimeError("INVALID_INPUT", "Extended ISO BMFF box header is truncated.");
        const extended = bytes.readBigUInt64BE(offset + 8);
        if (extended > BigInt(Number.MAX_SAFE_INTEGER)) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "ISO BMFF box size exceeds the safe integer range.");
        size = Number(extended); headerBytes = 16;
      } else size = size32 === 0 ? end - offset : size32;
      if (size < headerBytes || size > end - offset) throw new McpRuntimeError("INVALID_INPUT", "ISO BMFF box size exceeds its parent container.");
      const payloadStart = offset + headerBytes, boxEnd = offset + size;
      if (++parsedBoxCount > 10_000) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Video container contains too many boxes.");
      const childStart = payloadStart + (type === "meta" ? 4 : 0);
      const children = containerTypes.has(type) || type === "meta" ? parseBoxes(childStart, boxEnd, depth + 1) : [];
      boxes.push({ type, start: offset, payloadStart, end: boxEnd, children });
      offset = boxEnd;
    }
    return boxes;
  };
  const top = parseBoxes(0, bytes.byteLength, 0), ftyp = top.find(box => box.type === "ftyp"), moov = top.find(box => box.type === "moov");
  if (!ftyp || !moov || ftyp.end - ftyp.payloadStart < 8) throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Only ISO Base Media File Format containers with ftyp and moov boxes are supported.");
  const majorBrand = bytes.toString("ascii", ftyp.payloadStart, ftyp.payloadStart + 4), compatibleBrands: string[] = [];
  for (let p = ftyp.payloadStart + 8; p + 4 <= ftyp.end; p += 4) compatibleBrands.push(bytes.toString("ascii", p, p + 4));
  const findChild = (box: IsoBmffBox, type: string): IsoBmffBox | undefined => box.children.find(child => child.type === type);
  const descendants = (box: IsoBmffBox, type: string): IsoBmffBox[] => box.children.flatMap(child => (child.type === type ? [child] : []).concat(descendants(child, type)));
  const readDuration = (box: IsoBmffBox | undefined): number | null => {
    if (!box || box.end - box.payloadStart < 20) return null;
    const version = bytes[box.payloadStart], timescaleOffset = version === 1 ? 20 : 12, durationOffset = version === 1 ? 24 : 16, durationBytes = version === 1 ? 8 : 4;
    if (version !== 0 && version !== 1 || box.end - box.payloadStart < durationOffset + durationBytes) return null;
    const timescale = bytes.readUInt32BE(box.payloadStart + timescaleOffset);
    const duration = durationBytes === 8 ? bytes.readBigUInt64BE(box.payloadStart + durationOffset) : BigInt(bytes.readUInt32BE(box.payloadStart + durationOffset));
    if (!timescale || duration === 0xffffffffffffffffn || duration === 0xffffffffn) return null;
    const seconds = Number(duration) / timescale;
    return Number.isFinite(seconds) ? Number(seconds.toFixed(6)) : null;
  };
  const movieDurationSeconds = readDuration(findChild(moov, "mvhd"));
  const tracks = descendants(moov, "trak").map((track, index) => {
    const tkhd = findChild(track, "tkhd"), mdia = findChild(track, "mdia"), hdlr = mdia ? findChild(mdia, "hdlr") : undefined, mdhd = mdia ? findChild(mdia, "mdhd") : undefined;
    let handler = "unknown";
    if (hdlr && hdlr.end - hdlr.payloadStart >= 12) handler = bytes.toString("ascii", hdlr.payloadStart + 8, hdlr.payloadStart + 12);
    const version = tkhd ? bytes[tkhd.payloadStart] : 0, idOffset = version === 1 ? 20 : 12, dimensionOffset = version === 1 ? 84 : 72;
    const trackId = tkhd && tkhd.end - tkhd.payloadStart >= idOffset + 4 ? bytes.readUInt32BE(tkhd.payloadStart + idOffset) : index + 1;
    const dimensionsPresent = tkhd && handler === "vide" && tkhd.end - tkhd.payloadStart >= dimensionOffset + 8;
    const widthRaw = dimensionsPresent ? bytes.readUInt32BE(tkhd!.payloadStart + dimensionOffset) : 0, heightRaw = dimensionsPresent ? bytes.readUInt32BE(tkhd!.payloadStart + dimensionOffset + 4) : 0;
    const stsd = mdia ? descendants(mdia, "stsd")[0] : undefined;
    let codec: string | null = null;
    if (stsd && stsd.end - stsd.payloadStart >= 16) { const entry = stsd.payloadStart + 8, entrySize = bytes.readUInt32BE(entry); if (entrySize >= 8 && entry + entrySize <= stsd.end) codec = bytes.toString("ascii", entry + 4, entry + 8); }
    return { trackId, kind: handler === "vide" ? "video" : handler === "soun" ? "audio" : "other", handler, codec, width: widthRaw ? Math.round(widthRaw / 65536) : null, height: heightRaw ? Math.round(heightRaw / 65536) : null, durationSeconds: readDuration(mdhd) };
  });
  if (!tracks.length) throw new McpRuntimeError("UNSUPPORTED_FORMAT", "The ISO BMFF file contains no inspectable tracks.");
  return { format: "iso-bmff", majorBrand, compatibleBrands, bytes: bytes.byteLength, durationSeconds: movieDurationSeconds, trackCount: tracks.length, tracks };
}

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
  "encoding.charset": { type: "object", properties: { direction: { type: "string", enum: ["encode","decode"] }, charset: { type: "string", enum: ["utf-8","utf-16le","utf-16be","windows-1252"] }, input: { type: "string", maxLength: 1000000 } }, required: ["direction","charset","input"], additionalProperties: false },
  "text.transform": { type: "object", properties: { operation: { type: "string", enum: ["trim","sort-dedupe","case","normalize","escape","statistics","diff","find-replace","split-join"] }, input: { type: "string", maxLength: 200000 }, options: { type: "object", properties: { pattern: { type: "string", maxLength: 200000 }, replacement: { type: "string", maxLength: 200000 }, delimiter: { type: "string", maxLength: 1000 }, caseMode: { type: "string", enum: ["upper","lower","title"] }, normalizeForm: { type: "string", enum: ["NFC","NFD","NFKC","NFKD"] }, trimMode: { type: "string", enum: ["both","start","end"] }, escapeMode: { type: "string", enum: ["html","json"] }, secondInput: { type: "string", maxLength: 200000 } }, additionalProperties: false } }, required: ["operation","input"], additionalProperties: false },
  "json.validate": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.format": { type: "object", properties: { input: { type: "string", maxLength: 200000 }, indent: { type: "integer", minimum: 0, maximum: 8 } }, required: ["input"], additionalProperties: false },
  "json.minify": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.diff": { type: "object", properties: { before: { type: "string", maxLength: 200000 }, after: { type: "string", maxLength: 200000 } }, required: ["before","after"], additionalProperties: false },
  "json.sort-keys": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.escape": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.unescape": { type: "object", properties: { input: { type: "string", maxLength: 200000 } }, required: ["input"], additionalProperties: false },
  "json.find": { type: "object", properties: { input: { type: "string", maxLength: 200000 }, query: { type: "string", maxLength: 1000 }, match: { type: "string", enum: ["keys","values","both"] } }, required: ["input","query"], additionalProperties: false },
  "image.print-size": { type: "object", properties: { width: { type: "number", exclusiveMinimum: 0, maximum: 100000 }, height: { type: "number", exclusiveMinimum: 0, maximum: 100000 }, dpi: { type: "number", minimum: 1, maximum: 9600 }, unit: { type: "string", enum: ["in","cm","mm"] } }, required: ["width","height","dpi"], additionalProperties: false },
  "audio.inspect": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 } }, required: ["inputBase64"], additionalProperties: false },
  "audio.analyze": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 } }, required: ["inputBase64"], additionalProperties: false },
  "audio.trim": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 }, startSeconds: { type: "number", minimum: 0 }, endSeconds: { type: "number", exclusiveMinimum: 0 } }, required: ["inputBase64","startSeconds","endSeconds"], additionalProperties: false },
  "audio.normalize": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 }, targetDbfs: { type: "number", minimum: -30, maximum: 0 } }, required: ["inputBase64"], additionalProperties: false },
  "video.inspect": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 } }, required: ["inputBase64"], additionalProperties: false },
  "image.inspect": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 } }, required: ["inputBase64"], additionalProperties: false },
  "image.sample-pixel": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 }, x: { type: "integer", minimum: 0, maximum: 16000000 }, y: { type: "integer", minimum: 0, maximum: 16000000 } }, required: ["inputBase64","x","y"], additionalProperties: false },
  "image.transform": { type: "object", properties: { inputBase64: { type: "string", maxLength: 800000 }, action: { type: "string", enum: ["crop","resize","rotate","flip","flop","convert","auto-orient","grayscale","blur","adjust","text-overlay"] }, left: { type: "integer", minimum: 0, maximum: 16000000 }, top: { type: "integer", minimum: 0, maximum: 16000000 }, width: { type: "integer", minimum: 1, maximum: 4096 }, height: { type: "integer", minimum: 1, maximum: 4096 }, leftRatio: { type: "number", minimum: 0, maximum: 1 }, topRatio: { type: "number", minimum: 0, maximum: 1 }, widthRatio: { type: "number", exclusiveMinimum: 0, maximum: 1 }, heightRatio: { type: "number", exclusiveMinimum: 0, maximum: 1 }, degrees: { type: "number", minimum: -180, maximum: 180 }, background: { type: "string", pattern: "^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$" }, format: { type: "string", enum: ["jpeg","png","webp","avif"] }, quality: { type: "integer", minimum: 1, maximum: 100 }, brightness: { type: "number", minimum: 0.1, maximum: 2 }, contrast: { type: "number", minimum: 0, maximum: 3 }, saturation: { type: "number", minimum: 0, maximum: 3 }, sigma: { type: "number", minimum: 0.3, maximum: 100 }, fit: { type: "string", enum: ["contain","cover","fill","inside","outside"] }, position: { type: "string", enum: ["centre","north","northeast","east","southeast","south","southwest","west","northwest"] }, text: { type: "string", maxLength: 500 }, x: { type: "integer", minimum: 0, maximum: 4096 }, y: { type: "integer", minimum: 0, maximum: 4096 }, fontSize: { type: "integer", minimum: 1, maximum: 256 }, color: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" } }, required: ["inputBase64","action"], additionalProperties: false },
  "developer.format": { type: "object", properties: { operation: { type: "string", enum: ["xml","sql","html","csv-json","curl"] }, input: { type: "string", maxLength: 200000 }, mode: { type: "string", enum: ["format","minify","json-to-csv"] }, delimiter: { type: "string", maxLength: 1 } }, required: ["operation","input"], additionalProperties: false },
  "security.hash": { type: "object", properties: { input: { type: "string", maxLength: 200000 }, mode: { type: "string", enum: ["digest","hmac","crc32","crc16-ccitt","adler32"] }, algorithm: { type: "string", enum: ["SHA-256","SHA-384","SHA-512"] }, key: { type: "string", maxLength: 10000 } }, required: ["input","mode"], additionalProperties: false },
  "security.jwt.decode": { type: "object", properties: { token: { type: "string", maxLength: 20000 } }, required: ["token"], additionalProperties: false },
  "generator.sample": { type: "object", properties: { operation: { type: "string", enum: ["random-string","random-integer","timestamp","sample-json","uuid"] }, length: { type: "integer", minimum: 1, maximum: 4096 }, count: { type: "integer", minimum: 1, maximum: 100 }, min: { type: "integer" }, max: { type: "integer" } }, required: ["operation"], additionalProperties: false },
  "data.inspect": { type: "object", properties: { operation: { type: "string", enum: ["url-parse","data-uri","query-parse","query-build","key-value","key-value-build","number-base","numeric-view","float-view","hexdump","byte-range","strings","byte-stats","network","cidr","mac","headers","cookies","network-extract","statistics","character-stats","arithmetic","dns-records","http-message","file-signatures","file-metadata","certificate-container","ssh-public-key","compression-detect"] }, input: { type: "string", maxLength: 200000 }, options: { type: "object" } }, required: ["operation","input"], additionalProperties: false },
  "datetime.convert": { type: "object", properties: { mode: { type: "string", enum: ["iso-to-epoch","epoch-to-iso","format"] }, input: { type: "string", maxLength: 128 }, unit: { type: "string", enum: ["seconds","milliseconds"] }, timeZone: { type: "string", maxLength: 100 }, locale: { type: "string", maxLength: 35 } }, required: ["mode","input"], additionalProperties: false },
  "datetime.arithmetic": { type: "object", properties: { input: { type: "string", maxLength: 128 }, amount: { type: "integer", minimum: -1000000, maximum: 1000000 }, unit: { type: "string", enum: ["milliseconds","seconds","minutes","hours","days","weeks"] } }, required: ["input","amount","unit"], additionalProperties: false },
  "datetime.compare": { type: "object", properties: { left: { type: "string", maxLength: 128 }, right: { type: "string", maxLength: 128 } }, required: ["left","right"], additionalProperties: false }
} as const;

const capabilityList = [
  { id: "encoding.transform", version: "1.0.0", description: "Encode or decode bounded text. Does not perform network requests.", limits: { maxInputCharacters: 1000000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "encoding.charset", version: "1.0.0", description: "Convert text to or from hexadecimal bytes using an explicit supported character set. Encoding returns hex; decoding accepts hex. No file or network access.", limits: { maxInputCharacters: 1000000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "text.transform", version: "1.0.0", description: "Run an allowlisted bounded text transformation.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.validate", version: "1.0.0", description: "Validate JSON syntax and return safe diagnostics.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.format", version: "1.0.0", description: "Format valid JSON.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.minify", version: "1.0.0", description: "Minify valid JSON.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.diff", version: "1.0.0", description: "Compare two JSON documents.", limits: { maxInputCharactersPerDocument: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.sort-keys", version: "1.0.0", description: "Sort object keys recursively while preserving JSON values and array order.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.escape", version: "1.0.0", description: "Escape text as JSON string content without surrounding quotes.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.unescape", version: "1.0.0", description: "Decode escaped JSON string content as plain text.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "json.find", version: "1.0.0", description: "Find JSON keys and/or values with bounded depth and result count.", limits: { maxInputCharacters: 200000, maxMatches: 1000, maxDepth: 64, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "audio.inspect", version: "1.0.0", description: "Inspect explicitly supplied WAV audio bytes without storing them. Supports uncompressed PCM and IEEE float WAV metadata only; it does not decode other containers or codecs.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxChannels: 8, minSampleRate: 8000, maxSampleRate: 192000, maxOutputBytes: 4096 } },
  { id: "audio.analyze", version: "1.0.0", description: "Analyze sample peak, RMS level, DC offset, and full-scale clipping in explicitly supplied PCM or IEEE-float WAV data. Supports uncompressed WAV only; no persistence.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxChannels: 8, maxSampleRate: 192000, maxOutputBytes: 8192 } },
  { id: "audio.trim", version: "1.0.0", description: "Trim an explicitly supplied uncompressed PCM or IEEE-float WAV by start/end seconds. The output is a normalized WAV container with audio frames preserved byte-for-byte; no persistence.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxOutputBytes: MCP_MAX_IMAGE_OUTPUT_BYTES, maxChannels: 8, maxSampleRate: 192000 } },
  { id: "audio.normalize", version: "1.0.0", description: "Normalize integer PCM WAV sample peak toward a target dBFS while preserving the original container chunks. Supports 8/16/24/32-bit PCM only; no persistence.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxOutputBytes: MCP_MAX_IMAGE_OUTPUT_BYTES, targetDbfsRangeMagnitude: 30 } },
  { id: "video.inspect", version: "1.0.0", description: "Inspect bounded ISO Base Media File Format containers with ftyp/moov boxes. Reports movie duration, track kinds, codec sample-entry identifiers, and video dimensions without decoding or storing media.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxBoxes: 10000, maxNestingDepth: 8, maxOutputBytes: 8192 } },
  { id: "image.print-size", version: "1.0.0", description: "Calculate physical print dimensions from pixel width/height and DPI. Supports inch, centimeter, and millimeter output; it does not modify image metadata.", limits: { maxPixelDimension: 100000, minDpi: 1, maxDpi: 9600, maxOutputBytes: 1024 } },
  { id: "image.sample-pixel", version: "1.0.0", description: "Sample one pixel from an explicitly supplied bounded, single-frame raster image. Coordinates are zero-based pixels; returns RGB hex and RGBA channels. No persistence.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxPixels: MCP_MAX_IMAGE_PIXELS, maxOutputBytes: 1024, timeoutMs: 5000 } },
  { id: "image.inspect", version: "1.0.0", description: "Inspect dimensions, aspect ratio, pixel count, transparency, orientation, and basic metadata of a bounded supported raster image supplied explicitly as base64. No persistence.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxPixels: MCP_MAX_IMAGE_PIXELS, maxOutputBytes: MCP_MAX_OUTPUT_BYTES, timeoutMs: 5000 } },
  { id: "image.transform", version: "1.0.0", description: "Crop, resize with explicit fit and anchor options, rotate by arbitrary bounded angles with an optional hex background, flip, flop, auto-orient, grayscale, blur, adjust brightness/contrast/saturation, or convert a bounded supported image supplied explicitly as base64, or add a plain-text overlay using escaped SVG text rendered to raster output. Returns a bounded base64 result; no persistence.", limits: { maxInputBytes: MCP_MAX_IMAGE_INPUT_BYTES, maxOutputBytes: MCP_MAX_IMAGE_OUTPUT_BYTES, maxPixels: MCP_MAX_IMAGE_PIXELS, maxDimension: 4096, timeoutMs: 5000 } },
  { id: "developer.format", version: "1.0.0", description: "Format/minify supported XML, SQL, HTML text, or convert CSV/JSON. Does not execute input.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "security.hash", version: "1.0.0", description: "Compute bounded text digests, HMAC, or non-cryptographic checksums. HMAC keys are secret; hashes are not encryption.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "security.jwt.decode", version: "1.0.0", description: "Decode JWT header and claims without verifying its signature or trust.", limits: { maxInputCharacters: 20000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "generator.sample", version: "1.0.0", description: "Generate bounded synthetic values and UUIDs; timestamp output depends on the server clock.", limits: { maxItems: 100, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "data.inspect", version: "1.0.0", description: "Run allowlisted offline URL, query, key-value, numeric, network-text, HTTP/DNS text, and byte-signature inspections. Never fetches URLs.", limits: { maxInputCharacters: 200000, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "datetime.convert", version: "1.0.0", description: "Convert ISO instants and Unix timestamps or format an instant in an explicit time zone.", limits: { maxInputCharacters: 128, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "datetime.arithmetic", version: "1.0.0", description: "Add or subtract bounded elapsed-time units from an ISO instant with an explicit offset.", limits: { maxInputCharacters: 128, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } },
  { id: "datetime.compare", version: "1.0.0", description: "Compare two ISO instants with explicit offsets.", limits: { maxInputCharactersPerDocument: 128, maxOutputBytes: MCP_MAX_OUTPUT_BYTES } }
] as const;

const outputSchemas = {
  "encoding.transform": { type: "string" },
  "encoding.charset": { type: "string" },
  "text.transform": { type: "string" },
  "json.validate": { type: "object", properties: { valid: { type: "boolean" }, diagnostics: { type: "array" } }, required: ["valid"], additionalProperties: false },
  "json.format": { type: "string" },
  "json.minify": { type: "string" },
  "json.diff": { type: "array", items: { type: "object", properties: { path: { type: "string" }, kind: { type: "string", enum: ["added","removed","changed"] } }, required: ["path","kind"] } },
  "json.sort-keys": { type: "string" },
  "json.escape": { type: "string" },
  "json.unescape": { type: "string" },
  "json.find": { type: "object", properties: { matches: { type: "array", items: { type: "object" } }, truncated: { type: "boolean" } }, required: ["matches","truncated"], additionalProperties: false },
  "image.print-size": { type: "object", properties: { width: { type: "number" }, height: { type: "number" }, dpi: { type: "number" }, unit: { type: "string", enum: ["in","cm","mm"] }, widthInches: { type: "number" }, heightInches: { type: "number" }, widthCm: { type: "number" }, heightCm: { type: "number" }, widthInUnit: { type: "number" }, heightInUnit: { type: "number" } }, required: ["width","height","dpi","unit","widthInches","heightInches","widthCm","heightCm","widthInUnit","heightInUnit"], additionalProperties: false },
  "image.sample-pixel": { type: "object", properties: { x: { type: "integer" }, y: { type: "integer" }, hex: { type: "string", pattern: "^#[0-9A-F]{6}$" }, rgba: { type: "object", properties: { r: { type: "integer" }, g: { type: "integer" }, b: { type: "integer" }, a: { type: "integer" } }, required: ["r","g","b","a"], additionalProperties: false } }, required: ["x","y","hex","rgba"], additionalProperties: false },
  "audio.inspect": { type: "object", properties: { format: { type: "string", const: "wav" }, encoding: { type: "string", enum: ["pcm","ieee-float"] }, bytes: { type: "integer" }, durationSeconds: { type: "number" }, sampleRate: { type: "integer" }, channels: { type: "integer" }, bitDepth: { type: "integer" }, frames: { type: "integer" }, dataBytes: { type: "integer" }, hasMetadataChunks: { type: "boolean" }, chunkIds: { type: "array", items: { type: "string" } } }, required: ["format","encoding","bytes","durationSeconds","sampleRate","channels","bitDepth","frames","dataBytes","hasMetadataChunks","chunkIds"], additionalProperties: false },
  "audio.analyze": { type: "object", properties: { format: { type: "string", const: "wav" }, sampleRate: { type: "integer" }, channels: { type: "integer" }, bitDepth: { type: "integer" }, durationSeconds: { type: "number" }, sampleCount: { type: "integer" }, peak: { type: "number" }, peakDbfs: { type: ["number","null"] }, rms: { type: "number" }, dcOffset: { type: "number" }, clippedSamples: { type: "integer" }, channelsSummary: { type: "array", items: { type: "object", properties: { channel: { type: "integer" }, peak: { type: "number" }, peakDbfs: { type: ["number","null"] }, rms: { type: "number" }, dcOffset: { type: "number" }, clippedSamples: { type: "integer" } }, required: ["channel","peak","peakDbfs","rms","dcOffset","clippedSamples"], additionalProperties: false } } }, required: ["format","sampleRate","channels","bitDepth","durationSeconds","sampleCount","peak","peakDbfs","rms","dcOffset","clippedSamples","channelsSummary"], additionalProperties: false },
  "audio.trim": { type: "object", properties: { format: { type: "string", const: "wav" }, startSeconds: { type: "number" }, endSeconds: { type: "number" }, durationSeconds: { type: "number" }, sampleRate: { type: "integer" }, channels: { type: "integer" }, bitDepth: { type: "integer" }, frames: { type: "integer" }, bytes: { type: "integer" }, dataBase64: { type: "string", maxLength: 800000 } }, required: ["format","startSeconds","endSeconds","durationSeconds","sampleRate","channels","bitDepth","frames","bytes","dataBase64"], additionalProperties: false },
  "audio.normalize": { type: "object", properties: { format: { type: "string", const: "wav" }, sampleRate: { type: "integer" }, channels: { type: "integer" }, bitDepth: { type: "integer" }, targetDbfs: { type: "number" }, peakBefore: { type: "number" }, peakAfter: { type: "number" }, gainDb: { type: "number" }, fullScaleSamples: { type: "integer" }, bytes: { type: "integer" }, dataBase64: { type: "string", maxLength: 800000 } }, required: ["format","sampleRate","channels","bitDepth","targetDbfs","peakBefore","peakAfter","gainDb","fullScaleSamples","bytes","dataBase64"], additionalProperties: false },
  "video.inspect": { type: "object", properties: { format: { type: "string", const: "iso-bmff" }, majorBrand: { type: "string" }, compatibleBrands: { type: "array", items: { type: "string" } }, bytes: { type: "integer" }, durationSeconds: { type: ["number","null"] }, trackCount: { type: "integer" }, tracks: { type: "array", items: { type: "object", properties: { trackId: { type: "integer" }, kind: { type: "string", enum: ["video","audio","other"] }, handler: { type: "string" }, codec: { type: ["string","null"] }, width: { type: ["integer","null"] }, height: { type: ["integer","null"] }, durationSeconds: { type: ["number","null"] } }, required: ["trackId","kind","handler","codec","width","height","durationSeconds"], additionalProperties: false } } }, required: ["format","majorBrand","compatibleBrands","bytes","durationSeconds","trackCount","tracks"], additionalProperties: false },
  "image.inspect": { type: "object", properties: { format: { type: "string" }, width: { type: "integer" }, height: { type: "integer" }, aspectRatio: { type: "number" }, pixelCount: { type: "integer" }, channels: { type: "integer" }, hasAlpha: { type: "boolean" }, orientation: { type: ["integer","null"] }, bytes: { type: "integer" }, animated: { type: "boolean" }, dominantColor: { type: "string", pattern: "^#[0-9A-F]{6}$" } }, required: ["format","width","height","aspectRatio","pixelCount","channels","hasAlpha","orientation","bytes","animated","dominantColor"], additionalProperties: false },
  "image.transform": { type: "object", properties: { format: { type: "string" }, width: { type: "integer" }, height: { type: "integer" }, bytes: { type: "integer" }, dataBase64: { type: "string", maxLength: 800000 } }, required: ["format","width","height","bytes","dataBase64"], additionalProperties: false },
  "developer.format": { type: "string" },
  "security.hash": { type: "string" },
  "security.jwt.decode": { type: "object", properties: { header: { type: "object" }, claims: { type: "object" }, signaturePresent: { type: "boolean" }, signatureVerified: { type: "boolean" }, note: { type: "string" } }, required: ["header","claims","signaturePresent","signatureVerified","note"], additionalProperties: false },
  "generator.sample": { type: "string" },
  "data.inspect": { type: "string" },
  "datetime.convert": { type: "object" },
  "datetime.arithmetic": { type: "object" },
  "datetime.compare": { type: "object" }
} as const;


const capabilityRuntimeMetadata = {
  "encoding.transform": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "encoding.charset": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "text.transform": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.validate": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "json"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.format": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.minify": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.diff": {
    "inputTypes": [
      "json",
      "text"
    ],
    "outputTypes": [
      "json"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.sort-keys": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.escape": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.unescape": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "json.find": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "json"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "audio.inspect": {
    "inputTypes": ["audio/wav-base64"],
    "outputTypes": ["json", "audio-metadata"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "audio.analyze": {
    "inputTypes": ["audio/wav-base64"],
    "outputTypes": ["json", "audio-analysis"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "audio.trim": {
    "inputTypes": ["audio/wav-base64", "parameters"],
    "outputTypes": ["audio/wav-base64", "audio-metadata"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "audio.normalize": {
    "inputTypes": ["audio/wav-base64", "parameters"],
    "outputTypes": ["audio/wav-base64", "audio-analysis"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "video.inspect": {
    "inputTypes": ["video/iso-bmff-base64"],
    "outputTypes": ["json", "video-metadata"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "image.print-size": {
    "inputTypes": ["parameters"],
    "outputTypes": ["json", "dimensions"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "image.sample-pixel": {
    "inputTypes": ["image/base64", "parameters"],
    "outputTypes": ["json", "color"],
    "executionModes": ["server", "mcp"],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "image.inspect": {
    "inputTypes": [
      "image/base64"
    ],
    "outputTypes": [
      "json"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "image.transform": {
    "inputTypes": [
      "image/base64"
    ],
    "outputTypes": [
      "image/base64"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "developer.format": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "security.hash": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "security.jwt.decode": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "json"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "generator.sample": {
    "inputTypes": [
      "parameters"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": false
  },
  "data.inspect": {
    "inputTypes": [
      "text"
    ],
    "outputTypes": [
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "datetime.convert": {
    "inputTypes": [
      "date-time"
    ],
    "outputTypes": [
      "date-time",
      "json",
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "datetime.arithmetic": {
    "inputTypes": [
      "date-time"
    ],
    "outputTypes": [
      "date-time",
      "text"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  },
  "datetime.compare": {
    "inputTypes": [
      "date-time"
    ],
    "outputTypes": [
      "json"
    ],
    "executionModes": [
      "server",
      "mcp"
    ],
    "availability": "available",
    "mcpExposure": "exposed",
    "privacy": "no-persistence",
    "deterministic": true
  }
} as const;

export function listCapabilities() {
  return capabilityList.map(capability => ({
    ...capability,
    ...capabilityRuntimeMetadata[capability.id],
    inputSchema: schemas[capability.id],
    outputSchema: outputSchemas[capability.id]
  }));
}
export async function executeOperation(operationId: string, rawInput: unknown): Promise<unknown> {
  if (!isObject(rawInput)) throw new McpRuntimeError("INVALID_INPUT", "Operation arguments must be a JSON object.");
  const allowedKeys: Record<string, readonly string[]> = {
    "encoding.transform": ["mode", "direction", "input"],
    "encoding.charset": ["direction", "charset", "input"],
    "text.transform": ["operation", "input", "options"],
    "json.validate": ["input"],
    "json.format": ["input", "indent"],
    "json.minify": ["input"],
    "json.diff": ["before", "after"],
    "json.sort-keys": ["input"],
    "json.escape": ["input"],
    "json.unescape": ["input"],
    "json.find": ["input","query","match"],
    "audio.inspect": ["inputBase64"],
    "audio.analyze": ["inputBase64"],
    "audio.trim": ["inputBase64","startSeconds","endSeconds"],
    "audio.normalize": ["inputBase64","targetDbfs"],
    "video.inspect": ["inputBase64"],
    "image.print-size": ["width","height","dpi","unit"],
    "image.inspect": ["inputBase64"],
    "image.sample-pixel": ["inputBase64","x","y"],
    "image.transform": ["inputBase64","action","left","top","width","height","leftRatio","topRatio","widthRatio","heightRatio","degrees","background","format","quality","brightness","contrast","saturation","sigma","fit","position","text","x","y","fontSize","color"],
    "developer.format": ["operation", "input", "mode", "delimiter"],
    "security.hash": ["input","mode","algorithm","key"],
    "security.jwt.decode": ["token"],
    "generator.sample": ["operation","length","count","min","max"],
    "data.inspect": ["operation","input","options"],
    "datetime.convert": ["mode","input","unit","timeZone","locale"],
    "datetime.arithmetic": ["input","amount","unit"],
    "datetime.compare": ["left","right"]
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
      case "encoding.charset": {
        const direction = enumField(rawInput, "direction", ["encode", "decode"] as const) as EncodingDirection;
        const charset = enumField(rawInput, "charset", ["utf-8", "utf-16le", "utf-16be", "windows-1252"] as const) as SupportedCharset;
        const input = stringField(rawInput, "input", 1_000_000);
        result = convertCharset(direction, input, charset);
        break;
      }
      case "text.transform": {
        const operation = enumField(rawInput, "operation", ["trim","sort-dedupe","case","normalize","escape","statistics","diff","find-replace","split-join"] as const) as TextOperation;
        const input = stringField(rawInput, "input");
        if (rawInput.options !== undefined && !isObject(rawInput.options)) throw new McpRuntimeError("INVALID_INPUT", "'options' must be an object.");
        const options = isObject(rawInput.options) ? rawInput.options : {};
        assertAllowedKeys(options, ["pattern","replacement","delimiter","caseMode","normalizeForm","trimMode","escapeMode","secondInput"]);
        for (const key of ["pattern","replacement","delimiter","caseMode","normalizeForm","trimMode","escapeMode","secondInput"] as const) {
          if (options[key] !== undefined && typeof options[key] !== "string") throw new McpRuntimeError("INVALID_INPUT", `Option '${key}' must be a string.`);
          if (typeof options[key] === "string" && (options[key] as string).length > 200_000) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", `Option '${key}' exceeds the supported input limit.`);
        }
        if (options.caseMode !== undefined && !["upper","lower","title"].includes(options.caseMode as string)) throw new McpRuntimeError("INVALID_INPUT", "Option 'caseMode' is not supported.");
        if (options.normalizeForm !== undefined && !["NFC","NFD","NFKC","NFKD"].includes(options.normalizeForm as string)) throw new McpRuntimeError("INVALID_INPUT", "Option 'normalizeForm' is not supported.");
        if (options.trimMode !== undefined && !["both","start","end"].includes(options.trimMode as string)) throw new McpRuntimeError("INVALID_INPUT", "Option 'trimMode' is not supported.");
        if (options.escapeMode !== undefined && !["html","json"].includes(options.escapeMode as string)) throw new McpRuntimeError("INVALID_INPUT", "Option 'escapeMode' is not supported.");
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
      case "json.sort-keys": {
        const parsed = diagnoseJson(stringField(rawInput, "input"));
        if (!parsed.ok) throw new McpRuntimeError("INVALID_INPUT", "Input is not valid JSON.");
        result = JSON.stringify(sortJsonKeys(parsed.value), null, 2);
        break;
      }
      case "json.escape": {
        result = escapeJsonStringContents(stringField(rawInput, "input"));
        break;
      }
      case "json.unescape": {
        try { result = unescapeJsonStringContents(stringField(rawInput, "input")); }
        catch { throw new McpRuntimeError("INVALID_INPUT", "Input is not valid escaped JSON string content."); }
        break;
      }
      case "json.find": {
        const parsed = diagnoseJson(stringField(rawInput, "input"));
        if (!parsed.ok) throw new McpRuntimeError("INVALID_INPUT", "Input is not valid JSON.");
        const query = stringField(rawInput, "query", 1000).toLocaleLowerCase("en-US");
        if (!query) throw new McpRuntimeError("INVALID_INPUT", "'query' must not be empty.");
        const match = enumField(rawInput, "match", ["keys","values","both"] as const, "both");
        const matches: { path: string; kind: "key" | "value"; valuePreview: string }[] = [];
        let truncated = false;
        const childPath = (path: string, key: string | number) => typeof key === "number" ? `${path}[${key}]` : /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
        const visit = (value: unknown, path: string, depth: number): void => {
          if (matches.length >= 1000 || depth > 64) { truncated = true; return; }
          if (Array.isArray(value)) {
            for (let index = 0; index < value.length && matches.length < 1000; index++) visit(value[index], childPath(path,index), depth+1);
            if (value.length && matches.length >= 1000) truncated = true;
            return;
          }
          if (isObject(value)) {
            for (const [key, child] of Object.entries(value)) {
              if ((match === "keys" || match === "both") && key.toLocaleLowerCase("en-US").includes(query)) {
                matches.push({ path: childPath(path,key), kind: "key", valuePreview: key.slice(0,500) });
                if (matches.length >= 1000) { truncated = true; return; }
              }
              visit(child, childPath(path,key), depth+1);
              if (matches.length >= 1000) { truncated = true; return; }
            }
            return;
          }
          if (match === "values" || match === "both") {
            const text = value === null ? "null" : String(value);
            if (text.toLocaleLowerCase("en-US").includes(query)) matches.push({ path, kind: "value", valuePreview: text.slice(0,500) });
          }
        };
        visit(parsed.value, "$", 0);
        result = { matches, truncated };
        break;
      }
      case "json.diff": {
        const before = stringField(rawInput, "before");
        const after = stringField(rawInput, "after");
        if (!diagnoseJson(before).ok || !diagnoseJson(after).ok) throw new McpRuntimeError("INVALID_INPUT", "Both inputs must be valid JSON.");
        result = compareJsonDocuments(before, after);
        break;
      }
      case "audio.normalize": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(inputBase64) || inputBase64.length === 0) throw new McpRuntimeError("INVALID_INPUT", "'inputBase64' must be valid standard Base64.");
        const bytes = Buffer.from(inputBase64, "base64");
        if (bytes.byteLength === 0 || bytes.byteLength > MCP_MAX_IMAGE_INPUT_BYTES || bytes.toString("base64") !== inputBase64) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Audio input must be at most 600,000 bytes.");
        const targetDbfs = rawInput.targetDbfs === undefined ? -1 : rawInput.targetDbfs;
        if (typeof targetDbfs !== "number" || !Number.isFinite(targetDbfs)) throw new McpRuntimeError("INVALID_INPUT", "'targetDbfs' must be a finite number.");
        result = normalizePcmWav(bytes, targetDbfs);
        break;
      }
      case "audio.trim": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(inputBase64) || inputBase64.length === 0) throw new McpRuntimeError("INVALID_INPUT", "'inputBase64' must be valid standard Base64.");
        const bytes = Buffer.from(inputBase64, "base64");
        if (bytes.byteLength === 0 || bytes.byteLength > MCP_MAX_IMAGE_INPUT_BYTES || bytes.toString("base64") !== inputBase64) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Audio input must be at most 600,000 bytes.");
        const startSeconds = rawInput.startSeconds, endSeconds = rawInput.endSeconds;
        if (typeof startSeconds !== "number" || !Number.isFinite(startSeconds) || typeof endSeconds !== "number" || !Number.isFinite(endSeconds)) throw new McpRuntimeError("INVALID_INPUT", "Trim startSeconds and endSeconds must be finite numbers.");
        result = trimPcmWav(bytes, startSeconds, endSeconds);
        break;
      }
      case "audio.analyze": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(inputBase64) || inputBase64.length === 0) throw new McpRuntimeError("INVALID_INPUT", "'inputBase64' must be valid standard Base64.");
        const bytes = Buffer.from(inputBase64, "base64");
        if (bytes.byteLength === 0 || bytes.byteLength > MCP_MAX_IMAGE_INPUT_BYTES || bytes.toString("base64") !== inputBase64) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Audio input must be at most 600,000 bytes.");
        result = analyzePcmWav(bytes);
        break;
      }
      case "video.inspect": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(inputBase64) || inputBase64.length === 0) throw new McpRuntimeError("INVALID_INPUT", "'inputBase64' must be valid standard Base64.");
        const bytes = Buffer.from(inputBase64, "base64");
        if (bytes.byteLength === 0 || bytes.byteLength > MCP_MAX_IMAGE_INPUT_BYTES || bytes.toString("base64") !== inputBase64) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Video input must be at most 600,000 bytes.");
        result = inspectIsoBmff(bytes);
        break;
      }
      case "audio.inspect": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(inputBase64) || inputBase64.length === 0) {
          throw new McpRuntimeError("INVALID_INPUT", "'inputBase64' must be valid standard Base64.");
        }
        const bytes = Buffer.from(inputBase64, "base64");
        if (bytes.byteLength === 0 || bytes.byteLength > MCP_MAX_IMAGE_INPUT_BYTES || bytes.toString("base64") !== inputBase64) {
          throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Audio input must be at most 600,000 bytes.");
        }
        result = inspectPcmWav(bytes);
        break;
      }
      case "image.print-size": {
        const width = rawInput.width;
        const height = rawInput.height;
        const dpi = rawInput.dpi;
        const unit = enumField(rawInput, "unit", ["in","cm","mm"] as const, "in");
        for (const [name, value] of [["width",width],["height",height]] as const) {
          if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > 100000) throw new McpRuntimeError("INVALID_INPUT", `'${name}' must be greater than 0 and at most 100,000 pixels.`);
        }
        if (typeof dpi !== "number" || !Number.isFinite(dpi) || dpi < 1 || dpi > 9600) throw new McpRuntimeError("INVALID_INPUT", "'dpi' must be between 1 and 9,600.");
        const widthInches = width as number / (dpi as number);
        const heightInches = height as number / (dpi as number);
        const widthCm = widthInches * 2.54;
        const heightCm = heightInches * 2.54;
        const factor = unit === "in" ? 1 : unit === "cm" ? 2.54 : 25.4;
        result = { width, height, dpi, unit, widthInches: Number(widthInches.toFixed(6)), heightInches: Number(heightInches.toFixed(6)), widthCm: Number(widthCm.toFixed(6)), heightCm: Number(heightCm.toFixed(6)), widthInUnit: Number((widthInches * factor).toFixed(6)), heightInUnit: Number((heightInches * factor).toFixed(6)) };
        break;
      }
      case "image.inspect": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        const bytes = decodeBoundedImageBase64(inputBase64);
        try {
          const metadata = await sharp(bytes, { limitInputPixels: MCP_MAX_IMAGE_PIXELS, sequentialRead: true, failOn: "error" }).timeout({ seconds: 5 }).metadata();
          if (!metadata.format || !["jpeg","png","webp","avif","gif","tiff"].includes(metadata.format) || !metadata.width || !metadata.height || !metadata.channels) {
            throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Only supported raster image formats are accepted.");
          }
          const stats = await sharp(bytes, { limitInputPixels: MCP_MAX_IMAGE_PIXELS, sequentialRead: true, failOn: "error" }).timeout({ seconds: 5 }).stats();
          const dominantColor = "#" + [stats.dominant.r, stats.dominant.g, stats.dominant.b].map(value => Math.round(value).toString(16).padStart(2, "0")).join("").toUpperCase();
          result = { format: metadata.format, width: metadata.width, height: metadata.height, aspectRatio: Number((metadata.width / metadata.height).toFixed(6)), pixelCount: metadata.width * metadata.height, channels: metadata.channels, hasAlpha: Boolean(metadata.hasAlpha), orientation: metadata.orientation ?? null, bytes: bytes.byteLength, animated: (metadata.pages ?? 1) > 1, dominantColor };
        } catch (error) {
          if (error instanceof McpRuntimeError) throw error;
          if (error instanceof Error && /timeout/i.test(error.message)) throw new McpRuntimeError("TIMEOUT", "Image inspection exceeded the five-second time limit.");
          throw new McpRuntimeError("INVALID_INPUT", "Image data is invalid, unsupported, or exceeds the processing limit.");
        }
        break;
      }
      case "image.sample-pixel": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        const bytes = decodeBoundedImageBase64(inputBase64);
        const x = rawInput.x;
        const y = rawInput.y;
        if (!Number.isSafeInteger(x) || (x as number) < 0 || !Number.isSafeInteger(y) || (y as number) < 0) {
          throw new McpRuntimeError("INVALID_INPUT", "'x' and 'y' must be non-negative pixel coordinates.");
        }
        try {
          const metadata = await sharp(bytes, { limitInputPixels: MCP_MAX_IMAGE_PIXELS, sequentialRead: true, failOn: "error" }).timeout({ seconds: 5 }).metadata();
          if (!metadata.format || !["jpeg","png","webp","avif","gif","tiff"].includes(metadata.format) || !metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) {
            throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Pixel sampling supports single-frame raster images only.");
          }
          if ((x as number) >= metadata.width || (y as number) >= metadata.height) {
            throw new McpRuntimeError("INVALID_INPUT", "Pixel coordinates must be inside the image dimensions.");
          }
          const pixel = await sharp(bytes, { limitInputPixels: MCP_MAX_IMAGE_PIXELS, sequentialRead: true, failOn: "error" })
            .timeout({ seconds: 5 }).extract({ left: x as number, top: y as number, width: 1, height: 1 }).ensureAlpha().raw().toBuffer();
          const [r, g, b, a] = pixel;
          result = { x, y, hex: "#" + [r,g,b].map(value => value.toString(16).padStart(2, "0")).join("").toUpperCase(), rgba: { r, g, b, a } };
        } catch (error) {
          if (error instanceof McpRuntimeError) throw error;
          if (error instanceof Error && /timeout/i.test(error.message)) throw new McpRuntimeError("TIMEOUT", "Pixel sampling exceeded the five-second time limit.");
          throw new McpRuntimeError("INVALID_INPUT", "Image data is invalid, unsupported, or exceeds the processing limit.");
        }
        break;
      }
      case "image.transform": {
        const inputBase64 = stringField(rawInput, "inputBase64", 800_000);
        const bytes = decodeBoundedImageBase64(inputBase64);
        const action = enumField(rawInput, "action", ["crop","resize","rotate","flip","flop","convert","auto-orient","grayscale","blur","adjust","text-overlay"] as const);
        const left = rawInput.left;
        const top = rawInput.top;
        const width = rawInput.width;
        const height = rawInput.height;
        const leftRatio = rawInput.leftRatio;
        const topRatio = rawInput.topRatio;
        const widthRatio = rawInput.widthRatio;
        const heightRatio = rawInput.heightRatio;
        const degrees = rawInput.degrees;
        const background = rawInput.background;
        const format = rawInput.format;
        const quality = rawInput.quality;
        const brightness = rawInput.brightness;
        const contrast = rawInput.contrast;
        const saturation = rawInput.saturation;
        const sigma = rawInput.sigma;
        const fit = rawInput.fit;
        const position = rawInput.position;
        const text = rawInput.text;
        const textX = rawInput.x;
        const textY = rawInput.y;
        const fontSize = rawInput.fontSize;
        const color = rawInput.color;
        if (left !== undefined && (!Number.isSafeInteger(left) || (left as number) < 0 || (left as number) > 16_000_000)) throw new McpRuntimeError("INVALID_INPUT", "'left' must be an integer from 0 to 16,000,000.");
        if (top !== undefined && (!Number.isSafeInteger(top) || (top as number) < 0 || (top as number) > 16_000_000)) throw new McpRuntimeError("INVALID_INPUT", "'top' must be an integer from 0 to 16,000,000.");
        if (width !== undefined && (!Number.isSafeInteger(width) || (width as number) < 1 || (width as number) > 4096)) throw new McpRuntimeError("INVALID_INPUT", "'width' must be an integer from 1 to 4096.");
        if (height !== undefined && (!Number.isSafeInteger(height) || (height as number) < 1 || (height as number) > 4096)) throw new McpRuntimeError("INVALID_INPUT", "'height' must be an integer from 1 to 4096.");
        if (quality !== undefined && (!Number.isSafeInteger(quality) || (quality as number) < 1 || (quality as number) > 100)) throw new McpRuntimeError("INVALID_INPUT", "'quality' must be an integer from 1 to 100.");
        for (const [name, value, min, max] of [["brightness", brightness, 0.1, 2], ["contrast", contrast, 0, 3], ["saturation", saturation, 0, 3], ["sigma", sigma, 0.3, 100]] as const) {
          if (value !== undefined && (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max)) throw new McpRuntimeError("INVALID_INPUT", "'" + name + "' is outside the supported numeric range.");
        }
        if (fit !== undefined && !["contain","cover","fill","inside","outside"].includes(String(fit))) throw new McpRuntimeError("INVALID_INPUT", "Fit must be contain, cover, fill, inside, or outside.");
        if (position !== undefined && !["centre","north","northeast","east","southeast","south","southwest","west","northwest"].includes(String(position))) throw new McpRuntimeError("INVALID_INPUT", "Unsupported resize position.");
        if (action === "text-overlay") {
          if (typeof text !== "string" || text.length < 1 || text.length > 500) throw new McpRuntimeError("INVALID_INPUT", "Text overlay requires 1 to 500 characters.");
          if (!Number.isSafeInteger(textX) || (textX as number) < 0 || (textX as number) > 4096 || !Number.isSafeInteger(textY) || (textY as number) < 0 || (textY as number) > 4096) throw new McpRuntimeError("INVALID_INPUT", "Text overlay x and y must be integers from 0 to 4,096.");
          if (!Number.isSafeInteger(fontSize) || (fontSize as number) < 1 || (fontSize as number) > 256) throw new McpRuntimeError("INVALID_INPUT", "Text overlay fontSize must be an integer from 1 to 256.");
          if (typeof color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(color)) throw new McpRuntimeError("INVALID_INPUT", "Text overlay color must be a six-digit hexadecimal color.");
        } else if (text !== undefined || textX !== undefined || textY !== undefined || fontSize !== undefined || color !== undefined) throw new McpRuntimeError("INVALID_INPUT", "Text overlay options are valid only for the text-overlay action.");

        if ((fit !== undefined || position !== undefined) && action !== "resize") throw new McpRuntimeError("INVALID_INPUT", "Fit and position are valid only for resize.");
        const ratioValues = [leftRatio, topRatio, widthRatio, heightRatio];
        if (ratioValues.some(value => value != null && (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1)) || (typeof widthRatio === "number" && widthRatio <= 0) || (typeof heightRatio === "number" && heightRatio <= 0)) throw new McpRuntimeError("INVALID_INPUT", "Normalized crop values must be finite ratios between 0 and 1; widthRatio and heightRatio must be greater than 0.");
        const hasPixelCrop = [left, top, width, height].every(value => value != null);
        const hasAnyPixelCrop = [left, top, width, height].some(value => value != null);
        const hasRatioCrop = ratioValues.every(value => value != null);
        const hasAnyRatioCrop = ratioValues.some(value => value != null);
        if (action === "crop" && (hasPixelCrop && hasAnyRatioCrop || hasAnyPixelCrop && !hasPixelCrop || hasAnyRatioCrop && !hasRatioCrop)) throw new McpRuntimeError("INVALID_INPUT", "Crop must use either all four pixel values or all four normalized ratios, not a mixture.");
        if (action === "crop" && !hasPixelCrop && !hasRatioCrop) throw new McpRuntimeError("INVALID_INPUT", "Crop requires left/top/width/height pixels or leftRatio/topRatio/widthRatio/heightRatio.");
        if (action === "rotate" && (typeof degrees !== "number" || !Number.isFinite(degrees) || degrees < -180 || degrees > 180 || degrees === 0)) throw new McpRuntimeError("INVALID_INPUT", "Rotate requires an angle greater than -180 and less than 180, excluding zero.");
        if (background !== undefined && (typeof background !== "string" || !/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(background))) throw new McpRuntimeError("INVALID_INPUT", "Background must be a six- or eight-digit hexadecimal color.");
        if (background !== undefined && action !== "rotate" && !(action === "convert" && format === "jpeg")) throw new McpRuntimeError("INVALID_INPUT", "Background is valid only for rotate or JPEG conversion.");
        if (action === "convert" && background !== undefined && format !== "jpeg") throw new McpRuntimeError("INVALID_INPUT", "A conversion background is supported only for JPEG output.");
        if (action === "convert" && (typeof format !== "string" || !["jpeg","png","webp","avif"].includes(format))) throw new McpRuntimeError("INVALID_INPUT", "Convert requires a supported output format.");
        if (format !== undefined && !["jpeg","png","webp","avif"].includes(String(format))) throw new McpRuntimeError("INVALID_INPUT", "Unsupported output format.");
        if (action !== "resize" && action !== "crop" && (width !== undefined || height !== undefined)) throw new McpRuntimeError("INVALID_INPUT", "Width and height are valid only for resize or crop.");
        if (action !== "crop" && (left !== undefined || top !== undefined || leftRatio !== undefined || topRatio !== undefined || widthRatio !== undefined || heightRatio !== undefined)) throw new McpRuntimeError("INVALID_INPUT", "Crop coordinates are valid only for crop.");
        if (action !== "rotate" && degrees !== undefined) throw new McpRuntimeError("INVALID_INPUT", "Degrees are valid only for rotate.");

        if (action !== "convert" && (format !== undefined || quality !== undefined)) throw new McpRuntimeError("INVALID_INPUT", "Format and quality are valid only for convert.");
        if (quality !== undefined && format === undefined) throw new McpRuntimeError("INVALID_INPUT", "Quality requires an explicit output format.");
        if (action === "blur" && sigma === undefined) throw new McpRuntimeError("INVALID_INPUT", "Blur requires a sigma value from 0.3 to 100.");
        if (action !== "blur" && sigma !== undefined) throw new McpRuntimeError("INVALID_INPUT", "Sigma is valid only for blur.");
        if (action === "adjust" && brightness === undefined && contrast === undefined && saturation === undefined) throw new McpRuntimeError("INVALID_INPUT", "Adjust requires at least one of brightness, contrast, or saturation.");
        if (action !== "adjust" && (brightness !== undefined || contrast !== undefined || saturation !== undefined)) throw new McpRuntimeError("INVALID_INPUT", "Brightness, contrast, and saturation are valid only for adjust.");
        try {
          let pipeline = sharp(bytes, { limitInputPixels: MCP_MAX_IMAGE_PIXELS, sequentialRead: true, failOn: "error" }).timeout({ seconds: 5 });
          const metadata = await pipeline.metadata();
          if (!metadata.format || !["jpeg","png","webp","avif","gif","tiff"].includes(metadata.format) || !metadata.width || !metadata.height) throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Only supported raster image formats are accepted.");
          if ((metadata.pages ?? 1) > 1) throw new McpRuntimeError("UNSUPPORTED_FORMAT", "Animated and multi-page images are not supported by image transformations.");
          if (action === "crop") {
            const cropLeft = hasRatioCrop ? Math.floor((leftRatio as number) * metadata.width) : left as number;
            const cropTop = hasRatioCrop ? Math.floor((topRatio as number) * metadata.height) : top as number;
            const cropWidth = hasRatioCrop ? Math.max(1, Math.round((widthRatio as number) * metadata.width)) : width as number;
            const cropHeight = hasRatioCrop ? Math.max(1, Math.round((heightRatio as number) * metadata.height)) : height as number;
            if (hasRatioCrop && ((leftRatio as number) + (widthRatio as number) > 1 || (topRatio as number) + (heightRatio as number) > 1)) throw new McpRuntimeError("INVALID_INPUT", "Normalized crop rectangle must fit within ratios 0 to 1.");
            if (cropLeft + cropWidth > metadata.width || cropTop + cropHeight > metadata.height) throw new McpRuntimeError("INVALID_INPUT", "Crop rectangle must fit entirely inside the source image.");
            pipeline = pipeline.extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight });
          } else if (action === "resize") {
            if (width === undefined && height === undefined) throw new McpRuntimeError("INVALID_INPUT", "Resize requires at least one of width or height.");
            pipeline = pipeline.resize(width as number | undefined, height as number | undefined, { fit: (fit as "contain" | "cover" | "fill" | "inside" | "outside" | undefined) ?? "inside", position: (position as string | undefined) ?? "centre", withoutEnlargement: fit === undefined || fit === "inside" });
          }
          else if (action === "rotate") pipeline = pipeline.rotate(degrees as number, background === undefined ? {} : { background: background as string });
          else if (action === "flip") pipeline = pipeline.flip();
          else if (action === "flop") pipeline = pipeline.flop();
          else if (action === "auto-orient") pipeline = pipeline.rotate();
          else if (action === "grayscale") pipeline = pipeline.grayscale();
          else if (action === "blur") pipeline = pipeline.blur(sigma as number);
          else if (action === "text-overlay") {
            if ((textX as number) >= metadata.width || (textY as number) >= metadata.height) throw new McpRuntimeError("INVALID_INPUT", "Text overlay origin must be inside the source image.");
            const escapedText = (text as string).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
            const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + metadata.width + '" height="' + metadata.height + '"><text x="' + (textX as number) + '" y="' + ((textY as number) + (fontSize as number)) + '" font-size="' + (fontSize as number) + '" fill="' + (color as string) + '" font-family="sans-serif">' + escapedText + '</text></svg>');
            pipeline = pipeline.composite([{ input: svg, left: 0, top: 0 }]);
          }
          else if (action === "adjust") {
            if (brightness !== undefined || saturation !== undefined) pipeline = pipeline.modulate({ ...(brightness === undefined ? {} : { brightness: brightness as number }), ...(saturation === undefined ? {} : { saturation: saturation as number }) });
            if (contrast !== undefined) pipeline = pipeline.linear(contrast as number, 128 * (1 - (contrast as number)));
          }
          else if (action === "convert") {
            if (format === "jpeg") pipeline = pipeline.flatten({ background: (background as string | undefined) ?? "#FFFFFF" });
            pipeline = pipeline.toFormat(format as "jpeg" | "png" | "webp" | "avif", quality === undefined ? {} : { quality: quality as number });
          }
          if (action !== "resize") pipeline = pipeline.resize({ width: 4096, height: 4096, fit: "inside", withoutEnlargement: true });
          const output = await pipeline.toBuffer({ resolveWithObject: true });
          if (output.info.width > 4096 || output.info.height > 4096) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Processed image dimensions exceed the 4,096-pixel limit.");
          if (output.data.byteLength > MCP_MAX_IMAGE_OUTPUT_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Processed image exceeds the 600,000-byte output limit.");
          result = { format: output.info.format, width: output.info.width, height: output.info.height, bytes: output.data.byteLength, dataBase64: output.data.toString("base64") };
        } catch (error) {
          if (error instanceof McpRuntimeError) throw error;
          if (error instanceof Error && /timeout/i.test(error.message)) throw new McpRuntimeError("TIMEOUT", "Image processing exceeded the five-second time limit.");
          throw new McpRuntimeError("INVALID_INPUT", "Image data could not be processed within the supported limits.");
        }
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
      case "security.hash": {
        const input = stringField(rawInput, "input");
        const mode = enumField(rawInput, "mode", ["digest","hmac","crc32","crc16-ccitt","adler32"] as const) as HashMode;
        const algorithm = enumField(rawInput, "algorithm", ["SHA-256","SHA-384","SHA-512"] as const, "SHA-256") as DigestAlgorithm;
        const key = rawInput.key === undefined ? undefined : stringField(rawInput, "key", 10_000);
        if (mode === "hmac" && !key) throw new McpRuntimeError("INVALID_INPUT", "HMAC mode requires a non-empty key.");
        if (mode !== "hmac" && key !== undefined) throw new McpRuntimeError("INVALID_INPUT", "A key is accepted only for HMAC mode.");
        result = await computeHash(input, { mode, algorithm, ...(key === undefined ? {} : { key }) });
        break;
      }
      case "security.jwt.decode": {
        const token = stringField(rawInput, "token", 20_000);
        const parts = token.split(".");
        if (parts.length !== 3 || !parts[0] || !parts[1] || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]+$/.test(parts[1]) || (parts[2] && !/^[A-Za-z0-9_-]+$/.test(parts[2]))) {
          throw new McpRuntimeError("INVALID_INPUT", "Input must be a compact JWT with three Base64url segments.");
        }
        const decode = (segment: string): unknown => {
          if (segment.length > 12_000 || segment.length % 4 === 1) throw new McpRuntimeError("INVALID_INPUT", "JWT segment is malformed or too large.");
          try { return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")); }
          catch { throw new McpRuntimeError("INVALID_INPUT", "JWT header or claims are not valid JSON."); }
        };
        const header = decode(parts[0]), claims = decode(parts[1]);
        if (!isObject(header) || !isObject(claims)) throw new McpRuntimeError("INVALID_INPUT", "JWT header and claims must be JSON objects.");
        result = { header, claims, signaturePresent: parts[2].length > 0, signatureVerified: false, note: "This tool only decodes token content. It does not verify the signature, issuer, audience, or trust." };
        break;
      }
      case "generator.sample": {
        const operation = enumField(rawInput, "operation", ["random-string","random-integer","timestamp","sample-json","uuid"] as const) as SampleGeneratorOperation;
        const options: Record<string, number> = {};
        for (const key of ["length","count","min","max"] as const) {
          if (rawInput[key] !== undefined) {
            const value = rawInput[key];
            if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new McpRuntimeError("INVALID_INPUT", `'${key}' must be an integer.`);
            options[key] = value;
          }
        }
        if (options.length !== undefined && (options.length < 1 || options.length > 4096)) throw new McpRuntimeError("INVALID_INPUT", "'length' must be between 1 and 4,096.");
        if (options.count !== undefined && (options.count < 1 || options.count > 100)) throw new McpRuntimeError("INVALID_INPUT", "'count' must be between 1 and 100.");
        if ((options.min !== undefined && options.max !== undefined && options.max < options.min) || (options.min !== undefined && options.max !== undefined && options.max - options.min > 1_000_000_000)) throw new McpRuntimeError("INVALID_INPUT", "Integer range must be ordered and no wider than 1,000,000,000.");
        result = generateSampleData(operation, options);
        break;
      }
      case "data.inspect": {
        const operation = enumField(rawInput, "operation", ["url-parse","data-uri","query-parse","query-build","key-value","key-value-build","number-base","numeric-view","float-view","hexdump","byte-range","strings","byte-stats","network","cidr","mac","headers","cookies","network-extract","statistics","character-stats","arithmetic","dns-records","http-message","file-signatures","file-metadata","certificate-container","ssh-public-key","compression-detect"] as const) as ExtendedOperation;
        const input = stringField(rawInput, "input");
        const optionsRaw = rawInput.options;
        if (optionsRaw !== undefined && !isObject(optionsRaw)) throw new McpRuntimeError("INVALID_INPUT", "'options' must be an object.");
        const optionsObject = (optionsRaw ?? {}) as JsonObject;
        assertAllowedKeys(optionsObject, ["radix","width","offset","length","minLength","format","signed","bits","endian","a","b","modulus"]);
        for (const key of ["radix","width","offset","length","minLength","bits"] as const) {
          if (optionsObject[key] !== undefined && (typeof optionsObject[key] !== "number" || !Number.isSafeInteger(optionsObject[key]))) throw new McpRuntimeError("INVALID_INPUT", `Option '${key}' must be an integer.`);
        }
        if (optionsObject.signed !== undefined && typeof optionsObject.signed !== "boolean") throw new McpRuntimeError("INVALID_INPUT", "Option 'signed' must be a boolean.");
        if (optionsObject.endian !== undefined && optionsObject.endian !== "big" && optionsObject.endian !== "little") throw new McpRuntimeError("INVALID_INPUT", "Option 'endian' must be 'big' or 'little'.");
        for (const key of ["format","a","b","modulus"] as const) {
          if (optionsObject[key] !== undefined && (typeof optionsObject[key] !== "string" || optionsObject[key].length > 200_000)) throw new McpRuntimeError("INVALID_INPUT", `Option '${key}' must be a bounded string.`);
        }
        const options = optionsObject as unknown as ExtendedOptions;
        result = await runExtendedOperation(operation, input, new TextEncoder().encode(input), options);
        break;
      }
      case "datetime.convert": {
        const mode = enumField(rawInput, "mode", ["iso-to-epoch","epoch-to-iso","format"] as const);
        const input = stringField(rawInput, "input", 128);
        const unit = enumField(rawInput, "unit", ["seconds","milliseconds"] as const, "milliseconds");
        const timeZone = rawInput.timeZone === undefined ? "UTC" : stringField(rawInput, "timeZone", 100);
        const locale = rawInput.locale === undefined ? "en" : stringField(rawInput, "locale", 35);
        let date: Date;
        if (mode === "epoch-to-iso") {
          if (!/^-?\d{1,16}$/.test(input)) throw new McpRuntimeError("INVALID_INPUT", "Epoch input must be an integer.");
          const value = Number(input) * (unit === "seconds" ? 1000 : 1);
          date = new Date(value);
        } else {
          if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(input)) throw new McpRuntimeError("INVALID_INPUT", "Date input must be an ISO timestamp with an explicit UTC offset.");
          date = new Date(input);
        }
        if (!Number.isFinite(date.getTime())) throw new McpRuntimeError("INVALID_INPUT", "Date input is outside the supported range.");
        if (mode === "iso-to-epoch") result = { iso: date.toISOString(), epochMilliseconds: date.getTime(), epochSeconds: date.getTime() / 1000 };
        else if (mode === "format") {
          try { result = { iso: date.toISOString(), formatted: new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "long", timeZone }).format(date), timeZone, locale }; }
          catch { throw new McpRuntimeError("INVALID_INPUT", "Locale or time zone is not supported."); }
        } else result = { iso: date.toISOString(), epochMilliseconds: date.getTime(), epochSeconds: date.getTime() / 1000 };
        break;
      }
      case "datetime.arithmetic": {
        const input = stringField(rawInput, "input", 128);
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(input)) throw new McpRuntimeError("INVALID_INPUT", "Date input must be an ISO timestamp with an explicit UTC offset.");
        const amount = rawInput.amount;
        if (typeof amount !== "number" || !Number.isSafeInteger(amount) || Math.abs(amount) > 1_000_000) throw new McpRuntimeError("INVALID_INPUT", "'amount' must be an integer between -1,000,000 and 1,000,000.");
        const unit = enumField(rawInput, "unit", ["milliseconds","seconds","minutes","hours","days","weeks"] as const);
        const multiplier = { milliseconds: 1, seconds: 1000, minutes: 60_000, hours: 3_600_000, days: 86_400_000, weeks: 604_800_000 }[unit];
        const source = Date.parse(input), timestamp = source + amount * multiplier;
        if (!Number.isFinite(source) || !Number.isFinite(timestamp) || !Number.isFinite(new Date(timestamp).getTime())) throw new McpRuntimeError("INVALID_INPUT", "Date arithmetic result is outside the supported range.");
        result = { input: new Date(source).toISOString(), result: new Date(timestamp).toISOString(), amount, unit, elapsedMilliseconds: timestamp - source, note: "Arithmetic uses elapsed UTC time; calendar-day behavior across daylight-saving transitions is not implied." };
        break;
      }
      case "datetime.compare": {
        const left = stringField(rawInput, "left", 128), right = stringField(rawInput, "right", 128);
        const validIso = (value: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
        if (!validIso(left) || !validIso(right)) throw new McpRuntimeError("INVALID_INPUT", "Both values must be ISO timestamps with explicit UTC offsets.");
        const leftMs = Date.parse(left), rightMs = Date.parse(right);
        result = { relation: leftMs < rightMs ? "before" : leftMs > rightMs ? "after" : "equal", differenceMilliseconds: leftMs - rightMs, left: new Date(leftMs).toISOString(), right: new Date(rightMs).toISOString() };
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


export const MCP_MAX_WORKFLOW_STEPS = 20;
export const MCP_MAX_WORKFLOW_BYTES = 1_000_000;
export const MCP_WORKFLOW_DEADLINE_MS = 10_000;
type WorkflowReference = { $ref: string };
type WorkflowStep = { id: string; operationId: string; arguments: Record<string, unknown> };
type WorkflowRecipe = { schemaVersion: 1; steps: WorkflowStep[]; output?: WorkflowReference };
const workflowStringInputs: Record<string, readonly string[]> = {
  "encoding.transform": ["input"],
  "encoding.charset": ["input"],
  "text.transform": ["input"],
  "json.validate": ["input"],
  "json.format": ["input"],
  "json.minify": ["input"],
  "json.diff": ["before", "after"],
  "json.sort-keys": ["input"],
  "json.escape": ["input"],
  "json.unescape": ["input"],
  "json.find": ["input"],
  "developer.format": ["input"],
  "security.hash": ["input"],
  "security.jwt.decode": ["token"],
  "generator.sample": [],
  "data.inspect": ["input"],
  "datetime.convert": ["input"],
  "datetime.arithmetic": ["input"],
  "datetime.compare": ["left","right"],
  "audio.analyze": ["inputBase64"],
  "audio.trim": ["inputBase64"],
  "audio.normalize": ["inputBase64"],
  "video.inspect": ["inputBase64"],
  "image.inspect": ["inputBase64"],
  "image.sample-pixel": ["inputBase64"],
  "image.transform": ["inputBase64"]
};
const workflowStringOutputs = new Set(["encoding.transform", "encoding.charset", "text.transform", "json.format", "json.minify", "json.sort-keys", "json.escape", "json.unescape", "developer.format", "security.hash", "generator.sample", "data.inspect"]);
const workflowStructuredOutputs = new Set(["image.print-size", "image.inspect", "image.sample-pixel", "audio.analyze", "audio.trim", "audio.normalize", "video.inspect", "json.validate", "json.diff", "json.find", "security.jwt.decode"]);
function isWorkflowReference(value: unknown): value is WorkflowReference {
  return isObject(value) && Object.keys(value).length === 1 && typeof value.$ref === "string";
}
function assertWorkflowLiteral(value: unknown, depth = 0): void {
  if (depth > 8) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Workflow literal nesting exceeds 8 levels.");
  if (typeof value === "string" && value.length > 200_000) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Workflow literal text exceeds 200,000 characters.");
  if (typeof value === "number" && !Number.isFinite(value)) throw new McpRuntimeError("INVALID_INPUT", "Workflow numbers must be finite.");
  if (Array.isArray(value)) {
    if (value.length > 100) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Workflow literal arrays may contain at most 100 items.");
    for (const item of value) assertWorkflowLiteral(item, depth + 1);
  } else if (isObject(value)) {
    if (Object.hasOwn(value, "$ref")) throw new McpRuntimeError("INVALID_INPUT", "Workflow references are supported only as direct argument values, not nested objects.");
    for (const item of Object.values(value)) assertWorkflowLiteral(item, depth + 1);
  }
}

function validateAgainstOperationSchema(value: unknown, schema: unknown, path: string): void {
  if (!isObject(schema)) return;
  const matchesType = (expected: unknown, actual: unknown): boolean => {
    if (Array.isArray(expected)) return expected.some(item => matchesType(item, actual));
    switch (expected) {
      case "object": return isObject(actual);
      case "array": return Array.isArray(actual);
      case "string": return typeof actual === "string";
      case "number": return typeof actual === "number" && Number.isFinite(actual);
      case "integer": return typeof actual === "number" && Number.isSafeInteger(actual);
      case "boolean": return typeof actual === "boolean";
      case "null": return actual === null;
      default: return true;
    }
  };
  if (!matchesType(schema.type, value)) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} must match the operation input schema type.`);
  if (schema.const !== undefined && value !== schema.const) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} must equal the required constant.`);
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} has an unsupported value.`);
  if (typeof value === "string") {
    if (typeof schema.maxLength === "number" && value.length > schema.maxLength) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", `Workflow ${path} exceeds the maximum character count.`);
    if (typeof schema.minLength === "number" && value.length < schema.minLength) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} is shorter than allowed.`);
    if (typeof schema.pattern === "string" && !(new RegExp(schema.pattern).test(value))) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} has an invalid format.`);
  }
  if (typeof value === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} is below the minimum.`);
    if (typeof schema.maximum === "number" && value > schema.maximum) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} exceeds the maximum.`);
    if (typeof schema.exclusiveMinimum === "number" && value <= schema.exclusiveMinimum) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} must be greater than the exclusive minimum.`);
  }
  if (Array.isArray(value) && isObject(schema.items)) value.forEach((item, index) => validateAgainstOperationSchema(item, schema.items, `${path}[${index}]`));
  if (isObject(value) && isObject(schema.properties)) {
    const properties = schema.properties;
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(properties, key) && schema.additionalProperties === false) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} contains unknown argument '${key}'.`);
      if (Object.hasOwn(properties, key)) validateAgainstOperationSchema(value[key], properties[key], `${path}.${key}`);
    }
    if (Array.isArray(schema.required)) for (const key of schema.required) if (typeof key === "string" && !Object.hasOwn(value, key)) throw new McpRuntimeError("INVALID_INPUT", `Workflow ${path} is missing required argument '${key}'.`);
  }
}
function validateWorkflowRecipe(raw: unknown): WorkflowRecipe {
  if (!isObject(raw)) throw new McpRuntimeError("INVALID_INPUT", "Workflow must be a JSON object.");
  let serialized: string;
  try { serialized = JSON.stringify(raw); } catch { throw new McpRuntimeError("INVALID_INPUT", "Workflow must be serializable JSON."); }
  if (new TextEncoder().encode(serialized).byteLength > MCP_MAX_WORKFLOW_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Workflow definition exceeds the 1,000,000 byte limit.");
  assertAllowedKeys(raw, ["schemaVersion", "steps", "output"]);
  if (raw.schemaVersion !== 1) throw new McpRuntimeError("INVALID_INPUT", "Workflow schemaVersion must be 1.");
  if (!Array.isArray(raw.steps) || raw.steps.length < 1 || raw.steps.length > MCP_MAX_WORKFLOW_STEPS) {
    throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", `Workflow must contain between 1 and ${MCP_MAX_WORKFLOW_STEPS} steps.`);
  }
  const seen = new Set<string>();
  for (const [index, rawStep] of raw.steps.entries()) {
    if (!isObject(rawStep)) throw new McpRuntimeError("INVALID_INPUT", `Workflow step ${index + 1} must be an object.`);
    assertAllowedKeys(rawStep, ["id", "operationId", "arguments"]);
    if (typeof rawStep.id !== "string" || !/^[a-z][a-z0-9_-]{0,39}$/.test(rawStep.id)) {
      throw new McpRuntimeError("INVALID_INPUT", `Workflow step ${index + 1} has an invalid id.`);
    }
    if (seen.has(rawStep.id)) throw new McpRuntimeError("INVALID_INPUT", "Workflow step IDs must be unique.");
    if (typeof rawStep.operationId !== "string" || !Object.hasOwn(workflowStringInputs, rawStep.operationId)) {
      throw new McpRuntimeError("UNSUPPORTED_OPERATION", "Workflow references an operation that is not enabled for MCP execution.");
    }
    if (!isObject(rawStep.arguments)) throw new McpRuntimeError("INVALID_INPUT", `Arguments for workflow step '${rawStep.id}' must be an object.`);
    const allowed = new Set(["encoding.transform", "encoding.charset", "text.transform", "json.validate", "json.format", "json.minify", "json.diff", "json.sort-keys", "json.escape", "json.unescape", "json.find", "developer.format", "security.hash", "security.jwt.decode", "generator.sample", "data.inspect", "datetime.convert", "datetime.arithmetic", "datetime.compare", "audio.analyze", "audio.trim", "audio.normalize", "video.inspect", "image.print-size", "image.inspect", "image.sample-pixel", "image.transform"]);
    if (!allowed.has(rawStep.operationId)) throw new McpRuntimeError("UNSUPPORTED_OPERATION", "Workflow operation is not enabled.");

    const operationSchema = schemas[rawStep.operationId as keyof typeof schemas];
    if (!operationSchema) throw new McpRuntimeError("UNSUPPORTED_OPERATION", "Workflow operation has no input contract.");
    const preflightArguments: JsonObject = { ...rawStep.arguments };
    for (const [field, value] of Object.entries(preflightArguments)) if (isWorkflowReference(value)) preflightArguments[field] = "";
    validateAgainstOperationSchema(preflightArguments, operationSchema, `step '${rawStep.id}' arguments`);
    for (const [field, value] of Object.entries(rawStep.arguments)) {
      if (isWorkflowReference(value)) {
        const match = /^([a-z][a-z0-9_-]{0,39})\.result(?:\.([A-Za-z][A-Za-z0-9]*))?$/.exec(value.$ref);
        if (!match || !seen.has(match[1])) throw new McpRuntimeError("INVALID_INPUT", `Workflow reference '${value.$ref}' must point to a previous step result.`);
        const sourceOperation = (raw.steps.find(s => isObject(s) && s.id === match[1]) as JsonObject).operationId as string;
        if (match[2]) {
          if (!["image.transform", "audio.trim", "audio.normalize"].includes(sourceOperation) || match[2] !== "dataBase64") throw new McpRuntimeError("INVALID_INPUT", "Only image.transform dataBase64 may be referenced as an object field.");
        } else if (!workflowStringOutputs.has(sourceOperation)) {
          throw new McpRuntimeError("INVALID_INPUT", "Workflow arguments may reference only text results or the supported image data field.");
        }
        if (!workflowStringInputs[rawStep.operationId].includes(field)) {
          throw new McpRuntimeError("INVALID_INPUT", `Workflow field '${field}' does not accept a text result reference.`);
        }
      } else {
        assertWorkflowLiteral(value);
      }
    }
    seen.add(rawStep.id);
  }
  if (raw.output !== undefined) {
    if (!isWorkflowReference(raw.output)) throw new McpRuntimeError("INVALID_INPUT", "Workflow output must be a direct reference to a previous step result.");
    const outputMatch = /^([a-z][a-z0-9_-]{0,39})\.result(?:\.([A-Za-z][A-Za-z0-9]*))?$/.exec(raw.output.$ref);
    if (!outputMatch || !seen.has(outputMatch[1])) throw new McpRuntimeError("INVALID_INPUT", "Workflow output must reference a declared step result.");
    const sourceOperation = (raw.steps.find(s => isObject(s) && s.id === outputMatch[1]) as JsonObject).operationId as string;
    if (outputMatch[2]) {
      if (!["image.transform", "audio.trim", "audio.normalize"].includes(sourceOperation) || outputMatch[2] !== "dataBase64") throw new McpRuntimeError("INVALID_INPUT", "Workflow output may select only supported image/audio dataBase64 fields.");
    } else if (!workflowStringOutputs.has(sourceOperation) && !workflowStructuredOutputs.has(sourceOperation)) {
      throw new McpRuntimeError("INVALID_INPUT", "Workflow output must select a supported text or structured result, or image data field.");
    }
  }
  return raw as unknown as WorkflowRecipe;
}
export async function executeWorkflow(raw: unknown, options: { signal?: AbortSignal; deadlineMs?: number } = {}): Promise<{
  success: true; schemaVersion: 1; steps: { id: string; operationId: string; success: true; result: unknown; outputBytes: number }[];
  result: unknown; totalOutputBytes: number; elapsedMs: number;
}> {
  const recipe = validateWorkflowRecipe(raw);
  const startedAt = Date.now();
  const deadlineMs = options.deadlineMs ?? MCP_WORKFLOW_DEADLINE_MS;
  if (!Number.isFinite(deadlineMs) || deadlineMs < 1 || deadlineMs > MCP_WORKFLOW_DEADLINE_MS) {
    throw new McpRuntimeError("INVALID_INPUT", `Workflow deadline must be between 1 and ${MCP_WORKFLOW_DEADLINE_MS} ms.`);
  }
  const results = new Map<string, unknown>();
  const manifest: { id: string; operationId: string; success: true; result: unknown; outputBytes: number }[] = [];
  let totalOutputBytes = 0;
  for (const step of recipe.steps) {
    if (options.signal?.aborted) throw new McpRuntimeError("CANCELLED", "Workflow execution was cancelled.");
    if (Date.now() - startedAt >= deadlineMs) throw new McpRuntimeError("TIMEOUT", "Workflow exceeded its execution deadline.");
    const args: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(step.arguments)) {
      if (isWorkflowReference(value)) {
        const reference = /^([a-z][a-z0-9_-]{0,39})\.result(?:\.([A-Za-z][A-Za-z0-9]*))?$/.exec(value.$ref);
        if (!reference) throw new McpRuntimeError("INVALID_INPUT", "Workflow reference is malformed.");
        const sourceResult = results.get(reference[1]);
        args[field] = reference[2] === "dataBase64" && isObject(sourceResult) ? sourceResult.dataBase64 : sourceResult;
      } else args[field] = value;
    }
    const result = await executeOperation(step.operationId, args);
    const outputBytes = new TextEncoder().encode(JSON.stringify(result)).byteLength;
    totalOutputBytes += outputBytes;
    if (totalOutputBytes > MCP_MAX_WORKFLOW_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Workflow outputs exceed the total byte budget.");
    if (Date.now() - startedAt > deadlineMs) throw new McpRuntimeError("TIMEOUT", "Workflow exceeded its execution deadline.");
    results.set(step.id, result);
    manifest.push({ id: step.id, operationId: step.operationId, success: true, result, outputBytes });
  }
  let finalResult = manifest[manifest.length - 1].result;
  if (recipe.output) {
    const match = /^([a-z][a-z0-9_-]{0,39})\.result(?:\.([A-Za-z][A-Za-z0-9]*))?$/.exec(recipe.output.$ref) as RegExpExecArray;
    const sourceResult = results.get(match[1]);
    finalResult = match[2] === "dataBase64" && isObject(sourceResult) ? sourceResult.dataBase64 : sourceResult;
  }
  const finalBytes = new TextEncoder().encode(JSON.stringify(finalResult)).byteLength;
  if (finalBytes > MCP_MAX_WORKFLOW_BYTES) throw new McpRuntimeError("RESOURCE_LIMIT_EXCEEDED", "Selected workflow output exceeds the 1,000,000-byte limit.");
  return { success: true, schemaVersion: 1, steps: manifest, result: finalResult, totalOutputBytes, elapsedMs: Date.now() - startedAt };
}

let rateWindowStartedAt = Date.now();
let requestsInRateWindow = 0;
let activeMcpRequests = 0;
function admitMcpRequest(): Response | null {
  const now = Date.now();
  if (now - rateWindowStartedAt >= 60_000) {
    rateWindowStartedAt = now;
    requestsInRateWindow = 0;
  }
  if (requestsInRateWindow >= MCP_MAX_REQUESTS_PER_MINUTE) {
    return Response.json({ error: "MCP request rate limit exceeded for this server instance." }, { status: 429, headers: { "Retry-After": "60" } });
  }
  requestsInRateWindow += 1;
  if (activeMcpRequests >= MCP_MAX_CONCURRENT_REQUESTS) {
    return Response.json({ error: "MCP server is at its concurrent request limit. Retry shortly." }, { status: 503, headers: { "Retry-After": "1" } });
  }
  activeMcpRequests += 1;
  return null;
}
async function readChunkWithTimeout(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<ReadableStreamReadResult<Uint8Array>> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      reader.read(),
      new Promise<ReadableStreamReadResult<Uint8Array>>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Request body read timed out.")), MCP_BODY_READ_TIMEOUT_MS);
      })
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
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
        operationId: z.enum(["encoding.transform", "encoding.charset", "text.transform", "json.validate", "json.format", "json.minify", "json.diff", "json.sort-keys", "json.escape", "json.unescape", "json.find", "developer.format", "security.hash", "security.jwt.decode", "generator.sample", "data.inspect", "datetime.convert", "datetime.arithmetic", "datetime.compare", "audio.inspect", "audio.analyze", "audio.trim", "audio.normalize", "video.inspect", "image.print-size", "image.inspect", "image.sample-pixel", "image.transform"]),
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

  server.registerTool(
    "execute_workflow",
    {
      title: "Execute a bounded GaGet workflow",
      description: "Run a sequential workflow of approved operations. Workflow references may point only to earlier supported text/structured results or image.transform dataBase64 fields. Maximum 20 steps, 1,000,000 aggregate output bytes, and 10 seconds. No code, shell, filesystem, or network execution.",
      inputSchema: z.object({
        schemaVersion: z.literal(1),
        output: z.object({ $ref: z.string().max(80) }).strict().optional(),
        steps: z.array(z.object({
          id: z.string().regex(/^[a-z][a-z0-9_-]{0,39}$/),
          operationId: z.enum(["encoding.transform", "encoding.charset", "text.transform", "json.validate", "json.format", "json.minify", "json.diff", "json.sort-keys", "json.escape", "json.unescape", "json.find", "developer.format", "security.hash", "security.jwt.decode", "generator.sample", "data.inspect", "datetime.convert", "datetime.arithmetic", "datetime.compare", "image.print-size", "image.inspect", "image.sample-pixel", "image.transform"]),
          arguments: z.record(z.string(), z.unknown())
        }).strict()).min(1).max(MCP_MAX_WORKFLOW_STEPS)
      }).strict(),
      outputSchema: z.object({
        success: z.boolean(),
        schemaVersion: z.literal(1).optional(),
        steps: z.array(z.unknown()).optional(),
        result: z.unknown().optional(),
        totalOutputBytes: z.number().optional(),
        elapsedMs: z.number().optional(),
        error: z.object({ code: z.string(), message: z.string() }).optional()
      }).strict()
    },
    async (input) => {
      try {
        const result = await executeWorkflow(input);
        return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
      } catch (error) {
        const runtimeError = error instanceof McpRuntimeError ? error : new McpRuntimeError("PROCESSING_FAILED", "Workflow execution failed.");
        return {
          content: [{ type: "text", text: runtimeError.message }],
          structuredContent: { success: false, error: { code: runtimeError.code, message: runtimeError.message } },
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
  const expectedAuthorization = Buffer.from(`Bearer ${configuredToken}`, "utf8");
  const actualAuthorization = Buffer.from(authorization, "utf8");
  if (actualAuthorization.byteLength !== expectedAuthorization.byteLength || !timingSafeEqual(actualAuthorization, expectedAuthorization)) return Response.json({ error: "Authentication required." }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  const admissionError = admitMcpRequest();
  if (admissionError) return admissionError;
  try {
  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader && /^\d+$/.test(lengthHeader) && Number(lengthHeader) > MCP_MAX_REQUEST_BYTES) {
    return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
  }
  let raw: string;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    reader = request.body?.getReader();
    if (!reader) raw = "";
    else {
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;
      while (true) {
        const { done, value } = await readChunkWithTimeout(reader);
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
    await reader?.cancel().catch(() => undefined);
    return Response.json({ error: "Unable to read request body within the supported time limit." }, { status: 408 });
  }
  if (new TextEncoder().encode(raw).byteLength > MCP_MAX_REQUEST_BYTES) {
    return Response.json({ error: "Request body exceeds the 1,000,000 byte limit." }, { status: 413 });
  }
  return await mcpHandler.fetch(new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: raw
  }));
  } finally {
    activeMcpRequests -= 1;
  }
}
