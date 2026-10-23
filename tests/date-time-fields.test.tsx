import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalendarDateInput, ClockTimeInput } from "@/components/date-time-fields";
import { addDays, addCalendarMonths, addCalendarYears, calendarAge, calendarMonth, calendarMonthsInYear, calendarParts, calendarYearLength, findCalendarMonth, formatCalendarDate, formatCalendarDay, formatCalendarNumber, parseISODate, toISODate } from "@/lib/date-time/calendar";

afterEach(() => cleanup());

describe("Date & Time reusable fields", () => {
  it("opens a calendar-system-aware date picker and emits a stable ISO date", () => {
    const onChange = vi.fn();
    render(<CalendarDateInput id="start-date" value="2026-10-19" onChange={onChange} locale="fa-IR" calendar="persian" />);
    fireEvent.click(screen.getByRole("button", { name: /۱۴۰۵|2026|Choose date/i }));
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Today" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });


  it("renders Persian day numbers and advances by a Persian month boundary", () => {
    const onChange = vi.fn();
    render(<CalendarDateInput id="persian-month" value="2026-10-22" onChange={onChange} locale="fa-IR" calendar="persian" />);
    fireEvent.click(screen.getByRole("button", { name: /مهر|۱۴۰۵|Choose date/i }));
    const grid = screen.getByRole("grid");
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    const nextGrid = screen.getByRole("grid");
    expect(nextGrid.getAttribute("aria-label")).toMatch(/آبان|Aban/i);
    const firstAban = parseISODate("2026-10-23");
    const firstAbanButton = within(nextGrid).getByRole("button", { name: formatCalendarDate(firstAban, "fa-IR", "persian", "locale", { dateStyle: "full" }) });
    expect(firstAbanButton.textContent).toBe(formatCalendarNumber(1, "fa-IR"));
  });

  it("dismisses the date picker with Escape and restores focus to its trigger", () => {
    render(<CalendarDateInput id="escape-date" value="2026-10-19" onChange={() => undefined} />);
    const trigger = screen.getByRole("button", { name: /October|2026|Choose date/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Choose date" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("localizes editable time values and options for Persian and Arabic while preserving canonical values", () => {
    const onChange = vi.fn();
    render(<ClockTimeInput id="persian-time" value="09:15" onChange={onChange} locale="fa-IR" numberingSystem="locale" />);
    const persianInput = screen.getByRole("textbox", { name: "Time in 24-hour format" }) as HTMLInputElement;
    expect(persianInput.value).toBe("۰۹:۱۵");
    fireEvent.change(persianInput, { target: { value: "۱۲:۳۰" } });
    expect(onChange).toHaveBeenCalledWith("12:30");
    cleanup();

    render(<ClockTimeInput id="arabic-time" value="09:15" onChange={onChange} locale="ar-SA" numberingSystem="locale" />);
    const arabicInput = screen.getByRole("textbox", { name: "Time in 24-hour format" }) as HTMLInputElement;
    expect(arabicInput.value).toMatch(/[٠-٩]/);
    fireEvent.click(screen.getByRole("button", { name: "Choose time" }));
    expect(screen.getByRole("option", { name: /٠٩:١٥/ })).toBeTruthy();
  });

  it("provides a bounded quarter-hour list and keeps direct time entry available", () => {
    const onChange = vi.fn();
    render(<ClockTimeInput id="meeting-time" value="09:00" onChange={onChange} />);
    expect(screen.getByRole("textbox", { name: "Time in 24-hour format" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Choose time" }));
    expect(screen.getByRole("listbox", { name: "Time options" })).toBeTruthy();
    fireEvent.click(screen.getByRole("option", { name: "09:15" }));
    expect(onChange).toHaveBeenCalledWith("09:15");
    expect(screen.queryByRole("listbox", { name: "Time options" })).toBeNull();
  });
});


describe("calendar-system date engine", () => {
  it.each([
    ["Persian Solar Hijri", "fa-IR", "persian", "2026-10-23", 1405, 8, 1],
    ["Islamic", "ar-SA", "islamic", "2026-10-23", 1448, 5, 13],
    ["Islamic Umm al-Qura", "ar-SA", "islamic-umalqura", "2026-10-23", 1448, 5, 12],
  ])("derives actual %s year, month, and day fields from the Gregorian ISO instant", (_name, locale, calendar, iso, expectedYear, expectedMonth, expectedDay) => {
    const date = parseISODate(iso);
    const parts = calendarParts(date, locale, calendar);
    expect(parts.year).toBe(expectedYear);
    expect(parts.month).toBe(expectedMonth);
    expect(parts.day).toBe(expectedDay);
    expect(toISODate(date)).toBe(iso);
  });

  it("builds a full selected-calendar month instead of a Gregorian month", () => {
    const start = parseISODate("2026-10-23");
    const month = calendarMonth(start, "fa-IR", "persian");
    expect(month.dates[0] && toISODate(month.dates[0])).toBe("2026-10-23");
    expect(calendarParts(month.first, "fa-IR", "persian").day).toBe(1);
    expect(month.dates.every(date => calendarParts(date, "fa-IR", "persian").key === month.key)).toBe(true);
    expect(month.dates.length).toBeGreaterThanOrEqual(29);
    expect(month.dates.length).toBeLessThanOrEqual(31);
  });

  it("moves across Persian month and year boundaries while preserving the intended calendar day", () => {
    const lastMehrDay = parseISODate("2026-10-22");
    const firstAban = addCalendarMonths(lastMehrDay, 1, "fa-IR", "persian");
    expect(toISODate(firstAban)).toBe("2026-11-21");
    expect(calendarParts(firstAban, "fa-IR", "persian").day).toBe(30);
    const nextYear = addCalendarYears(parseISODate("2026-03-20"), 1, "fa-IR", "persian");
    expect(calendarParts(nextYear, "fa-IR", "persian").year).toBe(1405);
  });

  it("resolves a calendar year/month to its real Gregorian date range", () => {
    const start = findCalendarMonth(1405, 8, "fa-IR", "persian");
    const month = calendarMonth(start, "fa-IR", "persian");
    expect(calendarParts(start, "fa-IR", "persian").year).toBe(1405);
    expect(calendarParts(start, "fa-IR", "persian").month).toBe(8);
    expect(calendarParts(start, "fa-IR", "persian").day).toBe(1);
    expect(month.dates[0].getTime()).toBe(start.getTime());
  });


  it.each(["gregory", "persian", "islamic", "islamic-umalqura", "hebrew", "buddhist", "indian"])("keeps every date in the actual %s calendar month", (calendar) => {
    const sample = parseISODate("2026-10-23");
    const parts = calendarParts(sample, "en-US", calendar);
    const month = calendarMonth(sample, "en-US", calendar);
    expect(calendarParts(month.first, "en-US", calendar).day).toBe(1);
    expect(month.dates.every(date => calendarParts(date, "en-US", calendar).key === parts.key)).toBe(true);
    expect(calendarParts(new Date(month.last.getFullYear(), month.last.getMonth(), month.last.getDate() + 1, 12), "en-US", calendar).key).not.toBe(parts.key);
    expect(calendarMonthsInYear(parts.year, "en-US", calendar).some(item => item.number === parts.month)).toBe(true);
  });

  it("calculates age in the selected calendar while elapsed date difference stays Gregorian", () => {
    const from = parseISODate("2025-10-23");
    const to = parseISODate("2026-10-23");
    expect(calendarAge(from, to, "fa-IR", "persian")).toEqual({ years: 1, months: 0, days: 0 });
    expect(calendarAge(to, from, "fa-IR", "persian")).toBeNull();
  });

  it("formats the day and month using the selected calendar and keeps Gregorian formatting available", () => {
    const date = parseISODate("2026-10-23");
    expect(formatCalendarDate(date, "fa-IR", "persian", "locale", { month: "long" })).toMatch(/آبان|Aban/i);
    expect(formatCalendarDate(date, "en-US", "gregory", "latn", { month: "long" })).toBe("October");
    expect(calendarParts(date, "fa-IR", "persian").day).toBe(1);
  });

  it("rejects malformed ISO dates instead of silently substituting today", () => {
    expect(Number.isNaN(parseISODate("2026-02-30").getTime())).toBe(true);
    expect(Number.isNaN(parseISODate("not-a-date").getTime())).toBe(true);
  });
});


describe("calendar picker integration", () => {
  it("renders Persian day cells using Persian day numbers while retaining stable ISO values", () => {
    const onChange = vi.fn();
    const firstAban = parseISODate("2026-10-23");
    const selectedCalendarDate = formatCalendarDate(firstAban, "fa-IR", "persian", "locale", { dateStyle: "full" });
    render(<CalendarDateInput id="persian-date" value="2026-10-23" onChange={onChange} locale="fa-IR" calendar="persian" />);
    fireEvent.click(screen.getByRole("button", { name: /۱۴۰۵|2026|Choose date/i }));
    const firstDay = screen.getByRole("button", { name: selectedCalendarDate });
    expect(firstDay.textContent).toBe(formatCalendarDay(firstAban, "fa-IR", "persian"));
    expect(firstDay.textContent).toBe(formatCalendarNumber(1, "fa-IR"));
    fireEvent.click(firstDay);
    expect(onChange).toHaveBeenCalledWith("2026-10-23");
  });
});

describe("calendar-native day formatting", () => {
  it.each([
    ["Gregorian", "en-US", "gregory", "locale"],
    ["Persian Solar Hijri", "fa-IR", "persian", "locale"],
    ["Islamic", "ar-SA", "islamic", "locale"],
    ["Islamic Umm al-Qura", "ar-SA", "islamic-umalqura", "locale"],
    ["Hebrew", "en-US", "hebrew", "latn"],
    ["Buddhist", "th-TH", "buddhist", "locale"],
    ["Indian National", "en-IN", "indian", "locale"],
  ])("formats each visible day from the %s calendar", (_name, locale, calendar, numberingSystem) => {
    const date = parseISODate("2026-10-23");
    const parts = calendarParts(date, locale, calendar, numberingSystem);
    expect(formatCalendarDay(date, locale, calendar, numberingSystem))
      .toBe(formatCalendarNumber(parts.day, locale, numberingSystem));
  });

  it("shows Persian 1 Aban as day 1 even though its Gregorian date is October 23", () => {
    const firstAban = parseISODate("2026-10-23");
    expect(calendarParts(firstAban, "fa-IR", "persian").day).toBe(1);
    expect(formatCalendarDay(firstAban, "fa-IR", "persian")).toBe(formatCalendarNumber(1, "fa-IR"));
    expect(formatCalendarDay(firstAban, "fa-IR", "persian")).not.toBe(formatCalendarNumber(firstAban.getDate(), "fa-IR"));
    expect(formatCalendarDate(firstAban, "fa-IR", "persian", "locale", { dateStyle: "full" })).toMatch(/آبان|Aban/i);
  });

  it.each([
    ["en-US", "gregory"],
    ["fa-IR", "persian"],
    ["ar-SA", "islamic"],
    ["ar-SA", "islamic-umalqura"],
    ["en-US", "hebrew"],
    ["th-TH", "buddhist"],
    ["en-IN", "indian"],
  ])("keeps the entire %s / %s month in sequential native calendar days", (locale, calendar) => {
    const selected = parseISODate("2026-10-23");
    const parts = calendarParts(selected, locale, calendar);
    const month = calendarMonth(selected, locale, calendar);
    expect(calendarParts(month.first, locale, calendar).day).toBe(1);
    expect(month.dates.map(date => calendarParts(date, locale, calendar).day))
      .toEqual(Array.from({ length: month.dates.length }, (_, index) => index + 1));
    expect(month.dates.every(date => calendarParts(date, locale, calendar).key === parts.key)).toBe(true);
    expect(calendarParts(addDays(month.last, 1), locale, calendar).key).not.toBe(parts.key);
  });
});


describe("calendar-year length and leap-year behavior", () => {
  it.each([
    [2024, "en-US", "gregory", 366],
    [1403, "fa-IR", "persian", 366],
  ])("resolves leap-year length for %s in %s / %s", (year, locale, calendar, expectedLength) => {
    expect(calendarYearLength(year, locale, calendar)).toBe(expectedLength);
  });

  it.each([
    [1448, "ar-SA", "islamic", [354, 355]],
    [1448, "ar-SA", "islamic-umalqura", [354, 355]],
    [5787, "en-US", "hebrew", [353, 354, 355, 383, 384, 385]],
    [2569, "th-TH", "buddhist", [365, 366]],
    [1948, "en-IN", "indian", [365, 366]],
  ])("returns a valid native year length for %s in %s / %s", (year, locale, calendar, expectedLengths) => {
    expect(expectedLengths).toContain(calendarYearLength(year, locale, calendar));
  });
});
