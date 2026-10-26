"use client";

import { useState } from "react";
import { ArrowLeftRight, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { csvToJson, jsonToCsv, type CsvJsonMode } from "@/lib/tools/csv-json";

export function CsvJsonWorkbench() {
  const [mode, setMode] = useState<CsvJsonMode>("csv-to-json");
  const [input, setInput] = useState('name,city\r\n"Ada Lovelace",London\r\n"Grace Hopper",Arlington');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function run() {
    try {
      setOutput(mode === "csv-to-json" ? csvToJson(input) : jsonToCsv(input));
      setError("");
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : "Unable to convert this input.");
    }
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Conversion direction">
      <Button variant={mode === "csv-to-json" ? "default" : "outline"} onClick={() => { setMode("csv-to-json"); setInput('name,city\r\n"Ada Lovelace",London\r\n"Grace Hopper",Arlington'); setOutput(""); setError(""); }}>CSV to JSON</Button>
      <Button variant={mode === "json-to-csv" ? "default" : "outline"} onClick={() => { setMode("json-to-csv"); setInput('[\n  { "name": "Ada Lovelace", "city": "London" },\n  { "name": "Grace Hopper", "city": "Arlington" }\n]'); setOutput(""); setError(""); }}>JSON to CSV</Button>
    </div>
    <Card>
      <CardHeader><CardTitle className="text-sm">{mode === "csv-to-json" ? "CSV input" : "JSON input"}</CardTitle></CardHeader>
      <CardContent>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label={mode === "csv-to-json" ? "CSV input" : "JSON input"} className="min-h-48" placeholder={mode === "csv-to-json" ? "Paste CSV with a header row…" : "Paste an array of JSON objects…"} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={run}><ArrowLeftRight className="h-4 w-4" /> Convert</Button>
          <Button variant="outline" onClick={() => { setInput(""); setOutput(""); setError(""); }}><Trash2 className="h-4 w-4" /> Clear</Button>
        </div>
      </CardContent>
    </Card>
    {(output || error) && <Card>
      <CardHeader className="flex-row items-center justify-between gap-3"><CardTitle className="text-sm">{mode === "csv-to-json" ? "JSON output" : "CSV output"}</CardTitle><Button variant="ghost" size="sm" disabled={!output} onClick={() => void navigator.clipboard.writeText(output).catch(() => setError("Clipboard access is unavailable; select and copy the result manually."))}><Copy className="h-4 w-4" /> Copy</Button></CardHeader>
      <CardContent>
        {output && <pre dir="ltr" className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">{output}</pre>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>}
    <p className="text-xs text-muted-foreground">CSV headers must be unique. CSV values remain strings when converted to JSON; JSON null/undefined values become empty CSV fields, and nested objects or arrays are rejected to avoid silent data loss. Only scalar JSON values are supported.</p>
  </div>;
}
