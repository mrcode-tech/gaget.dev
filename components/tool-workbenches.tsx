"use client";

import { useState } from "react";
import { Copy, Download, WandSparkles, AlertCircle, ArrowLeftRight, Trash2, KeyRound, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) void navigator.clipboard.writeText(value);
}
function saveText(filename: string, value: string) {
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
export { JsonWorkbench } from "@/components/json-workbench";

export function UrlWorkbench() {
  const [input, setInput] = useState("https://gaget.dev/search?q=hello world&category=dev tools");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  function run() {
    try {
      setError("");
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch { setError("Unable to decode this value. Check that percent-encoded sequences are valid."); setOutput(""); }
  }
  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2"><Button variant={mode === "encode" ? "default" : "outline"} onClick={() => {setMode("encode");setOutput("");setError("");}}>Encode component</Button><Button variant={mode === "decode" ? "default" : "outline"} onClick={() => {setMode("decode");setOutput("");setError("");}}>Decode component</Button></div>
    <Card><CardHeader><CardTitle className="text-sm">Input</CardTitle></CardHeader><CardContent><Textarea value={input} onChange={(e) => setInput(e.target.value)} aria-label="URL input" className="min-h-36" placeholder="Enter text or URL component…" /><div className="mt-3 flex gap-2"><Button onClick={run}><ArrowLeftRight className="h-4 w-4" /> {mode === "encode" ? "Encode" : "Decode"}</Button><Button variant="outline" onClick={() => {setInput("");setOutput("");setError("");}}>Clear</Button></div></CardContent></Card>
    <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Output</CardTitle><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="Copy output" disabled={!output} onClick={() => copyText(output)}><Copy className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Download output" disabled={!output} onClick={() => saveText("url-output.txt", output)}><Download className="h-4 w-4" /></Button></div></CardHeader><CardContent><pre className="min-h-24 whitespace-pre-wrap break-all rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">{output || <span className="text-muted-foreground">Your result will appear here.</span>}</pre>{error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</CardContent></Card>
    <p className="text-xs text-muted-foreground">This tool encodes or decodes a URI component, not an entire URL structure.</p>
  </div>;
}

export function Base64Workbench() {
  const [input, setInput] = useState("Hello, GaGet.dev! 👋");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  function run() {
    try {
      setError("");
      if (mode === "encode") setOutput(btoa(String.fromCharCode(...new TextEncoder().encode(input))));
      else {
        const binary = atob(input.trim());
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        setOutput(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      }
    } catch { setOutput(""); setError("Invalid Base64 input or unsupported text encoding."); }
  }
  return <div className="space-y-4">
    <div className="flex gap-2"><Button variant={mode === "encode" ? "default" : "outline"} onClick={() => {setMode("encode");setError("");setOutput("");}}>Encode</Button><Button variant={mode === "decode" ? "default" : "outline"} onClick={() => {setMode("decode");setError("");setOutput("");}}>Decode</Button></div>
    <Card><CardHeader><CardTitle className="text-sm">Input text</CardTitle></CardHeader><CardContent><Textarea value={input} onChange={(e) => setInput(e.target.value)} aria-label="Base64 input" className="min-h-36" placeholder="Enter text or Base64…" /><div className="mt-3 flex gap-2"><Button onClick={run}><WandSparkles className="h-4 w-4" /> {mode === "encode" ? "Encode Base64" : "Decode Base64"}</Button><Button variant="outline" onClick={() => {setInput("");setOutput("");setError("");}}><Trash2 className="h-4 w-4" /> Clear</Button></div></CardContent></Card>
    <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Output</CardTitle><Button variant="ghost" size="sm" disabled={!output} onClick={() => copyText(output)}><Copy className="mr-2 h-4 w-4" /> Copy</Button></CardHeader><CardContent><pre className="min-h-24 whitespace-pre-wrap break-all rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">{output || <span className="text-muted-foreground">Your result will appear here.</span>}</pre>{error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</CardContent></Card>
    <p className="text-xs text-muted-foreground">Text encoding uses UTF-8. Base64 is an encoding format, not encryption.</p>
  </div>;
}

type JwtResult = { header: unknown; payload: unknown; expiration?: string; expired?: boolean; warning?: string };
function decodeBase64Url(part: string) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
export function JwtWorkbench() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtResult | null>(null);
  const [error, setError] = useState("");
  function decode() {
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3 || !parts[0] || !parts[1]) throw new Error("A compact JWT should contain three dot-separated segments.");
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      const exp = typeof payload.exp === "number" ? payload.exp : undefined;
      setResult({ header, payload, expiration: exp ? new Date(exp * 1000).toLocaleString() : undefined, expired: exp ? exp * 1000 <= Date.now() : undefined, warning: "Decoded only. The signature has not been verified." });
      setError("");
    } catch (e) { setResult(null); setError(e instanceof Error ? e.message : "Unable to decode token."); }
  }
  return <div className="space-y-4">
    <Card><CardHeader><CardTitle className="text-sm">JWT token</CardTitle></CardHeader><CardContent><Textarea value={token} onChange={(e) => setToken(e.target.value)} aria-label="JWT token input" className="min-h-32 break-all" placeholder="Paste a JWT (header.payload.signature)…" /><div className="mt-3 flex gap-2"><Button onClick={decode}><KeyRoundIcon /> Decode token</Button><Button variant="outline" onClick={() => {setToken("");setResult(null);setError("");}}>Clear</Button></div></CardContent></Card>
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
    {result && <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-300"><AlertCircle className="mr-2 inline h-4 w-4" />{result.warning}</div>
      {result.expiration && <div className={`rounded-lg border p-3 text-sm ${result.expired ? "border-destructive/30 bg-destructive/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>Expiration: <strong>{result.expiration}</strong> — {result.expired ? "expired" : "not expired (based on local clock)"}</div>}
      <div className="grid gap-4 xl:grid-cols-2">{[{title:"Header", data:result.header},{title:"Payload / claims",data:result.payload}].map(({title,data}) => <Card key={title}><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">{title}</CardTitle><Button variant="ghost" size="icon" aria-label={`Copy ${title}`} onClick={() => copyText(JSON.stringify(data,null,2))}><Copy className="h-4 w-4" /></Button></CardHeader><CardContent><pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-4 font-mono text-xs leading-6">{JSON.stringify(data,null,2)}</pre></CardContent></Card>)}</div>
    </div>}
    <p className="text-xs text-muted-foreground">The token is decoded locally. This tool does not validate the signature or establish that the token is authentic.</p>
  </div>;
}
function KeyRoundIcon() { return <span aria-hidden="true"><KeyRound className="h-4 w-4" /></span>; }

export function UuidWorkbench() {
  const [items, setItems] = useState<string[]>([]);
  const [count, setCount] = useState("5");
  function generate() {
    const n = Math.min(100, Math.max(1, Number.parseInt(count, 10) || 1));
    if (!globalThis.crypto?.randomUUID) return;
    setItems(Array.from({length:n}, () => crypto.randomUUID()));
  }
  return <div className="space-y-4">
    <Card><CardHeader><CardTitle className="text-sm">UUID v4 generator</CardTitle></CardHeader><CardContent><label htmlFor="uuid-count" className="mb-2 block text-sm font-medium">Number of UUIDs (1–100)</label><Input id="uuid-count" type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} className="max-w-xs" /><div className="mt-3 flex gap-2"><Button onClick={generate}><Fingerprint className="h-4 w-4" /> Generate UUIDs</Button><Button variant="outline" disabled={!items.length} onClick={() => copyText(items.join("\\n"))}><Copy className="h-4 w-4" /> Copy all</Button></div></CardContent></Card>
    {items.length > 0 && <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Generated values ({items.length})</CardTitle><Button variant="ghost" size="sm" onClick={() => saveText("uuids.txt", items.join("\\n"))}><Download className="mr-2 h-4 w-4" /> Download</Button></CardHeader><CardContent><div className="space-y-2">{items.map((id) => <div key={id} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"><code className="min-w-0 flex-1 break-all text-xs sm:text-sm">{id}</code><Button variant="ghost" size="icon" aria-label={`Copy ${id}`} onClick={() => copyText(id)}><Copy className="h-4 w-4" /></Button></div>)}</div></CardContent></Card>}
    <p className="text-xs text-muted-foreground">UUIDs are generated using the browsers cryptographic randomUUID API.</p>
  </div>;
}
