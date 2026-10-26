"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { AlertCircle, Check, Copy, Download, FileUp, Menu, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";
import { FeatureMenuNoResults, FeatureMenuSearch } from "@/components/feature-menu-search";
import { useFeatureMenuSearch } from "@/lib/feature-menu-search";
import {
  compareJsonDocuments,
  diagnoseJson,
  escapeJsonStringContents,
  sortJsonKeys,
  unescapeJsonStringContents,
  type JsonDiagnostic,
  type JsonDifference,
} from "@/lib/tools/json-workspace";

const sampleJson = '{\n  "name": "GaGet.dev",\n  "version": "1.0.0",\n  "features": ["format", "validate", "compare"],\n  "privacyFirst": true\n}';
const sampleCompareJson = '{\n  "name": "GaGet.dev",\n  "version": "1.1.0",\n  "features": ["format", "validate", "compare"],\n  "privacyFirst": true\n}';
export type JsonOperation = "format" | "minify" | "validate" | "compare" | "sort" | "tree" | "find" | "escape" | "unescape";
type JsonResultPresentation = "output" | "diagnostics" | "comparison" | "tree" | "search";
const resultPresentationByOperation: Record<JsonOperation, JsonResultPresentation> = {
  format: "output",
  minify: "output",
  validate: "diagnostics",
  compare: "comparison",
  sort: "output",
  tree: "tree",
  find: "search",
  escape: "output",
  unescape: "output",
};
type Snapshot = { input: string; compareInput: string };
type LocatedDiagnostic = JsonDiagnostic & { source: "input" | "compare" };
type FindMatch = { path: string; kind: "key" | "value"; value: string };
const treeMarkers = { depth: Symbol("tree-depth"), nodes: Symbol("tree-nodes"), items: Symbol("tree-items"), properties: Symbol("tree-properties") };

function localizeDiagnosticMessage(message: string, translate: (key: string) => string): string {
  if (message.startsWith("The JSON document is empty")) return translate("json.emptyDiagnostic");
  if (message.includes("quoted JSON string") || message.includes("quoted property name")) return translate("json.expectedString");
  if (message.includes("Unterminated JSON string")) return translate("json.unterminatedString");
  if (message.includes("escape sequence") || message.includes("Unicode escape") || message.includes("control character")) return translate("json.invalidEscape");
  if (message.includes("Leading zeroes")) return translate("json.leadingZero");
  if (message.includes("Expected a digit") || message.includes("Expected a JSON value") || message.includes("Invalid JSON literal")) return translate("json.expectedValue");
  if (message.includes('Expected ":"')) return translate("json.expectedColon");
  if (message.includes('Expected ","')) return translate("json.expectedDelimiter");
  if (message.includes("Trailing commas")) return translate("json.trailingComma");
  if (message.includes("Unterminated JSON object") || message.includes("Unterminated JSON array")) return translate("json.unterminatedContainer");
  if (message.includes("Unexpected content after")) return translate("json.trailingContent");
  if (message.includes("nesting depth")) return translate("json.nestingLimit");
  return translate("json.syntaxError");
}

function snapshot(input: string, compareInput: string): Snapshot { return { input, compareInput }; }

function LineNumberEditor({
  label, value, onChange, textareaRef, invalid, onKeyDown,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  invalid?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const { t } = useI18n();
  const gutterRef = useRef<HTMLPreElement>(null);
  const lineCount = Math.max(1, value.split("\n").length);
  return <div dir="ltr" className="grid min-h-[300px] min-w-0 grid-cols-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-background focus-within:ring-2 focus-within:ring-ring/40">
    <pre data-testid="json-line-numbers" aria-hidden="true" ref={gutterRef} className="min-h-[300px] select-none overflow-hidden border-e border-border bg-muted/40 px-2 py-3 text-right font-mono text-[13px] leading-6 text-muted-foreground sm:px-3">{Array.from({ length: lineCount }, (_, index) => String(index + 1)).join("\n")}</pre>
    <Textarea
      ref={textareaRef}
      aria-label={label}
      aria-invalid={invalid || undefined}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      onScroll={(event) => { if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop; }}
      spellCheck={false}
      wrap="off"
      dir="ltr"
      className="min-h-[300px] min-w-0 resize-y overflow-auto whitespace-pre rounded-none border-0 bg-transparent px-3 py-3 font-mono text-[13px] leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
      placeholder={t("json.inputPlaceholder")}
    />
  </div>;
}

function TreeNode({ name, value, path, depth = 0 }: { name: string; value: unknown; path: string; depth?: number }): ReactNode {
  const { t } = useI18n();
  if (depth > 60) return <div className="font-mono text-xs text-muted-foreground">{name}: {t("json.treeDepthLimit")}</div>;
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : value !== null && typeof value === "object"
      ? Object.entries(value as Record<string, unknown>)
      : null;
  if (!entries) return <div className="flex flex-wrap items-baseline gap-2 py-0.5 font-mono text-xs"><span className="text-muted-foreground">{name}</span><span className="text-muted-foreground">:</span><span>{value === null ? <span className="text-amber-700 dark:text-amber-300">null</span> : value === treeMarkers.depth ? t("json.treeDepthLimit") : value === treeMarkers.nodes ? t("json.treeNodesOmitted") : value === treeMarkers.items ? t("json.treeItemsOmitted") : value === treeMarkers.properties ? t("json.treePropertiesOmitted") : typeof value === "string" ? <span className="text-emerald-700 dark:text-emerald-300">{JSON.stringify(value)}</span> : String(value)}</span><span className="text-muted-foreground">({value === null ? t("json.treeTypeNull") : typeof value === "string" ? t("json.treeTypeString") : typeof value === "number" ? t("json.treeTypeNumber") : typeof value === "boolean" ? t("json.treeTypeBoolean") : ""})</span></div>;
  return <details open={depth < 2} className="py-0.5">
    <summary className="cursor-pointer rounded px-1 py-0.5 font-mono text-xs hover:bg-accent">{name} <span className="text-muted-foreground">{Array.isArray(value) ? `${t("json.treeArray").replace("{count}", String(entries.length))}` : `${t("json.treeObject").replace("{count}", String(entries.length))}`}</span></summary>
    <div className="ms-3 border-s border-border ps-2">{entries.map(([key, child]) => <TreeNode key={key} name={Array.isArray(value) ? `[${key}]` : key} value={child} path={`${path}/${key}`} depth={depth + 1} />)}</div>
  </details>;
}

function buildTreePreview(value: unknown, budget = 2000): unknown {
  let remaining = budget;
  const visit = (node: unknown, depth: number): unknown => {
    if (remaining <= 0) return treeMarkers.nodes;
    remaining--;
    if (depth > 60) return treeMarkers.depth;
    if (Array.isArray(node)) {
      const result: unknown[] = [];
      for (const child of node) {
        if (remaining <= 0) { result.push(treeMarkers.items); break; }
        result.push(visit(child, depth + 1));
      }
      return result;
    }
    if (node !== null && typeof node === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
        if (remaining <= 0) { result["…"] = treeMarkers.properties; break; }
        result[key] = visit(child, depth + 1);
      }
      return result;
    }
    return node;
  };
  return visit(value, 0);
}

function findJsonMatches(value: unknown, query: string): FindMatch[] {
  if (!query.trim()) return [];
  const matches: FindMatch[] = [];
  const needle = query.toLowerCase();
  const visit = (node: unknown, path: string, depth: number) => {
    if (depth > 100 || matches.length >= 1000) return;
    if (Array.isArray(node)) {
      for (let index = 0; index < node.length && matches.length < 1000; index++) { visit(node[index], `${path}[${index}]`, depth + 1); }
    } else if (node !== null && typeof node === "object") {
      for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
        if (matches.length >= 1000) break;
        const keyPath = /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
        if (key.toLowerCase().includes(needle)) matches.push({ path: keyPath, kind: "key", value: key });
        if (typeof child === "string" && child.toLowerCase().includes(needle)) matches.push({ path: keyPath, kind: "value", value: child });
        else if (typeof child !== "string" && (child === null || typeof child !== "object") && String(child).toLowerCase().includes(needle)) matches.push({ path: keyPath, kind: "value", value: String(child) });
        visit(child, keyPath, depth + 1);
      }
    }
  };
  visit(value, "$", 0);
  return matches;
}

export function JsonWorkbench({ initialMode = "format" }: { initialMode?: JsonOperation } = {}) {
  const { t, locale } = useI18n();
  const [operation, setOperation] = useState<JsonOperation>(initialMode);
  const resultPresentation = resultPresentationByOperation[operation];
  const hasSecondaryWorkspacePanel = resultPresentation === "output" || resultPresentation === "tree" || resultPresentation === "comparison";
  const [input, setInput] = useState(sampleJson);
  const [compareInput, setCompareInput] = useState(sampleCompareJson);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  const [status, setStatus] = useState("");
  const [diagnostics, setDiagnostics] = useState<LocatedDiagnostic[]>([]);
  const [differences, setDifferences] = useState<JsonDifference[]>([]);
  const [activeDifferenceIndex, setActiveDifferenceIndex] = useState(0);
  const differenceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [treeValue, setTreeValue] = useState<unknown>(null);
  const [hasTree, setHasTree] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [findMatches, setFindMatches] = useState<FindMatch[]>([]);
  const [activeFindIndex, setActiveFindIndex] = useState(0);
  const findRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const fileTriggerRef = useRef<HTMLButtonElement>(null);
  const featuresTriggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const compareRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const undoStack = useRef<Snapshot[]>([]);
  const redoStack = useRef<Snapshot[]>([]);
  const current = () => snapshot(input, compareInput);

  useEffect(() => {
    if (!menuOpen) return;
    const activeMenuId = menuOpen === "File" ? "json-file-menu"
      : menuOpen === "Feature" ? "json-features-menu"
      : "json-group-menu";
    const activeMenu = activeMenuId ? menuBarRef.current?.querySelector<HTMLDivElement>(`[data-testid="${activeMenuId}"]`) : null;
    activeMenu?.querySelector<HTMLButtonElement>('[role^="menuitem"]:not(:disabled)')?.focus();
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!menuBarRef.current?.contains(event.target as Node)) setMenuOpen(null);
    };
    const closeOnEscape = (event: Event) => {
      if ("key" in event && event.key === "Escape") {
        setMenuOpen(null);
        focusMenuTrigger(menuOpen);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  function focusMenuTrigger(name: string | null) {
    if (!name) return;
    const trigger = Array.from(menuBarRef.current?.querySelectorAll<HTMLButtonElement>("[data-json-menu-trigger]") ?? [])
      .find((item) => item.getAttribute("data-json-menu-trigger") === name);
    trigger?.focus();
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setMenuOpen(null);
      focusMenuTrigger(menuOpen);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]:not(:disabled)'));
    if (!items.length) return;
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? items.length - 1
      : event.key === "ArrowDown" ? (currentIndex + 1 + items.length) % items.length
      : (currentIndex <= 0 ? items.length - 1 : currentIndex - 1);
    items[nextIndex]?.focus();
  }

  function clearResult() {
    setOutput("");
    setError("");
    setValid(false);
    setStatus("");
    setDiagnostics([]);
    setDifferences([]);
    setActiveDifferenceIndex(0);
    differenceRefs.current = [];
    setHasTree(false);
    setFindMatches([]);
    setActiveFindIndex(0);
    findRefs.current = [];
  }
  function recordHistory() {
    const previous = current();
    if (undoStack.current.at(-1)?.input !== previous.input || undoStack.current.at(-1)?.compareInput !== previous.compareInput) {
      undoStack.current.push(previous);
      if (undoStack.current.length > 50) undoStack.current.shift();
    }
    redoStack.current = [];
  }
  function changeInput(value: string) {
    recordHistory();
    setInput(value);
    clearResult();
  }
  function changeCompareInput(value: string) {
    recordHistory();
    setCompareInput(value);
    clearResult();
  }
  function restore(next: Snapshot) {
    setInput(next.input);
    setCompareInput(next.compareInput);
    clearResult();
  }
  function undo() {
    const previous = undoStack.current.pop();
    if (!previous) return;
    redoStack.current.push(current());
    restore(previous);
    setStatus(t("json.undoDone"));
  }
  function redo() {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(current());
    restore(next);
    setStatus(t("json.redoDone"));
  }
  function onEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
    } else if (modifier && event.key.toLowerCase() === "y") {
      event.preventDefault();
      redo();
    }
  }
  function setInvalid(diagnosticList: LocatedDiagnostic[]) {
    const localized = diagnosticList.map((diagnostic) => ({
      ...diagnostic,
      message: localizeDiagnosticMessage(diagnostic.message, t),
    }));
    setDiagnostics(localized);
    setError(localized[0]?.message ?? t("json.invalid"));
    setOutput("");
    setDifferences([]);
    setActiveDifferenceIndex(0);
    differenceRefs.current = [];
    setValid(false);
    setHasTree(false);
    setFindMatches([]);
    setActiveFindIndex(0);
    findRefs.current = [];
  }
  function run() {
    clearResult();
    if (operation === "escape") {
      setOutput(escapeJsonStringContents(input));
      setStatus(t("json.escaped"));
      setValid(true);
      return;
    }
    if (operation === "unescape") {
      try {
        setOutput(unescapeJsonStringContents(input));
        setStatus(t("json.unescaped"));
        setValid(true);
      } catch {
        setError(t("json.invalidEscapedString"));
        setValid(false);
      }
      return;
    }
    const left = diagnoseJson(input);
    if (!left.ok) {
      setInvalid(left.diagnostics.map((diagnostic) => ({ ...diagnostic, source: "input" as const })));
      return;
    }
    if (operation === "compare") {
      const right = diagnoseJson(compareInput);
      if (!right.ok) {
        setInvalid(right.diagnostics.map((diagnostic) => ({ ...diagnostic, source: "compare" as const })));
        return;
      }
      try {
        const result = compareJsonDocuments(input, compareInput);
        setDifferences(result);
        setActiveDifferenceIndex(0);
        setValid(true);
        setStatus(result.length === 0 ? t("json.equivalent") : t("json.compareComplete"));
      } catch {
        setError(t("json.compareFailed"));
      }
      return;
    }
    if (operation === "format") setOutput(JSON.stringify(left.value, null, 2));
    else if (operation === "minify") setOutput(JSON.stringify(left.value));
    else if (operation === "sort") setOutput(JSON.stringify(sortJsonKeys(left.value), null, 2));
    else if (operation === "tree") {
      setTreeValue(buildTreePreview(left.value));
      setHasTree(true);
    } else if (operation === "find") {
      setFindMatches(findJsonMatches(left.value, findQuery));
      setActiveFindIndex(0);
    } 
    setValid(true);
    setStatus(operation === "validate" ? t("json.valid") : t("json.operationComplete"));
  }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error(t("json.fileTooLarge"));
      const content = await file.text();
      recordHistory();
      setInput(content);
      clearResult();
      setStatus(t("json.imported"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("json.importFailed"));
    } finally {
      event.target.value = "";
    }
  }
  async function copyResult() {
    const hasTextResult = output.length > 0 || (valid && (operation === "escape" || operation === "unescape"));
    const value = output;
    if (!hasTextResult) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus(t("json.copied"));
    } catch {
      setError(t("json.copyFailed"));
    }
  }
  function downloadResult() {
    const isStringContent = operation === "escape" || operation === "unescape";
    const hasTextResult = output.length > 0 || (valid && isStringContent);
    const value = hasTextResult ? output : input;
    const blob = new Blob([value], { type: isStringContent ? "text/plain;charset=utf-8" : "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = isStringContent ? "string-content.txt" : "document.json";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(isStringContent ? t("json.textDownloaded") : t("json.downloaded"));
  }
  function clearDocument() {
    recordHistory();
    setInput("");
    setCompareInput("");
    clearResult();
    setMenuOpen(null);
    inputRef.current?.focus();
  }
  function loadSample() {
    recordHistory();
    setInput(sampleJson);
    setCompareInput(sampleCompareJson);
    clearResult();
    setStatus(t("json.sampleLoaded"));
    setMenuOpen(null);
  }
  function navigateDiagnostic(diagnostic: LocatedDiagnostic) {
    const target = diagnostic.source === "compare" ? compareRef.current : inputRef.current;
    if (!target) return;
    target.focus();
    target.setSelectionRange(diagnostic.offset, diagnostic.endOffset);
    target.scrollTop = Math.max(0, (diagnostic.line - 2) * 24);
  }
  function navigateDifference(direction: -1 | 1) {
    if (differences.length < 2) return;
    const next = (activeDifferenceIndex + direction + differences.length) % differences.length;
    setActiveDifferenceIndex(next);
    differenceRefs.current[next]?.scrollIntoView?.({ behavior: "auto", block: "nearest" });
  }
  function navigateFindMatch(direction: -1 | 1) {
    if (findMatches.length < 2) return;
    const next = (activeFindIndex + direction + findMatches.length) % findMatches.length;
    setActiveFindIndex(next);
    findRefs.current[next]?.scrollIntoView?.({ behavior: "auto", block: "nearest" });
  }
  const operationEntries: { id: JsonOperation; label: string; description: string; group: string }[] = [
    { id: "format", label: t("json.format"), description: t("json.formatDescription"), group: t("json.core") },
    { id: "minify", label: t("json.minify"), description: t("json.minifyDescription"), group: t("json.core") },
    { id: "validate", label: t("json.validate"), description: t("json.validateDescription"), group: t("json.core") },
    { id: "compare", label: t("json.compare"), description: t("json.compareDescription"), group: t("json.core") },
    { id: "sort", label: t("json.sortKeys"), description: t("json.sortKeysDescription"), group: t("json.core") },
    { id: "tree", label: t("json.tree"), description: t("json.treeDescription"), group: t("json.inspect") },
    { id: "find", label: t("json.find"), description: t("json.findDescription"), group: t("json.inspect") },
    { id: "escape", label: t("json.escape"), description: t("json.escapeDescription"), group: t("json.transform") },
    { id: "unescape", label: t("json.unescape"), description: t("json.unescapeDescription"), group: t("json.transform") },
  ];
  const groups = [...new Set(operationEntries.map((entry) => entry.group))];
  const featureSearch = useFeatureMenuSearch(menuOpen === "Feature", operationEntries.length, "json", locale);
  const filteredOperationEntries = operationEntries.filter((entry) => featureSearch.matches([entry.label, entry.description, entry.group]));
  const direction = localeDirections[locale];

  function renderFileActions() {
    return <>
            <button role="menuitem" className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-accent" onClick={() => { fileInputRef.current?.click(); setMenuOpen(null); }}><FileUp className="h-4 w-4 text-muted-foreground" />{t("json.openFile")}</button>
            <button role="menuitem" disabled={!(output.length > 0 || (valid && (operation === "escape" || operation === "unescape")))} className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-accent disabled:opacity-40" onClick={() => { void copyResult(); setMenuOpen(null); }}><Copy className="h-4 w-4 text-muted-foreground" />{t("json.copyResult")}</button>
            <button role="menuitem" className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm hover:bg-accent" onClick={() => { downloadResult(); setMenuOpen(null); }}><Download className="h-4 w-4 text-muted-foreground" />{operation === "escape" || operation === "unescape" ? t("json.downloadText") : t("json.downloadJson")}</button>
            <div className="my-1 border-t border-border" />
            <button role="menuitem" disabled={!undoStack.current.length} className="min-h-10 w-full rounded-md px-3 py-2 text-start text-sm hover:bg-accent disabled:opacity-40" onClick={() => { undo(); setMenuOpen(null); }}>{t("json.undo")}</button>
            <button role="menuitem" disabled={!redoStack.current.length} className="min-h-10 w-full rounded-md px-3 py-2 text-start text-sm hover:bg-accent disabled:opacity-40" onClick={() => { redo(); setMenuOpen(null); }}>{t("json.redo")}</button>
            <button role="menuitem" className="min-h-10 w-full rounded-md px-3 py-2 text-start text-sm hover:bg-accent" onClick={loadSample}>{t("json.loadSample")}</button>
            <button role="menuitem" className="min-h-10 w-full rounded-md px-3 py-2 text-start text-sm text-destructive hover:bg-accent" onClick={clearDocument}>{t("json.clear")}</button>
          
    </>;
  }

  return <section aria-label={t("json.workspace")} dir={direction} className="min-w-0">
    <input ref={fileInputRef} type="file" accept=".json,application/json,text/json" className="hidden" aria-label={t("json.openFile")} onChange={(event) => void importFile(event)} />
    <div ref={menuBarRef} role="navigation" aria-label={t("json.commandBar")} data-testid="json-editor-menubar" className="relative sticky top-0 z-[70] flex h-[68px] min-w-0 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 text-sm lg:top-[68px] sm:px-6">
      <div className="flex min-w-0 items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 lg:hidden" aria-label={t("json.openNavigation")} onClick={() => window.dispatchEvent(new Event("gaget:open-navigation"))}><Menu className="h-4 w-4" /></Button>
        <div className="relative shrink-0">
          <Button data-json-menu-trigger="File" ref={fileTriggerRef} variant={menuOpen === "File" ? "secondary" : "ghost"} aria-expanded={menuOpen === "File"} aria-haspopup="menu" onClick={() => setMenuOpen(menuOpen === "File" ? null : "File")}>{t("json.file")}</Button>
          {menuOpen === "File" && <div role="menu" aria-label={t("json.file")} data-testid="json-file-menu" onKeyDown={handleMenuKeyDown} className="absolute start-0 top-full z-50 mt-1 json-workspace-menu max-h-[min(calc(100dvh-16rem),32rem)] w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl" style={window.innerWidth < 768 ? { position: "fixed", top: (fileTriggerRef.current?.getBoundingClientRect().bottom ?? 0) + 4, left: "1rem", right: "1rem", width: "auto", maxWidth: "none", marginTop: 0 } : { left: direction === "rtl" ? "auto" : 0, right: direction === "rtl" ? 0 : "auto" }}>{renderFileActions()}</div>}
        </div>
        {groups.map((group) => {
          const firstEntry = operationEntries.find((entry) => entry.group === group);
          if (!firstEntry) return null;
          const isOpen = menuOpen === group;
          return <div key={group} className="relative hidden shrink-0 md:block">
            <Button data-json-menu-trigger={group} variant={isOpen ? "secondary" : "ghost"} aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setMenuOpen(isOpen ? null : group)}>{group}</Button>
            {isOpen && <div role="menu" aria-label={group} data-testid="json-group-menu" onKeyDown={handleMenuKeyDown} className="absolute start-0 top-full z-50 mt-1 json-workspace-menu max-h-[min(calc(100dvh-16rem),34rem)] w-[min(22rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl" style={{ left: direction === "rtl" ? "auto" : 0, right: direction === "rtl" ? 0 : "auto" }}>
              {operationEntries.filter((entry) => entry.group === group).map((entry) => <button key={entry.id} role="menuitemradio" aria-checked={operation === entry.id} className={`flex min-h-12 w-full items-start gap-2 rounded-md px-3 py-2 text-start hover:bg-accent ${operation === entry.id ? "bg-accent" : ""}`} onClick={() => { setOperation(entry.id); clearResult(); setMenuOpen(null); focusMenuTrigger(group); }}>
                <WandSparkles className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /><span className="min-w-0"><span className="block text-sm leading-5">{entry.label}</span><span className="block text-xs leading-4 text-muted-foreground">{entry.description}</span></span>
              </button>)}
            </div>}
          </div>;
        })}
      </div>
      <div className="relative ml-auto shrink-0 md:hidden">
          <Button data-json-menu-trigger="Feature" ref={featuresTriggerRef} variant={menuOpen === "Feature" ? "secondary" : "ghost"} aria-expanded={menuOpen === "Feature"} aria-haspopup="menu" onClick={() => setMenuOpen(menuOpen === "Feature" ? null : "Feature")}>{t("json.feature")}</Button>
          {menuOpen === "Feature" && <div role="menu" aria-label={t("json.feature")} data-testid="json-features-menu" onKeyDown={handleMenuKeyDown} className="absolute start-0 top-full z-50 mt-1 json-workspace-menu max-h-[min(calc(100dvh-16rem),34rem)] w-[min(22rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl" style={{ position: "fixed", top: (featuresTriggerRef.current?.getBoundingClientRect().bottom ?? 0) + 4, left: "1rem", right: "1rem", width: "auto", maxWidth: "none", marginTop: 0 }}>
            <div data-testid="json-mobile-feature-list">
              {featureSearch.canSearch && <FeatureMenuSearch value={featureSearch.query} onChange={featureSearch.setQuery} />}
              {featureSearch.canSearch && featureSearch.query.trim() && filteredOperationEntries.length === 0 ? <FeatureMenuNoResults /> : filteredOperationEntries.map((entry) => <button key={entry.id} role="menuitemradio" aria-checked={operation === entry.id} className={`flex min-h-12 w-full items-start gap-2 rounded-md px-3 py-2 text-start hover:bg-accent ${operation === entry.id ? "bg-accent" : ""}`} onClick={() => { setOperation(entry.id); clearResult(); setMenuOpen(null); featuresTriggerRef.current?.focus(); }}>
                <WandSparkles className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /><span className="min-w-0"><span className="block text-sm leading-5">{entry.label}</span><span className="block text-xs leading-4 text-muted-foreground">{entry.description}</span></span>
              </button>)}
            </div>
          </div>}
        </div>

    </div>

    <div data-testid="json-workspace-content" className="w-full min-w-0 space-y-4 px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <h1 className="text-xl font-bold tracking-tight">{t("json.workspace")}</h1>
      <p className="text-sm text-muted-foreground">{t("json.workspaceDescription")}</p>

          {status && !error && diagnostics.length === 0 && <p role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm"><Check className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" />{status}</p>}
          {(diagnostics.length > 0 || error) && <section aria-label={t("json.diagnostics")} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3"><div className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p role="alert">{error}</p></div>{diagnostics.length > 0 && <ul className="mt-2 space-y-1">{diagnostics.map((diagnostic, index) => <li key={`${diagnostic.source}-${diagnostic.offset}-${index}`}><button type="button" className="rounded px-1 py-1 text-start text-sm underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={t("json.goToDiagnostic").replace("{line}", String(diagnostic.line)).replace("{column}", String(diagnostic.column))} onClick={() => navigateDiagnostic(diagnostic)}><span className="font-medium">{diagnostic.source === "compare" ? t("json.documentB") : operation === "compare" ? t("json.documentA") : t("json.input")}</span> · {t("json.lineColumn").replace("{line}", String(diagnostic.line)).replace("{column}", String(diagnostic.column))}: {diagnostic.message}</button></li>)}</ul>}</section>}

    <div data-testid="json-operation-header" className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0"><h2 className="text-base font-semibold">{operationEntries.find((entry) => entry.id === operation)?.label}</h2><p data-testid="json-operation-description" className="text-sm text-muted-foreground">{operationEntries.find((entry) => entry.id === operation)?.description}</p></div>
      <div className="w-full shrink-0 md:w-auto"><Button data-testid="json-run-operation" className="w-full md:w-auto" onClick={run}><WandSparkles className="h-4 w-4" />{t("json.runOperation")}</Button></div>
    </div>

    {operation === "find" && <div className="max-w-lg"><label htmlFor="json-find-query" className="mb-1 block text-sm font-medium">{t("json.findLabel")}</label><input id="json-find-query" value={findQuery} onChange={(event) => { setFindQuery(event.target.value); setFindMatches([]); setActiveFindIndex(0); setValid(false); setStatus(""); }} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={t("json.findPlaceholder")} /></div>}

    <div className={`grid min-w-0 gap-4 ${hasSecondaryWorkspacePanel ? "xl:grid-cols-2" : ""}`}>
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between space-y-0 gap-2"><CardTitle className="text-sm">{operation === "compare" ? t("json.documentA") : t("json.input")}</CardTitle><span className="shrink-0 text-xs text-muted-foreground">{input.length.toLocaleString()} {t("json.characters")}</span></CardHeader>
        <CardContent className="min-w-0"><LineNumberEditor label={operation === "compare" ? t("json.documentAInput") : t("json.inputJson")} value={input} onChange={changeInput} textareaRef={inputRef} invalid={diagnostics.some((item) => item.source === "input")} onKeyDown={onEditorKeyDown} /></CardContent>
      </Card>
      {operation === "compare" ? <Card className="min-w-0 overflow-hidden"><CardHeader className="flex-row items-center justify-between space-y-0 gap-2"><CardTitle className="text-sm">{t("json.documentB")}</CardTitle><span className="shrink-0 text-xs text-muted-foreground">{compareInput.length.toLocaleString()} {t("json.characters")}</span></CardHeader><CardContent className="min-w-0"><LineNumberEditor label={t("json.documentBInput")} value={compareInput} onChange={changeCompareInput} textareaRef={compareRef} invalid={diagnostics.some((item) => item.source === "compare")} onKeyDown={onEditorKeyDown} /></CardContent></Card>
        : resultPresentation !== "diagnostics" && resultPresentation !== "search" ? <Card className="min-w-0 overflow-hidden"><CardHeader className="flex-row items-center justify-between gap-2"><CardTitle className="text-sm">{operation === "tree" ? t("json.tree") : t("json.output")}</CardTitle><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label={t("json.copyResult")} disabled={!(output.length > 0 || (valid && (operation === "escape" || operation === "unescape")))} onClick={() => void copyResult()}><Copy className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={operation === "escape" || operation === "unescape" ? t("json.downloadText") : t("json.downloadJson")} disabled={!(output.length > 0 || (valid && (operation === "escape" || operation === "unescape")))} onClick={downloadResult}><Download className="h-4 w-4" /></Button></div></CardHeader><CardContent className="min-w-0">
          {operation === "tree" && hasTree ? <div data-testid="json-tree-view" className="max-h-[420px] min-h-[300px] overflow-auto rounded-lg border border-border bg-background p-3"><TreeNode name="$" value={treeValue} path="$" /></div> : <pre aria-label={t("json.output")} className="min-h-[300px] max-h-[520px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/40 p-3 font-mono text-[13px] leading-6">{output || <span className="text-muted-foreground">{t("json.outputPlaceholder")}</span>}</pre>}
        </CardContent></Card> : null}
    </div>

    {operation === "compare" && valid && <Card>
      <CardHeader><CardTitle className="text-sm">{t("json.comparisonResult").replace("{count}", String(differences.length))}</CardTitle></CardHeader>
      <CardContent>
        {differences.length === 0
          ? <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{t("json.equivalent")}</p>
          : <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p aria-live="polite" className="text-xs text-muted-foreground">{t("json.differencePosition").replace("{current}", String(activeDifferenceIndex + 1)).replace("{count}", String(differences.length))}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={differences.length < 2} onClick={() => navigateDifference(-1)}>{t("json.previousDifference")}</Button>
                <Button type="button" variant="outline" size="sm" disabled={differences.length < 2} onClick={() => navigateDifference(1)}>{t("json.nextDifference")}</Button>
              </div>
            </div>
            <div className="space-y-3">{differences.map((difference, index) => <div key={difference.path} id={"json-difference-" + index} data-testid={"json-difference-" + index} data-active={activeDifferenceIndex === index ? "true" : "false"} ref={(element) => { differenceRefs.current[index] = element; }} className={"rounded-lg border p-3 text-sm " + (activeDifferenceIndex === index ? "border-primary bg-primary/5" : "border-border")}>
              <div className="flex flex-wrap items-center gap-2"><code className="font-mono">{difference.path}</code><span className="rounded bg-muted px-2 py-0.5 text-xs">{t("json.diff." + difference.kind)}</span></div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">{difference.kind !== "added" && <pre className="overflow-auto whitespace-pre-wrap break-words rounded bg-muted/40 p-2 font-mono text-xs">{JSON.stringify(difference.before, null, 2)}</pre>}{difference.kind !== "removed" && <pre className="overflow-auto whitespace-pre-wrap break-words rounded bg-muted/40 p-2 font-mono text-xs">{JSON.stringify(difference.after, null, 2)}</pre>}</div>
            </div>)}</div>
          </>}
      </CardContent>
    </Card>}

    {operation === "find" && valid && <Card>
      <CardHeader><CardTitle className="text-sm">{t("json.findResults").replace("{count}", String(findMatches.length))}</CardTitle></CardHeader>
      <CardContent>
        {findMatches.length ? <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p aria-live="polite" className="text-xs text-muted-foreground">{t("json.matchPosition").replace("{current}", String(activeFindIndex + 1)).replace("{count}", String(findMatches.length))}</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" disabled={findMatches.length < 2} onClick={() => navigateFindMatch(-1)}>{t("json.previousMatch")}</Button>
              <Button type="button" variant="outline" size="sm" disabled={findMatches.length < 2} onClick={() => navigateFindMatch(1)}>{t("json.nextMatch")}</Button>
            </div>
          </div>
          {findMatches.length >= 1000 && <p className="mb-3 text-xs text-muted-foreground">{t("json.findTruncated")}</p>}
          <ul className="space-y-2">{findMatches.map((match, index) => <li key={match.kind + "-" + match.path + "-" + index} data-testid={"json-find-match-" + index} data-active={activeFindIndex === index ? "true" : "false"} ref={(element) => { findRefs.current[index] = element; }} className={"flex flex-wrap items-center gap-2 rounded-md border p-2 text-sm " + (activeFindIndex === index ? "border-primary bg-primary/5" : "border-transparent")}><span className="rounded bg-muted px-2 py-0.5 text-xs">{t("json.find." + match.kind)}</span><code>{match.path}</code><span className="break-all text-muted-foreground">{match.value}</span></li>)}</ul>
        </> : <p role="status" className="text-sm text-muted-foreground">{t("json.noFindResults")}</p>}
      </CardContent>
    </Card>}

    </div>
  </section>;
}
