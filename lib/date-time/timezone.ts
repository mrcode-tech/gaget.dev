type WallTime = { year: number; month: number; day: number; hour: number; minute: number; second: number; millisecond: number };

function utcMillis(parts: WallTime): number {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(parts.hour, parts.minute, parts.second, parts.millisecond);
  return date.getTime();
}

function parseWallTime(date: string, time: string): WallTime {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):([0-5]\d)(?::([0-5]\d)(?:\.(\d{1,3}))?)?$/.exec(time);
  if (!dateMatch || !timeMatch) throw new Error("Enter a valid ISO date and 24-hour time.");

  const parts: WallTime = {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]),
    minute: Number(timeMatch[2]),
    second: Number(timeMatch[3] ?? 0),
    millisecond: Number((timeMatch[4] ?? "").padEnd(3, "0") || 0),
  };
  if (parts.hour > 23) throw new Error("Enter a valid ISO date and 24-hour time.");
  const check = new Date(utcMillis({ ...parts, hour: 0, minute: 0, second: 0, millisecond: 0 }));
  if (check.getUTCFullYear() !== parts.year || check.getUTCMonth() + 1 !== parts.month || check.getUTCDate() !== parts.day) {
    throw new Error("Enter a valid calendar date.");
  }
  return parts;
}

function formatterForZone(timeZone: string): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    throw new Error("Unsupported time zone: " + timeZone);
  }
}

function wallPartsAt(instant: number, formatter: Intl.DateTimeFormat): WallTime {
  const parts = formatter.formatToParts(new Date(instant));
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? NaN);
  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
    millisecond: 0,
  };
}

function sameWallTime(a: WallTime, b: WallTime): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day &&
    a.hour === b.hour && a.minute === b.minute && a.second === b.second;
}

function offsetAt(instant: number, formatter: Intl.DateTimeFormat): number {
  const wholeSecond = Math.floor(instant / 1000) * 1000;
  return utcMillis(wallPartsAt(wholeSecond, formatter)) - wholeSecond;
}

/**
 * Convert a local wall time in an IANA zone to an instant.
 * Nonexistent wall times during a forward clock jump are rejected. If the wall
 * time occurs twice during a backward clock change, the earlier instant wins.
 */
export function zonedLocalToUtc(date: string, time: string, timeZone: string): Date {
  const target = parseWallTime(date, time);
  const nominalUtc = utcMillis(target);
  const formatter = formatterForZone(timeZone);
  const offsets = new Set<number>();

  // Sample both sides of the requested wall time to capture the offsets on
  // either side of daylight-saving transitions and date-line changes.
  for (let hours = -48; hours <= 48; hours += 3) {
    offsets.add(offsetAt(nominalUtc + hours * 60 * 60 * 1000, formatter));
  }

  const candidates = [...offsets]
    .map((offset) => nominalUtc - offset)
    .filter((instant) => sameWallTime(wallPartsAt(instant, formatter), target))
    .sort((a, b) => a - b);

  if (candidates.length === 0) {
    throw new Error("That local time does not exist in " + timeZone + " because of a daylight-saving or time-zone transition.");
  }
  return new Date(candidates[0]);
}
