export type CalendarParts = { year: number; month: number; day: number; era: string; monthName: string; key: string };
const pad = (value: number) => String(value).padStart(2, "0");
export const parseISODate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return new Date(NaN);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]) ? date : new Date(NaN);
};
export const toISODate = (date: Date) => date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
export const addDays = (date: Date, amount: number) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  result.setDate(result.getDate() + amount);
  return result;
};
export const normalizeCalendarDigits = (value: string) => value.replace(/[۰-۹٠-٩]/g, (digit) => {
  const persian = "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
  if (persian >= 0) return String(persian);
  const arabic = "٠١٢٣٤٥٦٧٨٩".indexOf(digit);
  return arabic >= 0 ? String(arabic) : digit;
});
const numericPart = (value: string | undefined) => Number(normalizeCalendarDigits(value ?? ""));
const makeFormatter = (locale: string, calendar: string, numberingSystem = "locale", options: Intl.DateTimeFormatOptions = {}) =>
  new Intl.DateTimeFormat(locale, { calendar, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem, ...options });
export const calendarParts = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale"): CalendarParts => {
  const parts = makeFormatter(locale, calendar, numberingSystem, { era: "short", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const year = numericPart(get("year"));
  const month = numericPart(get("month"));
  const day = numericPart(get("day"));
  const era = get("era");
  const monthName = makeFormatter(locale, calendar, numberingSystem, { month: "long" }).format(date);
  return { year, month, day, era, monthName, key: [era, year, month, monthName].join("|") };
};
export const formatCalendarDate = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale", options: Intl.DateTimeFormatOptions = { dateStyle: "full" }) =>
  makeFormatter(locale, calendar, numberingSystem, options).format(date);
export const formatCalendarNumber = (value: number, locale = "en-US", numberingSystem = "locale") =>
  new Intl.NumberFormat(locale, { useGrouping: false, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem }).format(value);
export const localizeCalendarDigits = (value: string, locale = "en-US", numberingSystem = "locale") =>
  value.replace(/\d/g, (digit) => formatCalendarNumber(Number(digit), locale, numberingSystem));
export const calendarWeekStart = (locale: string) => locale.startsWith("fa") ? 6 : (locale.startsWith("en-US") || locale.startsWith("ar")) ? 0 : 1;
export type CalendarMonth = { first: Date; last: Date; dates: Date[]; year: number; month: number; monthName: string; key: string; offset: number; weekStartDay: number };
export const calendarMonth = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale"): CalendarMonth => {
  const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const selectedParts = calendarParts(selected, locale, calendar, numberingSystem);
  let first = selected;
  for (let i = 0; i < 35; i++) {
    const previous = addDays(first, -1);
    if (calendarParts(previous, locale, calendar, numberingSystem).key !== selectedParts.key) break;
    first = previous;
  }
  const dates: Date[] = [];
  let last = first;
  for (let i = 0; i < 35; i++) {
    const current = addDays(first, i);
    if (calendarParts(current, locale, calendar, numberingSystem).key !== selectedParts.key) break;
    dates.push(current);
    last = current;
  }
  const weekStartDay = calendarWeekStart(locale);
  return { first, last, dates, year: selectedParts.year, month: selectedParts.month, monthName: selectedParts.monthName, key: selectedParts.key, offset: (first.getDay() - weekStartDay + 7) % 7, weekStartDay };
};
export const moveCalendarMonth = (date: Date, amount: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  if (!Number.isFinite(amount) || amount === 0) return new Date(date);
  const direction = amount > 0 ? 1 : -1;
  let cursor = new Date(date);
  const desiredDay = calendarParts(date, locale, calendar, numberingSystem).day;
  for (let step = 0; step < Math.min(Math.abs(Math.trunc(amount)), 2400); step++) {
    const current = calendarMonth(cursor, locale, calendar, numberingSystem);
    const probe = addDays(direction > 0 ? current.last : current.first, direction);
    const target = calendarMonth(probe, locale, calendar, numberingSystem);
    cursor = addDays(target.first, Math.min(desiredDay, target.dates.length) - 1);
  }
  return cursor;
};
export const addCalendarMonths = moveCalendarMonth;
const yearOffsets: Record<string, number> = { persian: 621, islamic: 579, "islamic-umalqura": 579, hebrew: -3761, buddhist: -543, indian: 78, gregory: 0 };
export const calendarMonthsInYear = (year: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  const start = new Date(year + (yearOffsets[calendar] ?? 0) - 1, 0, 1, 12);
  const months = new Map<string, { key: string; value: string; label: string; date: Date; number: number }>();
  for (let i = 0; i < 1100; i++) {
    const date = addDays(start, i);
    const parts = calendarParts(date, locale, calendar, numberingSystem);
    if (parts.year === year) {
      const month = calendarMonth(date, locale, calendar, numberingSystem);
      months.set(parts.key, { key: parts.key, value: parts.key, label: parts.monthName, date: month.first, number: parts.month });
    }
  }
  return Array.from(months.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
};
export const findCalendarMonth = (year: number, month: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  const months = calendarMonthsInYear(year, locale, calendar, numberingSystem);
  return months.find((item) => item.number === month)?.date ?? months[0]?.date ?? new Date(NaN);
};
export const addCalendarYears = (date: Date, amount: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  if (!Number.isFinite(amount) || amount === 0) return new Date(date);
  const source = calendarParts(date, locale, calendar, numberingSystem);
  const targetYear = source.year + Math.trunc(amount);
  const months = calendarMonthsInYear(targetYear, locale, calendar, numberingSystem);
  const sourceMonths = calendarMonthsInYear(source.year, locale, calendar, numberingSystem);
  const sourceIndex = sourceMonths.findIndex((item) => item.number === source.month && item.label === source.monthName);
  const targetMonth = months[Math.min(Math.max(sourceIndex, 0), months.length - 1)];
  if (!targetMonth) return new Date(NaN);
  const target = calendarMonth(targetMonth.date, locale, calendar, numberingSystem);
  return addDays(target.first, Math.min(source.day, target.dates.length) - 1);
};
