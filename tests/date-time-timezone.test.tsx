import { describe, expect, it } from "vitest";
import { zonedLocalToUtc } from "@/lib/date-time/timezone";

describe("IANA time-zone wall-time conversion", () => {
  it("converts an ordinary wall time using the zone's actual offset", () => {
    expect(zonedLocalToUtc("2026-01-15", "12:00", "America/New_York").toISOString())
      .toBe("2026-01-15T17:00:00.000Z");
  });

  it("preserves seconds in the selected zone", () => {
    expect(zonedLocalToUtc("2026-01-15", "12:34:56", "America/New_York").toISOString())
      .toBe("2026-01-15T17:34:56.000Z");
  });

  it("rejects a local time skipped by a forward daylight-saving transition", () => {
    expect(() => zonedLocalToUtc("2026-03-08", "02:30", "America/New_York"))
      .toThrow(/does not exist/);
  });

  it("chooses the earlier instant when a backward transition repeats a local time", () => {
    expect(zonedLocalToUtc("2026-11-01", "01:30", "America/New_York").toISOString())
      .toBe("2026-11-01T05:30:00.000Z");
  });

  it("converts a valid wall time after a forward daylight-saving transition", () => {
    expect(zonedLocalToUtc("2026-03-08", "03:30", "America/New_York").toISOString())
      .toBe("2026-03-08T07:30:00.000Z");
  });

  it("preserves fractional seconds to millisecond precision in the selected zone", () => {
    expect(zonedLocalToUtc("2026-01-15", "12:34:56.123", "America/New_York").toISOString())
      .toBe("2026-01-15T17:34:56.123Z");
  });

  it("normalizes one- and two-digit fractional seconds to milliseconds", () => {
    expect(zonedLocalToUtc("2026-01-15", "12:34:56.1", "UTC").toISOString())
      .toBe("2026-01-15T12:34:56.100Z");
    expect(zonedLocalToUtc("2026-01-15", "12:34:56.12", "UTC").toISOString())
      .toBe("2026-01-15T12:34:56.120Z");
  });

  it("rejects fractional precision beyond the supported millisecond precision", () => {
    expect(() => zonedLocalToUtc("2026-01-15", "12:34:56.1234", "UTC"))
      .toThrow(/valid ISO date and 24-hour time/);
  });

  it("keeps fractional seconds through a daylight-saving overlap using the earlier instant", () => {
    expect(zonedLocalToUtc("2026-11-01", "01:30:00.456", "America/New_York").toISOString())
      .toBe("2026-11-01T05:30:00.456Z");
  });

  it("rejects invalid calendar dates and unknown time zones explicitly", () => {
    expect(() => zonedLocalToUtc("2026-02-30", "12:00", "UTC")).toThrow(/valid calendar date/);
    expect(() => zonedLocalToUtc("2026-10-23", "12:00", "Not/A_Zone")).toThrow(/Unsupported time zone/);
  });

  it("keeps the canonical instant while the selected calendar changes its displayed date parts", () => {
    const instant = zonedLocalToUtc("2026-10-23", "12:00", "Asia/Baku");
    const gregorian = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Baku", calendar: "gregory", numberingSystem: "latn",
      year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(instant);
    const persian = new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Baku", calendar: "persian", numberingSystem: "latn",
      year: "numeric", month: "numeric", day: "numeric",
    }).formatToParts(instant);
    const values = (parts: Intl.DateTimeFormatPart[], type: string) => parts.find(part => part.type === type)?.value;
    expect([values(gregorian, "year"), values(gregorian, "month"), values(gregorian, "day")]).toEqual(["2026", "10", "23"]);
    expect([values(persian, "year"), values(persian, "month"), values(persian, "day")]).toEqual(["1405", "8", "1"]);
    expect(instant.toISOString()).toBe("2026-10-23T08:00:00.000Z");
  });
});
