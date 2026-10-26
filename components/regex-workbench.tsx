"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REGEX_INPUT_LIMIT, REGEX_PATTERN_LIMIT } from "@/lib/tools/regex";

type Match = { index: number; match: string; captures: Array<string | undefined> };

const workerSource = `
self.onmessage = (event) => {
  const { pattern, flags, input } = event.data;
  try {
    const expression = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const matches = [];
    let match;
    while ((match = expression.exec(input)) !== null) {
      if (matches.length >= 1000) throw new Error("More than 1,000 matches were found. Refine the pattern or input.");
      matches.push({ index: match.index, match: match[0], captures: match.slice(1) });
      if (match[0] === "") {
        const point = input.codePointAt(expression.lastIndex);
        expression.lastIndex += point === undefined ? 1 : point > 65535 ? 2 : 1;
      }
    }
    self.postMessage({ matches });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "Could not evaluate this pattern." });
  }
};
`;

export function RegexWorkbench() {
  const [pattern, setPattern] = useState("(\\w+):(\\d+)");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("port:8080\nhost:443\nretry:3");
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    workerRef.current?.terminate();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  function run() {
    workerRef.current?.terminate();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMatches([]);
    setError("");
    setStatus("");
    if (pattern.length > REGEX_PATTERN_LIMIT) { setError("Pattern is too long (maximum 2,000 characters)."); return; }
    if (input.length > REGEX_INPUT_LIMIT) { setError("Input is too large (maximum 256 KiB)."); return; }
    if ([...flags].some((flag) => !"dgimsuvy".includes(flag)) || new Set(flags).size !== flags.length || (flags.includes("u") && flags.includes("v"))) {
      setError("Use valid, non-repeated JavaScript regular-expression flags. The u and v flags cannot be combined."); return;
    }
    try { new RegExp(pattern, flags); } catch (cause) { setError(cause instanceof Error ? cause.message : "Invalid regular expression."); return; }

    let worker: Worker;
    let url: string;
    try {
      url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
      worker = new Worker(url);
      URL.revokeObjectURL(url);
    } catch {
      setError("This browser blocks the isolated regular-expression worker; no pattern was executed.");
      return;
    }
    workerRef.current = worker;
    setBusy(true);
    worker.onmessage = (event: MessageEvent<{ matches?: Match[]; error?: string }>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setBusy(false);
      if (event.data.error) { setError(event.data.error); return; }
      setMatches(event.data.matches ?? []);
      setStatus(`${event.data.matches?.length ?? 0} match(es) found.`);
    };
    worker.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setBusy(false);
      setError("The pattern could not be evaluated in the isolated worker.");
    };
    timeoutRef.current = setTimeout(() => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      setBusy(false);
      setError("Pattern evaluation exceeded 300 ms and was stopped. Simplify the pattern or shorten the input.");
    }, 300);
    worker.postMessage({ pattern, flags, input });
  }

  async function copyMatches() {
    try { await navigator.clipboard.writeText(matches.map((item) => `${item.index}: ${JSON.stringify(item.match)}`).join("\\n")); }
    catch { setError("Clipboard access is unavailable. Select and copy the results manually."); }
  }

  return <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="text-sm">Regular expression</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <label htmlFor="regex-pattern" className="block text-sm font-medium">Pattern</label>
        <Input id="regex-pattern" value={pattern} maxLength={REGEX_PATTERN_LIMIT} onChange={(event) => setPattern(event.target.value)} dir="ltr" className="font-mono" />
        <label htmlFor="regex-flags" className="block text-sm font-medium">Flags</label>
        <Input id="regex-flags" value={flags} maxLength={8} onChange={(event) => setFlags(event.target.value)} dir="ltr" className="max-w-32 font-mono" aria-describedby="regex-flags-help" />
        <p id="regex-flags-help" className="text-xs text-muted-foreground">JavaScript flags: d, g, i, m, s, u, v, y. Global matching is enabled automatically to list all matches.</p>
        <label htmlFor="regex-input" className="block text-sm font-medium">Test text (maximum 256 KiB)</label>
        <Textarea id="regex-input" value={input} maxLength={REGEX_INPUT_LIMIT} onChange={(event) => setInput(event.target.value)} dir="ltr" className="min-h-40 font-mono" />
        <div className="flex flex-wrap gap-2">
          <Button onClick={run} disabled={busy}><Play className="h-4 w-4" /> {busy ? "Testing…" : "Test pattern"}</Button>
          <Button variant="outline" onClick={() => { workerRef.current?.terminate(); workerRef.current = null; if (timeoutRef.current) clearTimeout(timeoutRef.current); setPattern(""); setFlags("g"); setInput(""); setMatches([]); setError(""); setStatus(""); setBusy(false); }}><Trash2 className="h-4 w-4" /> Clear</Button>
        </div>
      </CardContent>
    </Card>
    {(status || error || matches.length > 0) && <Card>
      <CardHeader className="flex-row items-center justify-between gap-3"><CardTitle className="text-sm">Results</CardTitle><Button variant="outline" size="sm" disabled={!matches.length} onClick={() => void copyMatches()}><Copy className="h-4 w-4" /> Copy matches</Button></CardHeader>
      <CardContent className="space-y-3">
        {status && <p role="status" className="text-sm">{status}</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {matches.length > 0 && <ol className="max-h-96 space-y-2 overflow-auto">
          {matches.map((item, index) => <li key={index} className="rounded-lg border border-border p-3 text-sm">
            <div className="font-mono break-all" dir="ltr"><span className="text-muted-foreground">Index {item.index}:</span> {JSON.stringify(item.match)}</div>
            {item.captures.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Captures: <code dir="ltr">{JSON.stringify(item.captures)}</code></p>}
          </li>)}
        </ol>}
      </CardContent>
    </Card>}
    <p className="text-xs text-muted-foreground">Runs locally in an isolated browser worker with a 300 ms execution limit. Patterns use JavaScript RegExp semantics, not every engine's syntax. Pattern length, input size, and result count are bounded.</p>
  </div>;
}
