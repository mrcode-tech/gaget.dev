export type CalendarParts = { year: number; month: number; day: number; era: string; monthName: string; key: string };
const pad = (value: number) => String(value).padStart(2, "0");
export const parseISODate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return new Date(NaN);
  const date = new Date(0);
  date.setFullYear(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  date.setHours(12, 0, 0, 0);
  return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]) ? date : new Date(NaN);
};
export const toISODate = (date: Date) => String(date.getFullYear()).padStart(4, "0") + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
export const addDays = (date: Date, amount: number) => {
  const result = new Date(date.getTime());
  result.setHours(12, 0, 0, 0);
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
const formatterCache = new Map<string, Intl.DateTimeFormat>();
const makeFormatter = (locale: string, calendar: string, numberingSystem = "locale", options: Intl.DateTimeFormatOptions = {}) => {
  const resolvedOptions = { calendar, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem, ...options };
  const key = JSON.stringify([locale, resolvedOptions]);
  let cached = formatterCache.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat(locale, resolvedOptions);
    formatterCache.set(key, cached);
  }
  return cached;
};
const rawCalendarParts = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale"): CalendarParts => {
  const parts = makeFormatter(locale, calendar, numberingSystem, { era: "short", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const year = numericPart(get("year"));
  const month = numericPart(get("month"));
  const day = numericPart(get("day"));
  const canonicalEraParts = makeFormatter("en-US", calendar, "latn", { era: "short", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const era = canonicalEraParts.find((part) => part.type === "era")?.value ?? "";
  const monthName = makeFormatter(locale, calendar, numberingSystem, { month: "long" }).format(date);
  const monthIdentity = Number.isFinite(month) ? month : "named";
  return { year, month, day, era, monthName, key: [era, year, monthIdentity].join("|") };
};
export const calendarParts = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale"): CalendarParts => {
  const parts = rawCalendarParts(date, locale, calendar, numberingSystem);
  if (Number.isFinite(parts.month)) {
    return { ...parts, key: [parts.era, parts.year, parts.month].join("|") };
  }
  // Named-month calendars (notably Hebrew) get a chronological month ordinal.
  // Localized month names are labels only and never become internal IDs.
  const months = calendarMonthsInYear(parts.year, locale, calendar, numberingSystem);
  const current = date.getTime();
  const month = [...months].reverse().find((item) => item.date.getTime() <= current)?.number ?? 1;
  return { ...parts, month, key: [parts.era, parts.year, month].join("|") };
};
export const formatCalendarDate = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale", options: Intl.DateTimeFormatOptions = { dateStyle: "full" }) =>
  makeFormatter(locale, calendar, numberingSystem, options).format(date);

/** Format the day number directly with Intl's selected calendar, rather than deriving its display from a Gregorian Date.getDate(). */
export const formatCalendarDay = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale") =>
  makeFormatter(locale, calendar, numberingSystem, { day: "numeric" }).format(date);
export const formatCalendarNumber = (value: number, locale = "en-US", numberingSystem = "locale") =>
  new Intl.NumberFormat(locale, { useGrouping: false, numberingSystem: numberingSystem === "locale" ? undefined : numberingSystem }).format(value);
export const localizeCalendarDigits = (value: string, locale = "en-US", numberingSystem = "locale") =>
  value.replace(/\d/g, (digit) => formatCalendarNumber(Number(digit), locale, numberingSystem));
export const calendarWeekStart = (locale: string) => locale.startsWith("fa") ? 6 : (locale.startsWith("en-US") || locale.startsWith("ar")) ? 0 : 1;
export type CalendarMonth = { first: Date; last: Date; dates: Date[]; year: number; month: number; monthName: string; key: string; offset: number; weekStartDay: number };
export const calendarMonth = (date: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale"): CalendarMonth => {
  const selected = new Date(date.getTime());
  selected.setHours(12, 0, 0, 0);
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
const calendarYearMonthCache = new Map<string, Array<{ key: string; value: string; label: string; date: Date; number: number }>>();
const MAX_SUPPORTED_CALENDAR_YEAR_DAYS = 400;

/** Resolve year boundaries by correcting from a real date using measured calendar-year lengths. */
const findCalendarYearStart = (year: number, locale: string, calendar: string, numberingSystem: string): Date | null => {
  if (!Number.isInteger(year) || year < 1 || year > 9999) return null;
  let cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const current = rawCalendarParts(cursor, locale, calendar, numberingSystem);
    if (current.year === year) {
      let first = cursor;
      let walkedBack = 0;
      while (walkedBack < MAX_SUPPORTED_CALENDAR_YEAR_DAYS) {
        const previous = addDays(first, -1);
        const parts = rawCalendarParts(previous, locale, calendar, numberingSystem);
        if (parts.year !== current.year || parts.era !== current.era) break;
        first = previous;
        walkedBack += 1;
      }
      const firstParts = rawCalendarParts(first, locale, calendar, numberingSystem);
      return firstParts.year === year && firstParts.era === current.era ? first : null;
    }

    let firstOfCurrentYear = cursor;
    let walkedBack = 0;
    while (walkedBack < MAX_SUPPORTED_CALENDAR_YEAR_DAYS) {
      const previous = addDays(firstOfCurrentYear, -1);
      const parts = rawCalendarParts(previous, locale, calendar, numberingSystem);
      if (parts.year !== current.year || parts.era !== current.era) break;
      firstOfCurrentYear = previous;
      walkedBack += 1;
    }

    let currentYearLength = 0;
    let probe = firstOfCurrentYear;
    while (currentYearLength < MAX_SUPPORTED_CALENDAR_YEAR_DAYS) {
      const parts = rawCalendarParts(probe, locale, calendar, numberingSystem);
      if (parts.year !== current.year || parts.era !== current.era) break;
      currentYearLength += 1;
      probe = addDays(probe, 1);
    }
    if (currentYearLength === 0 || currentYearLength >= MAX_SUPPORTED_CALENDAR_YEAR_DAYS) return null;

    const yearDelta = year - current.year;
    cursor = addDays(cursor, Math.sign(yearDelta) * Math.max(1, Math.round(Math.abs(yearDelta) * currentYearLength)));
    if (Number.isNaN(cursor.getTime())) return null;
  }
  return null;
};

export const calendarMonthsInYear = (year: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  const cacheKey = JSON.stringify([year, locale, calendar, numberingSystem]);
  const cached = calendarYearMonthCache.get(cacheKey);
  if (cached) return cached;

  const first = findCalendarYearStart(year, locale, calendar, numberingSystem);
  if (!first) {
    calendarYearMonthCache.set(cacheKey, []);
    return [];
  }

  const yearParts = rawCalendarParts(first, locale, calendar, numberingSystem);
  const months: Array<{ key: string; value: string; label: string; date: Date; number: number }> = [];
  let cursor = first;
  for (let elapsed = 0; elapsed < MAX_SUPPORTED_CALENDAR_YEAR_DAYS; elapsed += 1) {
    const parts = rawCalendarParts(cursor, locale, calendar, numberingSystem);
    if (parts.year !== year || parts.era !== yearParts.era) break;
    if (parts.day === 1) {
      const number = Number.isFinite(parts.month) ? parts.month : months.length + 1;
      const key = [parts.era, parts.year, number].join("|");
      months.push({ key, value: key, label: parts.monthName, date: cursor, number });
    }
    cursor = addDays(cursor, 1);
  }
  calendarYearMonthCache.set(cacheKey, months);
  return months;
};

export const findCalendarMonth = (year: number, month: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  const months = calendarMonthsInYear(year, locale, calendar, numberingSystem);
  return months.find((item) => item.number === month)?.date ?? months[0]?.date ?? new Date(NaN);
};

const calendarYearLengthCache = new Map<string, number | null>();
export const calendarYearLength = (year: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale"): number | null => {
  const cacheKey = JSON.stringify([year, locale, calendar, numberingSystem]);
  if (calendarYearLengthCache.has(cacheKey)) return calendarYearLengthCache.get(cacheKey) ?? null;
  const first = calendarMonthsInYear(year, locale, calendar, numberingSystem)[0]?.date;
  if (!first || Number.isNaN(first.getTime())) {
    calendarYearLengthCache.set(cacheKey, null);
    return null;
  }
  const era = calendarParts(first, locale, calendar, numberingSystem).era;
  let cursor = first;
  let length = 0;
  while (length < 400) {
    const parts = calendarParts(cursor, locale, calendar, numberingSystem);
    if (parts.year !== year || parts.era !== era) break;
    length += 1;
    cursor = addDays(cursor, 1);
  }
  const result = length > 0 && length < 400 ? length : null;
  calendarYearLengthCache.set(cacheKey, result);
  return result;
};
export const addCalendarYears = (date: Date, amount: number, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  if (!Number.isFinite(amount) || amount === 0) return new Date(date);
  const source = calendarParts(date, locale, calendar, numberingSystem);
  const targetYear = source.year + Math.trunc(amount);
  const months = calendarMonthsInYear(targetYear, locale, calendar, numberingSystem);
  const sourceMonths = calendarMonthsInYear(source.year, locale, calendar, numberingSystem);
  const sourceIndex = sourceMonths.findIndex((item) => item.number === source.month);
  const targetMonth = months[Math.min(Math.max(sourceIndex, 0), months.length - 1)];
  if (!targetMonth) return new Date(NaN);
  const target = calendarMonth(targetMonth.date, locale, calendar, numberingSystem);
  return addDays(target.first, Math.min(source.day, target.dates.length) - 1);
};

export const calendarAge = (from: Date, to: Date, locale = "en-US", calendar = "gregory", numberingSystem = "locale") => {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to.getTime() < from.getTime()) return null;
  const fromParts = calendarParts(from, locale, calendar, numberingSystem);
  const toParts = calendarParts(to, locale, calendar, numberingSystem);
  let years = Math.max(0, toParts.year - fromParts.year);
  let cursor = addCalendarYears(from, years, locale, calendar, numberingSystem);
  while (years > 0 && cursor.getTime() > to.getTime()) {
    years -= 1;
    cursor = addCalendarYears(from, years, locale, calendar, numberingSystem);
  }
  let months = 0;
  while (months < 13) {
    const next = addCalendarMonths(cursor, 1, locale, calendar, numberingSystem);
    if (Number.isNaN(next.getTime()) || next.getTime() <= cursor.getTime() || next.getTime() > to.getTime()) break;
    cursor = next;
    months += 1;
  }
  const days = Math.round((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())) / 86400000);
  return { years, months, days };
};
