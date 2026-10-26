"use client";

import { useState } from "react";
import { Copy, Hash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { digestBytes, type DigestAlgorithm } from "@/lib/tools/hash";

const algorithms: DigestAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];
const MAX_FILE_BYTES = 32 * 1024 * 1024;

export function HashWorkbench() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<DigestAlgorithm>("SHA-256");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function calculate(bytes: Uint8Array) {
    setBusy(true);
    setError("");
    setResult("");
    try {
      setResult(await digestBytes(bytes, algorithm));
    } catch {
      setError("This browser could not calculate the selected digest. Try a supported modern browser.");
    } finally {
      setBusy(false);
    }
  }

  async function hashText() {
    await calculate(new TextEncoder().encode(input));
  }

  async function hashFile(file?: File) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setResult("");
      setError("Files larger than 32 MiB are not supported to limit browser memory use.");
      return;
    }
    try {
      await calculate(new Uint8Array(await file.arrayBuffer()));
    } catch {
      setResult("");
      setError("Unable to read this file. Choose another file and try again.");
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      setError("Clipboard access was unavailable. Select and copy the digest manually.");
    }
  }

  return <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="text-sm">Digest settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <label className="block text-sm font-medium" htmlFor="hash-algorithm">Algorithm</label>
        <select id="hash-algorithm" value={algorithm} onChange={(event) => { setAlgorithm(event.target.value as DigestAlgorithm); setResult(""); setError(""); }} className="h-10 w-full max-w-sm rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {algorithms.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <label className="block text-sm font-medium" htmlFor="hash-input">Text input (UTF-8)</label>
        <Textarea id="hash-input" value={input} onChange={(event) => setInput(event.target.value)} className="min-h-36" placeholder="Enter text to hash…" />
        <div className="flex flex-wrap gap-2">
          <Button onClick={hashText} disabled={busy}><Hash className="h-4 w-4" /> {busy ? "Calculating…" : "Hash text"}</Button>
          <Button variant="outline" onClick={() => { setInput(""); setResult(""); setError(""); }}><Trash2 className="h-4 w-4" /> Clear</Button>
        </div>
        <div className="border-t border-border pt-4">
          <label className="block text-sm font-medium" htmlFor="hash-file">Or hash a file (maximum 32 MiB)</label>
          <Input id="hash-file" type="file" className="mt-2 max-w-xl" onChange={(event) => void hashFile(event.target.files?.[0])} />
          <p className="mt-2 text-xs text-muted-foreground">Files are read and hashed in this browser. The complete file is loaded into memory.</p>
        </div>
      </CardContent>
    </Card>
    {(result || error) && <Card>
      <CardHeader className="flex-row items-center justify-between gap-3"><CardTitle className="text-sm">Digest result</CardTitle><Button variant="outline" size="sm" disabled={!result} onClick={() => void copyResult()}><Copy className="h-4 w-4" /> Copy</Button></CardHeader>
      <CardContent>
        {result && <code className="block select-text break-all rounded-lg bg-muted/50 p-4 font-mono text-sm" dir="ltr">{result}</code>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>}
    <p className="text-xs text-muted-foreground">Uses the browser Web Crypto API. SHA-256/384/512 are cryptographic hash functions, not encryption. This tool does not provide MD5, SHA-1, HMAC, streaming file hashing, or authenticity verification.</p>
  </div>;
}
