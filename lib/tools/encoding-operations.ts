export type EncodingMode = "url" | "base64" | "base64url" | "base32" | "hex" | "binary" | "html-entities" | "unicode-escapes" | "quoted-printable" | "charset" | "base58" | "base85";
export type EncodingDirection = "encode" | "decode";
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function utf8(text: string): Uint8Array { return new TextEncoder().encode(text); }
function textFrom(bytes: Uint8Array): string { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
function base64FromBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
function bytesFromBase64(value: string, urlSafe = false): Uint8Array {
  let text = value.replace(/\s/g, "");
  if (urlSafe) text = text.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+\/]*={0,2}$/.test(text) || text.length % 4 === 1 || /=/.test(text.slice(0, -2))) throw new Error("Invalid Base64 alphabet or padding.");
  text = text.replace(/=+$/, "");
  text += "=".repeat((4 - text.length % 4) % 4);
  try { return Uint8Array.from(atob(text), c => c.charCodeAt(0)); }
  catch { throw new Error("Invalid Base64 input."); }
}
function encodeBase32(bytes: Uint8Array): string {
  let buffer = 0, bits = 0, output = "";
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte; bits += 8;
    while (bits >= 5) { output += BASE32[(buffer >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits) output += BASE32[(buffer << (5 - bits)) & 31];
  while (output.length % 8) output += "=";
  return output;
}
function decodeBase32(value: string): Uint8Array {
  const text = value.replace(/\s/g, "").toUpperCase().replace(/=+$/, "");
  if (!/^[A-Z2-7]*$/.test(text) || ![0,2,4,5,7].includes(text.length % 8)) throw new Error("Invalid Base32 alphabet or padding.");
  let buffer = 0, bits = 0; const output: number[] = [];
  for (const char of text) {
    buffer = (buffer << 5) | BASE32.indexOf(char); bits += 5;
    if (bits >= 8) { output.push((buffer >>> (bits - 8)) & 255); bits -= 8; }
  }
  if (bits && (buffer & ((1 << bits) - 1)) !== 0) throw new Error("Invalid non-zero trailing Base32 bits.");
  return Uint8Array.from(output);
}
function encodeAscii85(bytes:Uint8Array):string {
 let out="<~";
 for(let offset=0;offset<bytes.length;offset+=4){
  const count=Math.min(4,bytes.length-offset);let value=BigInt(0);
  for(let i=0;i<4;i++)value=(value<<BigInt(8))|BigInt(i<count?bytes[offset+i]:0);
  if(count===4&&value===BigInt(0)){out+="z";continue;}
  const chars=new Array<string>(5);
  for(let i=4;i>=0;i--){chars[i]=String.fromCharCode(Number(value%BigInt(85))+33);value/=BigInt(85);}
  out+=chars.slice(0,count+1).join("");
 }
 return out+"~>";
}
function decodeAscii85(input:string):Uint8Array {
  let source=input.replace(/\s/g,"");
 const hasStart=source.startsWith("<~"),hasEnd=source.endsWith("~>");
 if(hasStart!==hasEnd)throw new Error("ASCII85 Adobe wrappers must include both <~ and ~>.");
 if(hasStart)source=source.slice(2,-2);
 const out:number[]=[];let group:number[]=[];
 const flush=(final=false)=>{
  if(!group.length)return;
  if(final&&group.length===1)throw new Error("ASCII85 final group must contain at least two characters.");
  const original=group.length;
  while(group.length<5)group.push(84);
  let value=BigInt(0);for(const digit of group)value=value*BigInt(85)+BigInt(digit);
  if(value>BigInt(0xffffffff))throw new Error("ASCII85 group exceeds the 32-bit byte range.");
  const n=Number(value);
  const decoded=[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
  out.push(...decoded.slice(0,final?original-1:4));group=[];
  if(out.length>MAX_ENCODING_FILE_BYTES)throw new Error("Decoded byte output is limited to 2,000,000 bytes.");
 };
 for(const char of source){
  if(/\s/.test(char))continue;
  if(char==="z"){if(group.length)throw new Error("ASCII85 z shorthand is only valid at a group boundary.");out.push(0,0,0,0);if(out.length>MAX_ENCODING_FILE_BYTES)throw new Error("Decoded byte output is limited to 2,000,000 bytes.");continue;}
  const code=char.charCodeAt(0);if(code<33||code>117)throw new Error("ASCII85 input contains a character outside the ! through u alphabet.");
  group.push(code-33);if(group.length===5)flush(false);
 }
 flush(true);
 return Uint8Array.from(out);
}
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function encodeBase58(bytes: Uint8Array): string {
  let zeros = 0; while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  let value = BigInt(0); for (const byte of bytes) value = (value << BigInt(8)) | BigInt(byte);
  let result = "";
  while (value > BigInt(0)) { const remainder = Number(value % BigInt(58)); result = BASE58[remainder] + result; value /= BigInt(58); }
  return "1".repeat(zeros) + result;
}
function decodeBase58(value: string): Uint8Array {
  const text = value.trim(); if (!text) return new Uint8Array();
  let zeros = 0; while (zeros < text.length && text[zeros] === "1") zeros++;
  let number = BigInt(0);
  for (const character of text) { const digit = BASE58.indexOf(character); if (digit < 0) throw new Error("Base58 input contains a character outside the Bitcoin Base58 alphabet."); number = number * BigInt(58) + BigInt(digit); }
  const body: number[] = [];
  while (number > BigInt(0)) { body.unshift(Number(number & BigInt(255))); number >>= BigInt(8); }
  return Uint8Array.from([...new Array<number>(zeros).fill(0), ...body]);
}
function encodeQuotedPrintableBytes(bytes: Uint8Array, preserveLineBreakBytes = false): string {
  let output = "", lineLength = 0;
  const add = (token: string) => {
    // Reserve one column for the soft-break marker to keep physical lines <= 76 columns.
    if (lineLength + token.length > 75) { output += "=\r\n"; lineLength = 0; }
    output += token; lineLength += token.length;
  };
  const newline = () => { output += "\r\n"; lineLength = 0; };
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (!preserveLineBreakBytes && byte === 13 && bytes[i + 1] === 10) { newline(); i++; continue; }
    if (!preserveLineBreakBytes && (byte === 10 || byte === 13)) { newline(); continue; }
    const nextIsLineEnd = i + 1 === bytes.length || bytes[i + 1] === 10 || bytes[i + 1] === 13;
    if ((byte >= 33 && byte <= 60) || (byte >= 62 && byte <= 126) || ((byte === 32 || byte === 9) && !nextIsLineEnd)) {
      add(String.fromCharCode(byte));
    } else {
      add("=" + byte.toString(16).toUpperCase().padStart(2, "0"));
    }
  }
  return output;
}
function encodeQuotedPrintable(value: string): string { return encodeQuotedPrintableBytes(utf8(value)); }
function decodeQuotedPrintableBytes(value: string): Uint8Array {
  const bytes: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code === 61) {
      if (value[i + 1] === "\r" && value[i + 2] === "\n") { i += 2; continue; }
      if (value[i + 1] === "\n") { i++; continue; }
      const hex = value.slice(i + 1, i + 3);
      if (!/^[0-9a-f]{2}$/i.test(hex)) throw new Error("Invalid quoted-printable escape; use = followed by two hexadecimal digits.");
      bytes.push(Number.parseInt(hex, 16)); i += 2; continue;
    }
    if (code === 13 && value[i + 1] === "\n") { bytes.push(10); i++; continue; }
    if (code === 10) { bytes.push(10); continue; }
    if (code > 0x7f) throw new Error("Quoted-printable input must be ASCII-encoded; encode non-ASCII bytes as =XX escapes.");
    bytes.push(code);
    if (bytes.length > MAX_ENCODING_FILE_BYTES) throw new Error("Decoded byte output is limited to 2,000,000 bytes.");
  }
  if (bytes.length > MAX_ENCODING_FILE_BYTES) throw new Error("Decoded byte output is limited to 2,000,000 bytes.");
  return Uint8Array.from(bytes);
}
function decodeQuotedPrintable(value: string): string {
  try { return textFrom(decodeQuotedPrintableBytes(value)); }
  catch (error) {
    if (error instanceof Error && /Invalid quoted-printable|Decoded byte output/.test(error.message)) throw error;
    throw new Error("Quoted-printable data does not decode to valid UTF-8 text.");
  }
}
function encodeHex(bytes: Uint8Array): string { return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(""); }
function decodeHex(value: string): Uint8Array {
  const text = value.replace(/0x/gi, "").replace(/[\s:_-]/g, "");
  if (!/^(?:[0-9a-f]{2})*$/i.test(text)) throw new Error("Hex input must contain complete byte pairs of hexadecimal digits.");
  return Uint8Array.from(text.match(/.{2}/g) ?? [], pair => Number.parseInt(pair, 16));
}
function decodeBinary(value: string): Uint8Array {
  const text = value.replace(/[\s_]/g, "");
  if (!/^[01]*$/.test(text) || text.length % 8 !== 0) throw new Error("Binary input must contain complete groups of eight bits.");
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i += 8) bytes.push(Number.parseInt(text.slice(i, i + 8), 2));
  return Uint8Array.from(bytes);
}
export type ByteEncodingMode = "base64" | "base64url" | "base32" | "hex" | "binary" | "base58" | "base85" | "quoted-printable";
export const MAX_ENCODING_FILE_BYTES = 2_000_000;
export const MAX_ENCODING_OUTPUT_LENGTH = 1_000_000;
export function encodeByteRepresentation(mode:ByteEncodingMode,bytes:Uint8Array):string {
 if(bytes.byteLength>MAX_ENCODING_FILE_BYTES)throw new Error("Byte input is limited to 2,000,000 bytes.");
 let output:string;
 switch(mode){
  case "base64":output=base64FromBytes(bytes);break;
  case "base64url":output=base64FromBytes(bytes).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");break;
  case "base32":output=encodeBase32(bytes);break;
  case "quoted-printable":output=encodeQuotedPrintableBytes(bytes,true);break;
  case "hex":output=encodeHex(bytes);break;
  case "binary":output=Array.from(bytes,b=>b.toString(2).padStart(8,"0")).join(" ");break;
  case "base58":output=encodeBase58(bytes);break;
  case "base85":output=encodeAscii85(bytes);break;
  default:throw new Error("Unsupported byte encoding mode.");
 }
 if(output.length>MAX_ENCODING_OUTPUT_LENGTH)throw new Error("Encoded output exceeds the 1,000,000 character limit; use a smaller file or a more compact encoding.");
 return output;
}
export function decodeByteRepresentation(mode:ByteEncodingMode,input:string):Uint8Array {
 if(input.length>MAX_ENCODING_OUTPUT_LENGTH)throw new Error("Encoded input exceeds the 1,000,000 character limit.");
 let bytes:Uint8Array;
 switch(mode){
  case "base64":bytes=bytesFromBase64(input);break;
  case "base64url":bytes=bytesFromBase64(input,true);break;
  case "base32":bytes=decodeBase32(input);break;
  case "quoted-printable":bytes=decodeQuotedPrintableBytes(input);break;
  case "hex":bytes=decodeHex(input);break;
  case "binary":bytes=decodeBinary(input);break;
  case "base58":bytes=decodeBase58(input);break;
  case "base85":bytes=decodeAscii85(input);break;
  default:throw new Error("Unsupported byte encoding mode.");
 }
 if(bytes.byteLength>MAX_ENCODING_FILE_BYTES)throw new Error("Decoded byte output is limited to 2,000,000 bytes.");
 return bytes;
}
function encodeEntities(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function decodeEntities(value: string): string {
  return value.replace(/&([^;]+);/g, (whole, entity: string) => {
    const lower = entity.toLowerCase();
    if (lower === "amp") return "&";
    if (lower === "lt") return "<";
    if (lower === "gt") return ">";
    if (lower === "quot") return '"';
    if (lower === "apos") return "'";
    let code: number | undefined;
    if (/^#\d+$/.test(lower)) code = Number(lower.slice(1));
    else if (/^#x[0-9a-f]+$/.test(lower)) code = Number.parseInt(lower.slice(2), 16);
    if (code !== undefined && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)) return String.fromCodePoint(code);
    throw new Error("Unsupported or invalid HTML entity: &" + entity + ";");
  });
}
function encodeUnicode(value: string): string {
  return Array.from(value, character => {
    const point = character.codePointAt(0)!;
    return point <= 0xffff ? "\\u" + point.toString(16).padStart(4, "0") : "\\u{" + point.toString(16) + "}";
  }).join("");
}
function decodeUnicode(value: string): string {
  if (/\\u(?![0-9a-f]{4}|\{[0-9a-f]{1,6}\})/i.test(value)) throw new Error("Use valid \\uXXXX or \\u{1F600} Unicode escapes.");
  return value.replace(/\\u\{([0-9a-f]{1,6})\}|\\u([0-9a-f]{4})/gi, (_whole, point: string | undefined, unit: string | undefined) => {
    if (unit) return String.fromCharCode(Number.parseInt(unit, 16));
    const code = Number.parseInt(point!, 16);
    if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) throw new Error("Unicode escape is not a valid scalar value.");
    return String.fromCodePoint(code);
  });
}
export type SupportedCharset = "utf-8" | "utf-16le" | "utf-16be" | "windows-1252";
export const SUPPORTED_CHARSETS: { value: SupportedCharset; label: string }[] = [
  { value: "utf-8", label: "UTF-8" },
  { value: "utf-16le", label: "UTF-16 little-endian" },
  { value: "utf-16be", label: "UTF-16 big-endian" },
  { value: "windows-1252", label: "Windows-1252" }
];
function charsetEncoder(value: string, charset: SupportedCharset): Uint8Array {
  if (charset === "utf-8") return new TextEncoder().encode(value);
  if (charset === "utf-16le" || charset === "utf-16be") {
    const bytes = new Uint8Array(value.length * 2);
    for (let i = 0; i < value.length; i++) {
      const unit = value.charCodeAt(i);
      if (charset === "utf-16le") { bytes[i * 2] = unit & 255; bytes[i * 2 + 1] = unit >>> 8; }
      else { bytes[i * 2] = unit >>> 8; bytes[i * 2 + 1] = unit & 255; }
    }
    return bytes;
  }
  const decoder = new TextDecoder("windows-1252");
  const reverse = new Map<string, number>();
  for (let byte = 0; byte < 256; byte++) reverse.set(decoder.decode(Uint8Array.of(byte)), byte);
  const bytes: number[] = [];
  for (const character of value) {
    const byte = reverse.get(character);
    if (byte === undefined) throw new Error("This character cannot be represented in Windows-1252.");
    bytes.push(byte);
  }
  return Uint8Array.from(bytes);
}
export function convertCharset(direction: EncodingDirection, input: string, charset: SupportedCharset): string {
  if (input.length > 1_000_000) throw new Error("Input exceeds the 1,000,000 character safety limit.");
  if (direction === "encode") return encodeHex(charsetEncoder(input, charset));
  const bytes = decodeHex(input);
  try { return new TextDecoder(charset, { fatal: true }).decode(bytes); }
  catch { throw new Error("Bytes are invalid for the selected charset or contain an incomplete code unit."); }
}
export function transformEncoding(mode: EncodingMode, direction: EncodingDirection, input: string): string {
  if (input.length > 1_000_000) throw new Error("Input exceeds the 1,000,000 character safety limit.");
  if (direction === "encode") {
    switch (mode) {
      case "url": return encodeURIComponent(input);
      case "base64": return base64FromBytes(utf8(input));
      case "base64url": return base64FromBytes(utf8(input)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      case "base32": return encodeBase32(utf8(input));
      case "hex": return encodeHex(utf8(input));
      case "binary": return Array.from(utf8(input), b => b.toString(2).padStart(8, "0")).join(" ");
      case "html-entities": return encodeEntities(input);
      case "unicode-escapes": return encodeUnicode(input);
      case "quoted-printable": return encodeQuotedPrintable(input);
      case "base58": return encodeBase58(utf8(input));
      case "base85": return encodeAscii85(utf8(input));
      case "charset": throw new Error("Use the charset converter with an explicit character set.");
    }
  }
  switch (mode) {
    case "url": try { return decodeURIComponent(input); } catch { throw new Error("Invalid percent-encoded URL component."); }
    case "base64": return textFrom(bytesFromBase64(input));
    case "base64url": return textFrom(bytesFromBase64(input, true));
    case "base32": return textFrom(decodeBase32(input));
    case "hex": return textFrom(decodeHex(input));
    case "binary": return textFrom(decodeBinary(input));
    case "html-entities": return decodeEntities(input);
    case "unicode-escapes": return decodeUnicode(input);
    case "quoted-printable": return decodeQuotedPrintable(input);
    case "base58": return textFrom(decodeBase58(input));
    case "base85": return textFrom(decodeAscii85(input));
    case "charset": throw new Error("Use the charset converter with an explicit character set.");
  }
}
