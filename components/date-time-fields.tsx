"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { addDays, calendarMonth, calendarParts, calendarWeekStart, formatCalendarDate, formatCalendarDay, formatCalendarNumber, localizeCalendarDigits, normalizeCalendarDigits, parseISODate, toISODate } from "@/lib/date-time/calendar";

const pad = (value: number) => String(value).padStart(2, "0");

type DateFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  locale?: string;
  calendar?: string;
  numberingSystem?: string;
};


/** A styled, keyboard-operable calendar popover. ISO/Gregorian remains the stable value; Intl controls its calendar and digit presentation. */
export function CalendarDateInput({ id, value, onChange, locale = "en-US", calendar = "gregory", numberingSystem = "locale" }: DateFieldProps) {
  const parsedSelected = parseISODate(value);
  const selected = Number.isNaN(parsedSelected.getTime()) ? new Date() : parsedSelected;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [viewMonth, setViewMonth] = useState(() => selected);
  const format = (date: Date, options: Intl.DateTimeFormatOptions, calendarOverride = calendar) => {
    try { return formatCalendarDate(date, locale, calendarOverride, numberingSystem, options); }
    catch { return new Intl.DateTimeFormat("en-US", options).format(date); }
  };
  const supportedCalendar = (() => { try { return new Intl.DateTimeFormat(locale, { calendar, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem }).resolvedOptions().calendar === calendar; } catch { return false; } })();
  const calendarMonthDates = calendarMonth(viewMonth, locale, calendar, numberingSystem);
  const monthLabel = format(viewMonth, { month: "long", year: "numeric" });
  const gregorianMonthLabel = format(viewMonth, { month: "short", year: "numeric" }, "gregory");
  const selectedLabel = value ? format(selected, { dateStyle: "full" }) : "Choose date";
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const weekStartDay = calendarWeekStart(locale);
    const day = new Date(2023, 0, 1 + ((weekStartDay + index) % 7), 12);
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day);
  }), [locale]);
  useEffect(() => { if (!open) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); } }; const onPointerDown = (event: PointerEvent) => { if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false); }; document.addEventListener("keydown", onKeyDown); document.addEventListener("pointerdown", onPointerDown); return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("pointerdown", onPointerDown); }; }, [open]);
  const changeMonth = (amount: number) => setViewMonth((current) => { const currentMonth = calendarMonth(current, locale, calendar, numberingSystem); return addDays(amount < 0 ? currentMonth.first : currentMonth.last, amount < 0 ? -1 : 1); });

  return <div ref={rootRef} className="relative min-w-0">
    <button ref={triggerRef} id={id} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setViewMonth(Number.isNaN(parseISODate(value).getTime()) ? new Date() : parseISODate(value)); setOpen((current) => !current); }} className="flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-start text-sm hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="min-w-0 truncate">{selectedLabel}</span><CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
    {open && <div role="dialog" aria-label="Choose date" className="absolute start-0 top-[calc(100%+4px)] z-50 w-[min(20rem,100%)] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-xl">{!supportedCalendar && <p role="status" className="mb-2 border-b border-border pb-2 text-xs text-muted-foreground">This browser does not support the {calendar} calendar for {locale}; Gregorian formatting is being used.</p> }
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} className="inline-flex h-8 w-8 items-center justify-center hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronLeft className="h-4 w-4" /></button>
        <div className="min-w-0 text-center"><p className="text-sm font-semibold">{monthLabel}</p><p className="text-xs text-muted-foreground">Gregorian equivalent: {gregorianMonthLabel} · {calendar}</p></div>
        <button type="button" aria-label="Next month" onClick={() => changeMonth(1)} className="inline-flex h-8 w-8 items-center justify-center hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div role="grid" aria-label={monthLabel} className="grid grid-cols-7 gap-1">
        {weekdays.map((day, index) => <div role="columnheader" key={index} className="py-1 text-center text-xs font-medium text-muted-foreground">{day}</div>)}
        {Array.from({ length: calendarMonthDates.offset }, (_, index) => <span aria-hidden="true" key={"empty-" + index} />)}
        {calendarMonthDates.dates.map((date) => {
          const iso = toISODate(date);
          const isSelected = iso === value;
          return <button key={iso} type="button" aria-pressed={isSelected} aria-label={format(date, { dateStyle: "full" })} onClick={() => { onChange(iso); setOpen(false); triggerRef.current?.focus(); }} className={"h-9 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>{formatCalendarDay(date, locale, calendar, numberingSystem)}</button>;
        })}
      </div>
      <div className="mt-3 flex justify-between border-t border-border pt-3">
        <button type="button" onClick={() => { const today = new Date(); const iso = toISODate(today); onChange(iso); setViewMonth(today); setOpen(false); triggerRef.current?.focus(); }} className="text-sm font-medium text-primary hover:underline">Today</button>
        <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
      </div>
    </div>}
  </div>;
}

/** Styled time selector with direct text entry and a bounded, scrollable quarter-hour list. */
export function ClockTimeInput({ id, value, onChange, locale = "en-US", numberingSystem = "locale" }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (!open) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); inputRef.current?.focus(); } }; const onPointerDown = (event: PointerEvent) => { if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false); }; document.addEventListener("keydown", onKeyDown); document.addEventListener("pointerdown", onPointerDown); return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("pointerdown", onPointerDown); }; }, [open]);
  const options = useMemo(() => Array.from({ length: 96 }, (_, index) => pad(Math.floor(index / 4)) + ":" + pad((index % 4) * 15)), []);
  const normalized = /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : "12:00";
  return <div ref={rootRef} dir="ltr" className="relative min-w-0">
    <div className="flex h-10 items-center overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
      <input ref={inputRef} id={id} type="text" inputMode="numeric" autoComplete="off" aria-label="Time in 24-hour format" placeholder={localizeCalendarDigits("HH:MM", locale, numberingSystem)} value={localizeCalendarDigits(value, locale, numberingSystem)} onChange={(event) => onChange(normalizeCalendarDigits(event.target.value))} onFocus={() => setOpen(true)} onBlur={(event) => { if (!event.currentTarget.parentElement?.parentElement?.contains(event.relatedTarget as Node | null)) setOpen(false); }} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm tabular-nums outline-none" />
      <button type="button" aria-label="Choose time" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="inline-flex h-full items-center px-3 text-muted-foreground hover:bg-accent/40"><Clock3 className="h-4 w-4" /></button>
    </div>
    {open && <div role="listbox" aria-label="Time options" className="absolute start-0 top-[calc(100%+4px)] z-50 max-h-56 w-full min-w-40 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl">
      {options.map((option) => { const label = localizeCalendarDigits(option, locale, numberingSystem); return <button key={option} type="button" role="option" aria-label={label} aria-selected={normalized === option} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option); setOpen(false); }} className={"block w-full px-3 py-1.5 text-start text-sm tabular-nums hover:bg-accent " + (normalized === option ? "bg-accent font-medium" : "")}>{label}</button>; })}
    </div>}
  </div>;
}
