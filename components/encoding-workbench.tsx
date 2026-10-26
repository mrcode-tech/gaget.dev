"use client";
import { useState } from "react";
import { ArrowLeftRight, Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transformEncoding, type EncodingMode } from "@/lib/tools/encoding-operations";
const modes: { value: EncodingMode; label: string }[] = [
  { value: "url", label: "URL component" }, { value: "base64", label: "Base64" }, { value: "base64url", label: "Base64url" },
  { value: "base32", label: "Base32" }, { value: "hex", label: "Hexadecimal" }, { value: "binary", label: "Binary bytes" },
  { value: "html-entities", label: "HTML entities" }, { value: "unicode-escapes", label: "Unicode escapes" }
];
const notes: Record<EncodingMode, string> = {
  url: "Encodes a URI component, not a complete URL structure.",
  base64: "Uses UTF-8 text and standard Base64 padding. Base64 is encoding, not encryption.",
  base64url: "Uses the URL-safe Base64 alphabet and omits padding on encode.",
  base32: "Uses the RFC 4648 Base32 alphabet with standard padding.",
  hex: "Converts UTF-8 text to hexadecimal bytes. Decoding requires complete byte pairs.",
  binary: "Displays each UTF-8 byte as eight bits. Decoding requires complete byte groups.",
  "html-entities": "Supports the five basic named entities plus decimal and hexadecimal numeric entities. Decoded markup is displayed as text only.",
  "unicode-escapes": "Uses \\uXXXX escapes for BMP characters and \\u{...} escapes for supplementary code points."
};
export function EncodingWorkbench({ initialMode = "url" }: { initialMode?: EncodingMode }) {
  const [mode, setMode] = useState<EncodingMode>(initialMode);
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(initialMode === "base64" ? "Hello, GaGet.dev! 👋" : "Hello, GaGet.dev! 👋");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function changeMode(value: string) { setMode(value as EncodingMode); setOutput(""); setError(""); }
  function run() { try { setOutput(transformEncoding(mode, direction, input)); setError(""); } catch (cause) { setOutput(""); setError(cause instanceof Error ? cause.message : "Unable to process this input."); } }
  async function copyOutput() { try { await navigator.clipboard.writeText(output); } catch { setError("Clipboard access is unavailable. Select and copy the output manually."); } }
  function downloadOutput() { const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = mode + "-output.txt"; a.click(); URL.revokeObjectURL(url); }
  return <section className="space-y-4" aria-label="Encoding and decoding workbench">
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="space-y-1 text-sm font-medium">Operation
        <Select value={mode} onValueChange={changeMode}><SelectTrigger aria-label="Encoding operation" className="w-full"><SelectValue placeholder="Choose operation" /></SelectTrigger><SelectContent>{modes.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
      </label>
      <div className="flex items-end gap-2"><Button type="button" variant={direction === "encode" ? "default" : "outline"} onClick={() => {setDirection("encode");setOutput("");setError("");}}>Encode</Button><Button type="button" variant={direction === "decode" ? "default" : "outline"} onClick={() => {setDirection("decode");setOutput("");setError("");}}>Decode</Button></div>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-sm">Input text</CardTitle></CardHeader><CardContent><Textarea value={input} onChange={e => setInput(e.target.value)} aria-label="Encoding input" className="min-h-64 font-mono text-xs leading-6" placeholder="Enter text or encoded data…" spellCheck={false}/><div className="mt-3 flex flex-wrap gap-2"><Button onClick={run}><ArrowLeftRight className="h-4 w-4"/>{direction === "encode" ? "Encode" : "Decode"}</Button><Button variant="outline" onClick={() => {setInput("");setOutput("");setError("");}}><Trash2 className="h-4 w-4"/> Clear</Button></div></CardContent></Card>
      <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Output</CardTitle><div className="flex gap-1"><Button type="button" variant="ghost" size="icon" aria-label="Copy encoding output" disabled={!output} onClick={copyOutput}><Copy className="h-4 w-4"/></Button><Button type="button" variant="ghost" size="icon" aria-label="Download encoding output" disabled={!output} onClick={downloadOutput}><Download className="h-4 w-4"/></Button></div></CardHeader><CardContent><Textarea readOnly value={output} aria-label="Encoding output" className="min-h-64 font-mono text-xs leading-6" placeholder="Your result will appear here." />{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</CardContent></Card>
    </div>
    <p className="text-xs leading-5 text-muted-foreground">{notes[mode]} Input stays in this browser tab and is not saved. This workbench currently processes text, not arbitrary files or binary attachments.</p>
  </section>;
}
