"use client";
import { useState } from "react";
import { runRegexInWorker } from "@/lib/tools/regex-worker-client";
import { Copy, Download, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transformText, type TextOperation } from "@/lib/tools/text-operations";
const operations: Array<{ value: TextOperation; label: string }> = [
  { value: "regex-test", label: "Regex test" }, { value: "regex-replace", label: "Regex replace" }, { value: "find-replace", label: "Find and replace" },
  { value: "split-join", label: "Split and join" }, { value: "trim", label: "Trim whitespace" }, { value: "sort-dedupe", label: "Sort and deduplicate lines" },
  { value: "case", label: "Change case" }, { value: "normalize", label: "Unicode normalization" }, { value: "escape", label: "Escape text" },
  { value: "statistics", label: "Text statistics" }, { value: "diff", label: "Compare text" }
];
const notes: Record<TextOperation, string> = {
  "regex-test": "Reports up to 500 matches, indexes and captures. Regex input is limited to 50,000 characters and runs in a worker terminated after 1 second.",
  "regex-replace": "Shows a replacement preview without changing the source input. Regex input is limited to 50,000 characters and runs in a worker terminated after 1 second.",
  "find-replace": "Literal replacement is the default. Regex mode runs in a worker with a 1-second termination limit; invalid patterns leave the source unchanged.",
  "split-join": "Splits on the exact delimiter and joins segments with line feeds; empty delimiters are rejected.",
  trim: "Trim uses JavaScript Unicode whitespace behavior. Choose both ends, leading whitespace, or trailing whitespace.",
  "sort-dedupe": "Sorts lines by deterministic code-unit order and removes exact duplicate lines.",
  case: "Case conversion follows JavaScript Unicode case mapping; title case is a simple word-boundary transformation.",
  normalize: "Unicode normalization can change code-point sequences while preserving canonical or compatibility equivalence.",
  escape: "Escaped output is displayed as text and is never rendered as active markup.",
  statistics: "Counts Unicode code points, whitespace-delimited words, logical lines, and UTF-8 bytes. These are distinct counting models.",
  diff: "Shows a bounded line-oriented diff. Each side is limited to 500 lines and the comparison matrix is capped."
};
export function TextRegexWorkbench() {
  const [operation, setOperation] = useState<TextOperation>("regex-test");
  const [input, setInput] = useState("Hello world\nhello GaGet.dev"), [secondInput, setSecondInput] = useState("Hello world\nhello GaGet");
  const [pattern, setPattern] = useState("\\w+"), [flags, setFlags] = useState("gi"), [replacement, setReplacement] = useState("$&");
  const [delimiter, setDelimiter] = useState(","), [caseMode, setCaseMode] = useState("upper"), [normalizeForm, setNormalizeForm] = useState("NFC");
  const [trimMode, setTrimMode] = useState("both"), [escapeMode, setEscapeMode] = useState("html"), [regexFind, setRegexFind] = useState(false);
  const [output, setOutput] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  function changeOperation(value: string) { setOperation(value as TextOperation); setOutput(""); setError(""); }
  async function run() {
    setBusy(true);setError("");setOutput("");
    const options={pattern,flags,replacement,delimiter,caseMode:caseMode as "upper"|"lower"|"title",normalizeForm:normalizeForm as "NFC"|"NFD"|"NFKC"|"NFKD",trimMode:trimMode as "both"|"start"|"end",escapeMode:escapeMode as "html"|"json",secondInput,regexFind};
    try {
      const result=regexMode?await runRegexInWorker({operation:operation as "regex-test"|"regex-replace"|"find-replace",input,options}):transformText(operation,input,options);
      setOutput(result);setError("");
    } catch(cause) {setOutput("");setError(cause instanceof Error?cause.message:"Unable to process this input.");}
    finally {setBusy(false);}
  }
  async function copyOutput() { try { await navigator.clipboard.writeText(output); } catch { setError("Clipboard access is unavailable. Select and copy the output manually."); } }
  function downloadOutput() { const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "text-workbench-output.txt"; anchor.click(); URL.revokeObjectURL(url); }
  const regexMode = operation === "regex-test" || operation === "regex-replace" || (operation === "find-replace" && regexFind);
  const findMode = operation === "find-replace";
  return <section className="space-y-4" aria-label="Text and regular expressions workbench">
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="space-y-1 text-sm font-medium">Operation
        <Select value={operation} onValueChange={changeOperation} disabled={busy}><SelectTrigger aria-label="Text operation" className="w-full"><SelectValue placeholder="Choose operation" /></SelectTrigger><SelectContent>{operations.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
      </label>
      {regexMode && <div className="grid gap-2 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Pattern<Input aria-label="Regular expression pattern" value={pattern} disabled={busy} onChange={event => setPattern(event.target.value)} /></label><label className="space-y-1 text-sm font-medium">Flags<Input aria-label="Regular expression flags" value={flags} disabled={busy} onChange={event => setFlags(event.target.value)} /></label></div>}
    </div>
    {findMode && <div className="flex flex-wrap items-end gap-3">{!regexFind && <label className="space-y-1 text-sm font-medium">Text to find<Input aria-label="Text to find" value={pattern} onChange={event => setPattern(event.target.value)} /></label>}<label className="space-y-1 text-sm font-medium">Replacement<Input aria-label="Replacement text" value={replacement} disabled={busy} onChange={event => setReplacement(event.target.value)} /></label><Button type="button" variant={regexFind ? "default" : "outline"} aria-pressed={regexFind} disabled={busy} onClick={() => setRegexFind(value => !value)}>{regexFind ? "Regex mode" : "Literal mode"}</Button></div>}
    {operation === "regex-replace" && <label className="space-y-1 text-sm font-medium">Replacement<Input aria-label="Regex replacement text" value={replacement} disabled={busy} onChange={event => setReplacement(event.target.value)} /></label>}
    {operation === "split-join" && <label className="space-y-1 text-sm font-medium">Delimiter<Input aria-label="Split delimiter" value={delimiter} disabled={busy} onChange={event => setDelimiter(event.target.value)} /></label>}
    {operation === "case" && <label className="space-y-1 text-sm font-medium">Case style<Select value={caseMode} onValueChange={setCaseMode} disabled={busy}><SelectTrigger aria-label="Case style"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="upper">UPPERCASE</SelectItem><SelectItem value="lower">lowercase</SelectItem><SelectItem value="title">Title Case</SelectItem></SelectContent></Select></label>}
    {operation === "normalize" && <label className="space-y-1 text-sm font-medium">Normalization form<Select value={normalizeForm} onValueChange={setNormalizeForm} disabled={busy}><SelectTrigger aria-label="Normalization form"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NFC">NFC</SelectItem><SelectItem value="NFD">NFD</SelectItem><SelectItem value="NFKC">NFKC</SelectItem><SelectItem value="NFKD">NFKD</SelectItem></SelectContent></Select></label>}
    {operation === "trim" && <label className="space-y-1 text-sm font-medium">Trim direction<Select value={trimMode} onValueChange={setTrimMode} disabled={busy}><SelectTrigger aria-label="Trim direction"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="both">Both ends</SelectItem><SelectItem value="start">Leading only</SelectItem><SelectItem value="end">Trailing only</SelectItem></SelectContent></Select></label>}
    {operation === "escape" && <label className="space-y-1 text-sm font-medium">Escape format<Select value={escapeMode} onValueChange={setEscapeMode} disabled={busy}><SelectTrigger aria-label="Escape format"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="html">HTML entities</SelectItem><SelectItem value="json">JSON string content</SelectItem></SelectContent></Select></label>}
    <div className="grid gap-4 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-sm">Input text</CardTitle></CardHeader><CardContent><Textarea value={input} disabled={busy} onChange={event => setInput(event.target.value)} aria-label="Text input" className="min-h-64 font-mono text-xs leading-6" placeholder="Enter text…" spellCheck={false}/>
        {operation === "diff" && <label className="mt-4 block space-y-1 text-sm font-medium">Compare with<Textarea value={secondInput} disabled={busy} onChange={event => setSecondInput(event.target.value)} aria-label="Comparison text input" className="min-h-40 font-mono text-xs leading-6" placeholder="Enter comparison text…" spellCheck={false}/></label>}
        <div className="mt-3 flex flex-wrap gap-2"><Button type="button" onClick={run} disabled={busy}><Play className="h-4 w-4"/>{busy?"Processing…":"Process"}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => {setInput("");setSecondInput("");setOutput("");setError("");}}><Trash2 className="h-4 w-4"/>Clear</Button></div>
      </CardContent></Card>
      <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Output</CardTitle><div className="flex gap-1"><Button type="button" variant="ghost" size="icon" aria-label="Copy text output" disabled={!output} onClick={copyOutput}><Copy className="h-4 w-4"/></Button><Button type="button" variant="ghost" size="icon" aria-label="Download text output" disabled={!output} onClick={downloadOutput}><Download className="h-4 w-4"/></Button></div></CardHeader><CardContent><Textarea readOnly value={output} aria-label="Text output" className="min-h-64 font-mono text-xs leading-6" placeholder="Your result will appear here." />{error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}</CardContent></Card>
    </div>
    <p className="text-xs leading-5 text-muted-foreground">{notes[operation]} Input stays in this browser tab and is not saved. Output is shown as text only.</p>
  </section>;
}
