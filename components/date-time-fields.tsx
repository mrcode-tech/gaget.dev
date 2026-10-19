"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

type DateFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  locale?: string;
  calendar?: string;
};

const pad = (value: number) => String(value).padStart(2, "0");
const parseISODate = (value: string) => {
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12) : new Date();
};
const toISODate = (date: Date) => date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());

/** A styled, keyboard-operable calendar popover. ISO/Gregorian remains the stable value; Intl controls its calendar and digit presentation. */
export function CalendarDateInput({ id, value, onChange, locale = "en-US", calendar = "gregory" }: DateFieldProps) {
  const selected = parseISODate(value);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1, 12));
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1, 12).getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0, 12).getDate();
  const format = (date: Date, options: Intl.DateTimeFormatOptions) => {
    try { return new Intl.DateTimeFormat(locale, { ...options, calendar, timeZone: "UTC" }).format(date); }
    catch { return new Intl.DateTimeFormat("en-US", options).format(date); }
  };
  const monthLabel = format(viewMonth, { month: "long", year: "numeric" });
  const selectedLabel = value ? format(selected, { dateStyle: "full" }) : "Choose date";
  const weekdays = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const day = new Date(Date.UTC(2023, 0, 1 + index));
    return new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(day);
  }), [locale]);
  const changeMonth = (amount: number) => setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1, 12));

  return <div className="relative min-w-0">
    <button id={id} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex h-10 w-full min-w-0 items-center justify-between gap-2 border border-input bg-background px-3 text-start text-sm hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="min-w-0 truncate">{selectedLabel}</span><CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
    {open && <div role="dialog" aria-label="Choose date" className="absolute start-0 top-[calc(100%+4px)] z-50 w-[min(20rem,calc(100vw-2rem))] border border-border bg-popover p-3 text-popover-foreground shadow-xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} className="inline-flex h-8 w-8 items-center justify-center hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronLeft className="h-4 w-4" /></button>
        <div className="min-w-0 text-center"><p className="text-sm font-semibold">{monthLabel}</p><p className="text-xs text-muted-foreground">{format(viewMonth, { calendar: "gregory", month: "short", year: "numeric" })}</p></div>
        <button type="button" aria-label="Next month" onClick={() => changeMonth(1)} className="inline-flex h-8 w-8 items-center justify-center hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div role="grid" aria-label={monthLabel} className="grid grid-cols-7 gap-1">
        {weekdays.map((day, index) => <div role="columnheader" key={index} className="py-1 text-center text-xs font-medium text-muted-foreground">{day}</div>)}
        {Array.from({ length: firstDay }, (_, index) => <span aria-hidden="true" key={"empty-" + index} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day, 12);
          const iso = toISODate(date);
          const isSelected = iso === value;
          return <button key={iso} type="button" role="gridcell" aria-selected={isSelected} aria-label={format(date, { dateStyle: "full" })} onClick={() => { onChange(iso); setOpen(false); }} className={"h-9 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>{format(date, { day: "numeric" })}</button>;
        })}
      </div>
      <div className="mt-3 flex justify-between border-t border-border pt-3">
        <button type="button" onClick={() => { const today = new Date(); const iso = toISODate(today); onChange(iso); setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1, 12)); setOpen(false); }} className="text-sm font-medium text-primary hover:underline">Today</button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
      </div>
    </div>}
  </div>;
}

/** Styled time selector with direct text entry and a bounded, scrollable quarter-hour list. */
export function ClockTimeInput({ id, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => Array.from({ length: 96 }, (_, index) => pad(Math.floor(index / 4)) + ":" + pad((index % 4) * 15)), []);
  const normalized = /^([01]\\d|2[0-3]):[0-5]\\d$/.test(value) ? value : "12:00";
  return <div className="relative min-w-0">
    <div className="flex h-10 items-center border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
      <input id={id} type="text" inputMode="numeric" autoComplete="off" aria-label="Time in 24-hour format" placeholder="HH:MM" value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setOpen(true)} onBlur={(event) => { if (!event.currentTarget.parentElement?.parentElement?.contains(event.relatedTarget as Node | null)) setOpen(false); }} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm tabular-nums outline-none" />
      <button type="button" aria-label="Choose time" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="inline-flex h-full items-center px-3 text-muted-foreground hover:bg-accent/40"><Clock3 className="h-4 w-4" /></button>
    </div>
    {open && <div role="listbox" aria-label="Time options" className="absolute start-0 top-[calc(100%+4px)] z-50 max-h-56 w-full min-w-40 overflow-y-auto border border-border bg-popover p-1 text-popover-foreground shadow-xl">
      {options.map((option) => <button key={option} type="button" role="option" aria-selected={normalized === option} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(option); setOpen(false); }} className={"block w-full px-3 py-1.5 text-start text-sm tabular-nums hover:bg-accent " + (normalized === option ? "bg-accent font-medium" : "")}>{option}</button>)}
    </div>}
  </div>;
}
