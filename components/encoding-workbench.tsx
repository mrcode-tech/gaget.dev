"use client";
import { useState } from "react";
import { ArrowLeftRight, Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transformEncoding, convertCharset, encodeByteRepresentation, decodeByteRepresentation, MAX_ENCODING_FILE_BYTES, SUPPORTED_CHARSETS, type EncodingMode, type SupportedCharset, type ByteEncodingMode } from "@/lib/tools/encoding-operations";
const modes: { value: EncodingMode; label: string }[] = [
  { value: "url", label: "URL component" }, { value: "base64", label: "Base64" }, { value: "base64url", label: "Base64url" },
  { value: "base32", label: "Base32" }, { value: "hex", label: "Hexadecimal" }, { value: "binary", label: "Binary bytes" },
  { value: "html-entities", label: "HTML entities" }, { value: "unicode-escapes", label: "Unicode escapes" }, { value: "quoted-printable", label: "Quoted-printable" }, { value: "charset", label: "Charset converter" }, { value: "base58", label: "Base58" }, { value: "base85", label: "ASCII85 (Adobe)" }
];
const byteModes: ByteEncodingMode[] = ["base64","base64url","base32","hex","binary","base58","base85","quoted-printable"];
const notes: Record<EncodingMode, string> = {
  url: "Encodes a URI component, not a complete URL structure.",
  base64: "Uses standard Base64 padding; text input is UTF-8 and selected files are encoded as raw bytes. Base64 is encoding, not encryption.",
  base64url: "Uses the URL-safe Base64 alphabet and omits padding on encode; text uses UTF-8 and selected files use raw bytes.",
  base32: "Uses the RFC 4648 Base32 alphabet with standard padding; text uses UTF-8 and selected files use raw bytes.",
  hex: "Converts UTF-8 text or selected file bytes to hexadecimal. Decoding requires complete byte pairs.",
  binary: "Displays UTF-8 text bytes or selected file bytes as eight-bit groups. Decoding requires complete byte groups.",
  "html-entities": "Supports the five basic named entities plus decimal and hexadecimal numeric entities. Decoded markup is displayed as text only.",
  "unicode-escapes": "Uses \\uXXXX escapes for BMP characters and \\u{...} escapes for supplementary code points.",
  "quoted-printable": "Encodes UTF-8 text or arbitrary file bytes for MIME-style transport; file mode escapes raw line breaks to preserve bytes. Text decoding normalizes line endings to LF.",
  charset: "Convert text to UTF-8, UTF-16LE, UTF-16BE or Windows-1252 bytes (shown as hex), decode hex bytes, or decode a selected file using the chosen charset.",
  base58: "Uses the Bitcoin Base58 alphabet; leading zero bytes are preserved. This is encoding, not encryption.",
  base85: "Uses Adobe ASCII85 with <~ ~> wrappers and the z shorthand; this is not the same as every Base85 variant."
};
export function EncodingWorkbench({ initialMode = "url" }: { initialMode?: EncodingMode }) {
  const [mode, setMode] = useState<EncodingMode>(initialMode);
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [charset, setCharset] = useState<SupportedCharset>("utf-8");
  const [input, setInput] = useState(initialMode === "base64" ? "Hello, GaGet.dev! 👋" : "Hello, GaGet.dev! 👋");
  const [output, setOutput] = useState("");
  const [fileBytes,setFileBytes]=useState<Uint8Array|null>(null);
  const [fileName,setFileName]=useState("");
  const [fileInputKey,setFileInputKey]=useState(0);
  const [decodedBytes,setDecodedBytes]=useState<Uint8Array|null>(null);
  const [error, setError] = useState("");
  function changeMode(value: string) { setMode(value as EncodingMode); setFileBytes(null); setFileName(""); setFileInputKey(v=>v+1); setDecodedBytes(null); setOutput(""); setError(""); }
  function run() { try {
    setDecodedBytes(null);
    if (mode === "charset" && direction === "decode" && fileBytes) {
      setOutput(new TextDecoder(charset, { fatal: true }).decode(fileBytes));
    } else if (byteModes.includes(mode as ByteEncodingMode)) {
      const byteMode=mode as ByteEncodingMode;
      if(direction==="encode") setOutput(encodeByteRepresentation(byteMode,fileBytes??new TextEncoder().encode(input)));
      else {
        const encodedInput=fileBytes?new TextDecoder("utf-8",{fatal:true}).decode(fileBytes):input;
        const bytes=decodeByteRepresentation(byteMode,encodedInput);
        if(fileBytes){setDecodedBytes(bytes);setOutput("Decoded "+bytes.length.toLocaleString()+" bytes from "+fileName+". Download the decoded bytes.");}
        else {setDecodedBytes(bytes);try{setOutput(new TextDecoder("utf-8",{fatal:true}).decode(bytes));}catch{setOutput("Decoded "+bytes.length.toLocaleString()+" bytes; output is not valid UTF-8. Download the bytes.");}}
      }
    } else setOutput(mode === "charset" ? convertCharset(direction, input, charset) : transformEncoding(mode, direction, input));
    setError("");
  } catch (cause) { setOutput(""); setDecodedBytes(null); setError(cause instanceof Error ? cause.message : "Unable to process this input."); } }
  async function copyOutput() { try { await navigator.clipboard.writeText(output); } catch { setError("Clipboard access is unavailable. Select and copy the output manually."); } }
  function downloadOutput() { const blob=decodedBytes?new Blob([decodedBytes.buffer.slice(decodedBytes.byteOffset,decodedBytes.byteOffset+decodedBytes.byteLength) as ArrayBuffer],{type:"application/octet-stream"}):new Blob([output],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=decodedBytes?"decoded-"+(fileName.replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,80)||mode)+".bin":mode+"-output.txt";a.click();URL.revokeObjectURL(url); }
  return <section className="space-y-4" aria-label="Encoding and decoding workbench">
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="space-y-1 text-sm font-medium">Operation
        <Select value={mode} onValueChange={changeMode}><SelectTrigger aria-label="Encoding operation" className="w-full"><SelectValue placeholder="Choose operation" /></SelectTrigger><SelectContent>{modes.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
      </label>
      <div className="flex items-end gap-2"><Button type="button" variant={direction === "encode" ? "default" : "outline"} onClick={() => {setDirection("encode");if(mode==="charset"){setFileBytes(null);setFileName("");setFileInputKey(v=>v+1);}setDecodedBytes(null);setOutput("");setError("");}}>Encode mode</Button><Button type="button" variant={direction === "decode" ? "default" : "outline"} onClick={() => {setDirection("decode");setDecodedBytes(null);setOutput("");setError("");}}>Decode mode</Button></div>
    </div>
    {mode === "charset" && <label className="block max-w-sm space-y-1 text-sm font-medium">Character set<Select value={charset} onValueChange={value => {setCharset(value as SupportedCharset);setOutput("");setError("");}}><SelectTrigger aria-label="Character set" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{SUPPORTED_CHARSETS.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></label>}
    <div className="grid gap-4 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-sm">{mode === "charset" && direction === "decode" ? "Input bytes (hex)" : "Input text"}</CardTitle></CardHeader><CardContent>{(byteModes.includes(mode as ByteEncodingMode)||(mode==="charset"&&direction==="decode"))&&<div className="mb-3 space-y-2 rounded-lg border border-dashed p-3"><label className="block text-sm font-medium">Optional local file (maximum 2 MB)<input key={fileInputKey} type="file" className="mt-2 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground" aria-label={mode==="charset"?"Choose file to decode with selected charset":"Choose encoding file"} onChange={async e=>{const file=e.target.files?.[0];if(!file){setFileBytes(null);setFileName("");return;}if(file.size>MAX_ENCODING_FILE_BYTES){setFileBytes(null);setFileName("");setError("File input is limited to 2,000,000 bytes.");setFileInputKey(v=>v+1);return;}setFileBytes(new Uint8Array(await file.arrayBuffer()));setFileName(file.name);setDecodedBytes(null);setOutput("");setError("");}}/></label>{fileBytes&&<div className="text-xs text-muted-foreground">Using {fileName} ({fileBytes.byteLength.toLocaleString()} bytes). {direction==="encode"?"Raw file bytes will be encoded.":"The selected file must contain UTF-8 text in the selected encoding; decoded bytes can be downloaded."}<Button type="button" variant="link" className="h-auto p-0 pl-1" onClick={()=>{setFileBytes(null);setFileName("");setFileInputKey(v=>v+1);setDecodedBytes(null);setOutput("");}}>Use text input</Button></div>}</div>}
      <Textarea value={input} disabled={!!fileBytes} onChange={e=>{setInput(e.target.value);if(fileBytes){setFileBytes(null);setFileName("");setFileInputKey(v=>v+1);}setDecodedBytes(null);}} aria-label="Encoding input" className="min-h-64 font-mono text-xs leading-6" placeholder={fileBytes?"A file is selected; clear it to use text input":mode === "charset" && direction === "decode" ? "Enter hexadecimal bytes, e.g. 48656c6c6f…" : "Enter text or encoded data…"} spellCheck={false}/><div className="mt-3 flex flex-wrap gap-2"><Button onClick={run}><ArrowLeftRight className="h-4 w-4"/>{direction === "encode" ? "Encode" : "Decode"}</Button><Button variant="outline" onClick={() => {setInput("");setFileBytes(null);setFileName("");setFileInputKey(v=>v+1);setDecodedBytes(null);setOutput("");setError("");}}><Trash2 className="h-4 w-4"/> Clear</Button></div></CardContent></Card>
      <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Output</CardTitle><div className="flex gap-1"><Button type="button" variant="ghost" size="icon" aria-label="Copy encoding output" disabled={!output} onClick={copyOutput}><Copy className="h-4 w-4"/></Button><Button type="button" variant="ghost" size="icon" aria-label="Download encoding output or decoded bytes" disabled={!output} onClick={downloadOutput}><Download className="h-4 w-4"/></Button></div></CardHeader><CardContent><Textarea readOnly value={output} aria-label="Encoding output" className="min-h-64 font-mono text-xs leading-6" placeholder="Your result will appear here." />{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</CardContent></Card>
    </div>
    <p className="text-xs leading-5 text-muted-foreground">{notes[mode]} {byteModes.includes(mode as ByteEncodingMode)?"Text or local file bytes are supported; decoded binary results can be downloaded. File input is capped at 2 MB and encoded output at 1,000,000 characters. During decode, Download saves raw decoded bytes even when they are valid UTF-8 text.":"Input stays in this browser tab and is not saved."} No network requests are made.</p>
  </section>;
}
