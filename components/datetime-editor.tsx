"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CalendarDays, ChevronDown, Clock3, Copy, RotateCcw, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimeWorkbench } from "@/components/datetime-workbench";
import { useResizableFeatureSheet } from "@/components/use-resizable-feature-sheet";

type Feature = { slug: string; title: string; description: string; group: "Date" | "Time" | "Calendar" | "Utilities" };
const features: Feature[] = [
  { slug: "calendar", title: "Calendar", description: "Browse and print a monthly calendar.", group: "Date" },
  { slug: "date-calculator", title: "Date calculator", description: "Add or subtract days, weeks, months, and years.", group: "Date" },
  { slug: "date-converter", title: "Calendar converter", description: "View dates in supported calendar systems.", group: "Date" },
  { slug: "date-difference", title: "Date difference", description: "Compare two dates and measure elapsed time.", group: "Date" },
  { slug: "age", title: "Age calculator", description: "Calculate age on a chosen date.", group: "Date" },
  { slug: "business-days", title: "Business days", description: "Count weekdays with custom weekend days.", group: "Date" },
  { slug: "week-number", title: "Week number", description: "Show ISO week and week-year.", group: "Date" },
  { slug: "leap-year", title: "Leap year", description: "Check year length and leap-year status.", group: "Date" },
  { slug: "date-format", title: "Date format", description: "Preview locale-specific date formats.", group: "Date" },
  { slug: "world-clock", title: "World clock & time zones", description: "Compare clocks and convert between zones.", group: "Time" },
  { slug: "meeting-planner", title: "Meeting planner", description: "Coordinate local times across time zones.", group: "Time" },
  { slug: "countdown", title: "Countdown & event timer", description: "Count down to an event or measure elapsed time.", group: "Time" },
  { slug: "duration", title: "Time duration", description: "Convert seconds into hours, minutes, and seconds.", group: "Time" },
  { slug: "timestamp", title: "Timestamp converter", description: "Convert Unix timestamps and ISO strings.", group: "Time" },
  { slug: "calendar-generator", title: "Calendar generator", description: "Create a printable month calendar.", group: "Calendar" },
  { slug: "holidays", title: "Holiday calendar", description: "Browse the included sample holiday list.", group: "Calendar" },
  { slug: "ics-viewer", title: "ICS viewer", description: "Inspect a local calendar file.", group: "Calendar" },
  { slug: "ics-generator", title: "ICS event generator", description: "Create a downloadable calendar event.", group: "Calendar" },
  { slug: "json", title: "Date/time JSON", description: "Export ISO, UTC, and Unix representations.", group: "Utilities" },
  { slug: "cron", title: "Cron helper", description: "Inspect a common five-field cron expression.", group: "Utilities" },
];
const locales = [
  { value: "en-US", label: "English" },
  { value: "fa-IR", label: "فارسی · Persian" },
  { value: "ar-SA", label: "العربية · Arabic" },
  { value: "ka-GE", label: "ქართული · Georgian" },
];
const calendars = [
  { value: "gregory", label: "Gregorian" },
  { value: "persian", label: "Persian Solar Hijri" },
  { value: "islamic", label: "Islamic" },
  { value: "islamic-umalqura", label: "Islamic · Umm al-Qura" },
  { value: "hebrew", label: "Hebrew" },
  { value: "buddhist", label: "Buddhist" },
  { value: "indian", label: "Indian National" },
];
const zones = [
  "Asia/Baku", "Asia/Tehran", "Asia/Dubai", "Europe/Tbilisi", "UTC",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "America/New_York",
  "America/Los_Angeles", "America/Chicago", "Asia/Kolkata", "Asia/Tokyo",
  "Asia/Shanghai", "Australia/Sydney",
];
const groups: Feature["group"][] = ["Date", "Time", "Calendar", "Utilities"];
const safeFormat = (date: Date, locale: string, calendar: string, numberingSystem: string, timeZone: string, timeStyle?: "medium" | "short") => {
  try {
    return new Intl.DateTimeFormat(locale, { calendar, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem, timeZone, dateStyle: "full", ...(timeStyle ? { timeStyle } : {}) }).format(date);
  } catch {
    return "This calendar and locale combination is not supported by this browser.";
  }
};

export function DateTimeEditor({ initialFeature }: { initialFeature?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const [locale, setLocale] = useState("en-US");
  const [calendar, setCalendar] = useState("gregory");
  const [numberingSystem, setNumberingSystem] = useState("locale");
  const [timeZone, setTimeZone] = useState("Asia/Baku");
  const [hourCycle, setHourCycle] = useState<"h12" | "h23">("h23");
  const [showSeconds, setShowSeconds] = useState(true);
  const [activeFeature, setActiveFeature] = useState<string | null>(initialFeature && features.some((f) => f.slug === initialFeature) ? initialFeature : null);
  const [query, setQuery] = useState("");
  const [zoneQuery, setZoneQuery] = useState("");
  const [availableZones, setAvailableZones] = useState<string[]>(zones);
  const [menuOpen, setMenuOpen] = useState<"File" | "Features" | null>(null);
  const [frozen, setFrozen] = useState(false);
  const [frozenAt, setFrozenAt] = useState<Date | null>(null);
  const [referenceRevision, setReferenceRevision] = useState(0);
  const [desktopPanelWidth, setDesktopPanelWidth] = useState(420);
  const [message, setMessage] = useState("");
  const [seededReference, setSeededReference] = useState<{ date: string; time: string } | null>(null);
  const { panelRef, panelStyle, resizeHandleProps } = useResizableFeatureSheet();

  useEffect(() => {
    if (initialFeature && features.some((feature) => feature.slug === initialFeature)) {
      window.history.replaceState(window.history.state, "", "/datetime/editor?feature=" + encodeURIComponent(initialFeature));
    }
  }, [initialFeature]);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const intl = Intl as typeof Intl & { supportedValuesOf?: (key: "timeZone") => string[] };
      const supported = intl.supportedValuesOf?.("timeZone");
      if (supported) setAvailableZones(Array.from(new Set([...zones, ...supported])).sort());
    } catch {
      // Keep the known-good fallback zone list on older browsers.
    }
  }, []);

  const displayNow = frozen && frozenAt ? frozenAt : now;
  const filteredFeatures = useMemo(() => features.filter((f) => (f.title + " " + f.description + " " + f.group).toLowerCase().includes(query.toLowerCase())), [query]);
  const formattedDate = displayNow ? safeFormat(displayNow, locale, calendar, numberingSystem, timeZone) : "Loading date…";
  const formattedTime = displayNow ? new Intl.DateTimeFormat(locale, {
    timeZone, hour: "2-digit", minute: "2-digit", ...(showSeconds ? { second: "2-digit" as const } : {}),
    hourCycle, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem,
  }).format(displayNow) : "--:--";
  const selectedDate = displayNow ? (() => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(displayNow);
    const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "00";
    return part("year") + "-" + part("month") + "-" + part("day");
  })() : undefined;
  const selectedTime = displayNow ? new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(displayNow) : undefined;

  useEffect(() => {
    if (initialFeature && selectedDate && selectedTime && !seededReference) setSeededReference({ date: selectedDate, time: selectedTime });
  }, [initialFeature, selectedDate, selectedTime, seededReference]);

  const gregorian = selectedDate ?? "—";
  let offset = "UTC";
  if (displayNow) {
    try { offset = new Intl.DateTimeFormat("en", { timeZone, timeZoneName: "shortOffset" }).formatToParts(displayNow).find((p) => p.type === "timeZoneName")?.value ?? "UTC"; } catch { offset = "UTC"; }
  }

  function selectFeature(slug: string) {
    setActiveFeature(slug);
    if (selectedDate && selectedTime) setSeededReference({ date: selectedDate, time: selectedTime });
    setMenuOpen(null);
    setMessage("");
    if (typeof window !== "undefined") window.history.replaceState(window.history.state, "", "/datetime/editor?feature=" + encodeURIComponent(slug));
  }
  function resetReference() {
    const current = new Date();
    setNow(current);
    setFrozenAt(null);
    setFrozen(false);
    setMessage("Reference reset to the current time.");
  }
  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard.");
    } catch {
      setMessage("Clipboard access is unavailable in this browser.");
    }
  }

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden" dir={locale.startsWith("fa") || locale.startsWith("ar") ? "rtl" : "ltr"}>
      <nav aria-label="Date and time editor commands" className="relative z-30 flex h-[68px] shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-6">
        <div className="flex items-center gap-1">
          <button type="button" aria-expanded={menuOpen === "File"} className={"inline-flex h-9 items-center rounded-md px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (menuOpen === "File" ? "bg-accent" : "")} onClick={() => setMenuOpen(menuOpen === "File" ? null : "File")}>File</button>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-expanded={menuOpen === "Features"} className={"inline-flex h-9 items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (menuOpen === "Features" ? "bg-accent" : "")} onClick={() => setMenuOpen(menuOpen === "Features" ? null : "Features")}><SlidersHorizontal className="h-4 w-4" /><span>Features</span></button>
        </div>
        {menuOpen === "File" && <div data-testid="datetime-file-menu" className="absolute left-3 top-[calc(100%-1px)] z-50 min-w-52 max-w-[calc(100vw-1.5rem)] rounded-lg border border-border bg-popover p-1.5 shadow-xl sm:left-6">
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent" onClick={() => { void copyText(formattedDate + " " + formattedTime + " (" + timeZone + ")"); setMenuOpen(null); }}><Copy className="h-4 w-4 text-muted-foreground" /><span>Copy current display</span></button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent" onClick={() => { void copyText(displayNow?.toISOString() ?? ""); setMenuOpen(null); }}><Copy className="h-4 w-4 text-muted-foreground" /><span>Copy ISO 8601</span></button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent" onClick={() => { void copyText(displayNow ? String(Math.floor(displayNow.getTime() / 1000)) : ""); setMenuOpen(null); }}><Copy className="h-4 w-4 text-muted-foreground" /><span>Copy Unix timestamp</span></button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent" onClick={() => { window.print(); setMenuOpen(null); }}><CalendarDays className="h-4 w-4 text-muted-foreground" /><span>Print current view</span></button>
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm hover:bg-accent" onClick={() => { resetReference(); setMenuOpen(null); }}><RotateCcw className="h-4 w-4 text-muted-foreground" /><span>Reset reference to now</span></button>
        </div>}
        {menuOpen === "Features" && <div data-testid="datetime-feature-menu" className="absolute right-3 top-[calc(100%-1px)] z-50 w-[min(20rem,calc(100vw-1.5rem))] max-h-[min(70dvh,520px)] overflow-x-hidden overflow-y-auto overscroll-y-contain rounded-lg border border-border bg-popover p-2 shadow-xl sm:right-6">
          <div className="flex items-center justify-between gap-2 px-3 py-2"><span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date &amp; time features</span><button type="button" aria-label="Close feature menu" className="rounded p-1 hover:bg-accent" onClick={() => setMenuOpen(null)}><X className="h-4 w-4" /></button></div>
          <div className="relative px-1 pb-2"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search date and time features" className="pl-9" placeholder="Search date, time, calendar…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <div className="space-y-3">
            {groups.map((group) => {
              const items = filteredFeatures.filter((feature) => feature.group === group);
              if (!items.length) return null;
              return <section key={group} aria-label={group + " features"}><p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</p>{items.map((feature) => <button type="button" key={feature.slug} onClick={() => selectFeature(feature.slug)} aria-pressed={activeFeature === feature.slug} className={"flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (activeFeature === feature.slug ? "bg-accent" : "")}><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{feature.title}</span><span className="mt-0.5 block text-xs leading-4 text-muted-foreground">{feature.description}</span></span><ChevronDown className="mt-1 h-4 w-4 shrink-0 -rotate-90 text-muted-foreground" /></button>)}</section>;
            })}
          </div>
        </div>}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
        <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col px-3 pb-8 pt-4 sm:px-6">
          <div className="mb-2 text-xs text-muted-foreground"><span>Home</span><span aria-hidden="true"> › </span><span>Date &amp; Time</span></div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Date &amp; Time</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">One workspace for dates, calendars, clocks, and calculations. Choose a feature from the command bar to open its controls without leaving this page.</p>
          </div>
          <div className="grid min-w-0 flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <section className="flex min-w-0 flex-1 flex-col justify-center">
          <section aria-label="Date and time display" className="mx-auto my-auto w-full max-w-5xl rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">Current date and time</p>
                <p className="mt-2 break-words font-mono text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl lg:text-6xl" aria-live="off">{formattedTime}</p>
                <p className="mt-3 max-w-3xl text-base leading-relaxed sm:text-lg">{formattedDate}</p>
                <p className="mt-2 text-sm text-muted-foreground" dir="ltr">{timeZone} · {offset}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"><span className={"h-2 w-2 rounded-full " + (frozen ? "bg-amber-500" : "bg-emerald-500")} />{frozen ? "Reference frozen" : "Live clock"}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => { if (frozen) { setFrozen(false); setFrozenAt(null); } else { setFrozenAt(now ?? new Date()); setFrozen(true); } }}>{frozen ? "Resume live clock" : "Freeze reference"}</Button>
              </div>
            </div>
            <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-2 xl:grid-cols-3">
              <label className="space-y-1.5 text-sm"><span className="font-medium">Display language</span><select className="h-10 w-full rounded-md border border-input bg-background px-3" value={locale} onChange={(e) => setLocale(e.target.value)}>{locales.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Calendar system</span><select className="h-10 w-full rounded-md border border-input bg-background px-3" value={calendar} onChange={(e) => setCalendar(e.target.value)}>{calendars.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Time zone</span><Input aria-label="Search time zones" placeholder="Filter IANA zones…" value={zoneQuery} onChange={(e) => setZoneQuery(e.target.value)} /><select aria-label="Time zone" className="h-10 w-full rounded-md border border-input bg-background px-3" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>{availableZones.filter((zone) => zone.toLowerCase().includes(zoneQuery.toLowerCase())).map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Numeral system</span><select className="h-10 w-full rounded-md border border-input bg-background px-3" value={numberingSystem} onChange={(e) => setNumberingSystem(e.target.value)}><option value="latn">Latin · 123</option><option value="arab">Arabic-Indic · ١٢٣</option><option value="arabext">Persian · ۱۲۳</option><option value="locale">Locale default</option></select></label>
              <label className="space-y-1.5 text-sm"><span className="font-medium">Clock format</span><select className="h-10 w-full rounded-md border border-input bg-background px-3" value={hourCycle} onChange={(e) => setHourCycle(e.target.value as "h12" | "h23")}><option value="h23">24-hour</option><option value="h12">12-hour</option></select></label>
              <label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" checked={showSeconds} onChange={(e) => setShowSeconds(e.target.checked)} className="h-4 w-4 accent-primary" />Show seconds</label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">Gregorian reference</span><code className="rounded bg-muted px-2 py-1 text-sm" dir="ltr">{gregorian}</code>
              <Button type="button" variant="outline" size="sm" onClick={() => void copyText(displayNow?.toISOString() ?? "")}><Copy className="mr-2 h-4 w-4" />Copy ISO 8601</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => void copyText(displayNow ? String(Math.floor(displayNow.getTime() / 1000)) : "")}><Copy className="mr-2 h-4 w-4" />Copy Unix seconds</Button>
              <Button type="button" variant="outline" size="sm" disabled={!activeFeature || !selectedDate} onClick={() => { if (selectedDate && selectedTime) setSeededReference({ date: selectedDate, time: selectedTime }); setReferenceRevision((revision) => revision + 1); setMessage("Displayed date and time applied to the selected feature."); }}>Use this date/time</Button>
            </div>
            {message && <p role="status" className="mt-3 text-sm text-muted-foreground">{message}</p>}
          </section>

        </section>}
        </section>

        {activeFeature && <aside ref={panelRef} style={{ ...panelStyle, "--panel-width": `${desktopPanelWidth}px` } as CSSProperties} data-testid="datetime-feature-panel" aria-label="Date and time feature settings" className="fixed inset-x-2 bottom-2 z-40 h-[var(--feature-panel-height)] max-h-[70dvh] resize-y overflow-y-auto overscroll-y-contain rounded-xl border border-border bg-card p-4 shadow-xl transition-[height] duration-200 motion-reduce:transition-none lg:static lg:h-auto lg:max-h-none lg:w-[var(--panel-width)] lg:max-w-[45vw] lg:resize-none lg:overflow-auto lg:rounded-xl lg:border-l lg:shadow-none">
          <div {...resizeHandleProps} className="sticky top-0 z-10 mx-auto -mt-3 mb-2 flex h-6 w-12 shrink-0 cursor-row-resize touch-none items-center justify-center rounded-md bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"><span aria-hidden="true" className="h-1 w-9 rounded-full bg-muted-foreground/50" /></div>
          <div className="mb-3 flex items-center justify-between gap-2"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Selected feature</p><h2 className="font-semibold">{features.find((f) => f.slug === activeFeature)?.title}</h2></div><Button type="button" variant="ghost" size="icon" aria-label="Close selected feature" onClick={() => setActiveFeature(null)}><X className="h-4 w-4" /></Button></div>
          <label className="mb-3 hidden items-center gap-3 text-xs text-muted-foreground lg:flex"><span>Panel width</span><input aria-label="Resize feature panel width" type="range" min="320" max="560" step="20" value={desktopPanelWidth} onChange={(event) => setDesktopPanelWidth(Number(event.target.value))} className="w-full accent-primary" /></label>
          <DateTimeWorkbench key={activeFeature + "-" + referenceRevision} slug={activeFeature} referenceDate={seededReference?.date ?? selectedDate} referenceTime={seededReference?.time ?? selectedTime} timeZone={timeZone} locale={locale} calendar={calendar} />
        </aside>}
      </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Runs locally in your browser. Calendar availability depends on your browser&apos;s Intl implementation; Islamic calendar conventions may differ.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
