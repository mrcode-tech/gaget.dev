import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const calendars = [
  "gregory",
  "persian",
  "islamic",
  "islamic-umalqura",
  "hebrew",
  "buddhist",
  "indian",
];

async function seedWorkspace(
  page: Page,
  slug: string,
  calendar: string,
  timeZone: string,
  state: Record<string, string> = {},
) {
  await page.goto("/");
  await page.evaluate(({ feature, selectedCalendar, zone, savedState }) => {
    sessionStorage.setItem("gaget.datetime.preferences.v1", JSON.stringify({
      calendar: selectedCalendar,
      numberingSystem: "latn",
      timeZone: zone,
      hourCycle: "h23",
      showSeconds: true,
    }));
    sessionStorage.setItem("gaget.datetime.workbench.v1." + feature, JSON.stringify({
      dateA: "2026-10-23",
      dateB: "2026-10-24",
      number: "1",
      unit: "months",
      time: "12:00",
      fromZone: zone,
      toZone: "America/New_York",
      timestamp: "1792065600",
      title: "GaGet.dev test event",
      eventTime: "12:00",
      icsText: "",
      status: "",
      cron: "*/15 * * * *",
      weekend: "0,6",
      year: "2026",
      month: "10",
      ...savedState,
    }));
  }, { feature: slug, selectedCalendar: calendar, zone: timeZone, savedState: state });
}

test("global Persian locale stays RTL while every supported calendar formats the same canonical date", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/fa/datetime/editor?feature=date-converter");

  await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("combobox", { name: "Display language" })).toHaveCount(0);
  const calendar = page.getByRole("combobox", { name: "Calendar system" });
  const dateField = page.locator("#convert-date");
  await expect(dateField).toHaveAttribute("data-canonical-date", /^\d{4}-\d{2}-\d{2}$/);
  const canonicalDate = (await dateField.getAttribute("data-canonical-date"))!;

  for (const value of calendars) {
    await calendar.selectOption(value);
    await expect(calendar).toHaveValue(value);
    await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("combobox", { name: "Display language" })).toHaveCount(0);
    await expect(dateField).toHaveAttribute("data-canonical-date", canonicalDate);
    const formatted = await page.evaluate(({ selectedCalendar, isoDate }) => {
      const [year, month, day] = isoDate.split("-").map(Number);
      const date = new Date(0);
      date.setFullYear(year, month - 1, day);
      date.setHours(12, 0, 0, 0);
      return new Intl.DateTimeFormat("fa", { calendar: selectedCalendar, dateStyle: "full" }).format(date);
    }, { selectedCalendar: value, isoDate: canonicalDate });
    await expect(page.locator("pre")).toContainText(formatted);
  }
});

test("changing the global locale preserves a custom canonical date and selected calendar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await seedWorkspace(page, "date-converter", "persian", "Asia/Baku", {
    dateA: "2024-02-29",
    dateB: "2024-03-30",
  });
  await page.goto("/datetime/editor?feature=date-converter");

  const calendar = page.getByRole("combobox", { name: "Calendar system" });
  const dateField = page.locator("#convert-date");
  await expect(calendar).toHaveValue("persian");
  await expect(dateField).toHaveAttribute("data-canonical-date", "2024-02-29");

  await page.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "Italiano" }).click();

  await expect(page).toHaveURL(/\/it\/datetime\/editor\?feature=date-converter/);
  await expect(page.locator("main")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("combobox", { name: "Calendar system" })).toHaveValue("persian");
  await expect(page.locator("#convert-date")).toHaveAttribute("data-canonical-date", "2024-02-29");
});

test("Persian date difference uses canonical elapsed days", async ({ page }) => {
  await seedWorkspace(page, "date-difference", "persian", "Asia/Baku", {
    dateA: "2026-10-23",
    dateB: "2026-10-24",
  });
  await page.goto("/fa/datetime/editor?feature=date-difference");

  await expect(page.getByRole("combobox", { name: "Calendar system" })).toHaveValue("persian");
  await expect(page.locator("#date-a")).toHaveAttribute("data-canonical-date", "2026-10-23");
  await expect(page.locator("#date-b")).toHaveAttribute("data-canonical-date", "2026-10-24");
  await expect(page.locator("pre")).toContainText("1 elapsed days");
});

test("Persian and Islamic calendar arithmetic respects month and year boundaries", async ({ page }) => {
  const cases: { calendar: string; unit: string; date: string; amount?: string; expectedMonth?: string; expectedYear: string }[] = [
    { calendar: "persian", unit: "months", date: "2026-10-23", expectedMonth: "Azar", expectedYear: "1405" },
    { calendar: "persian", unit: "months", date: "2026-10-23", amount: "-1", expectedMonth: "Mehr", expectedYear: "1405" },
    { calendar: "persian", unit: "years", date: "2026-10-23", expectedMonth: "Aban", expectedYear: "1406" },
    { calendar: "islamic", unit: "years", date: "2026-10-23", expectedYear: "1449" },
  ];

  for (const item of cases) {
    await seedWorkspace(page, "date-calculator", item.calendar, "UTC", {
      dateA: item.date,
      number: item.amount ?? "1",
      unit: item.unit,
    });
    await page.goto("/datetime/editor?feature=date-calculator");
    await expect(page.getByRole("combobox", { name: "Calendar system" })).toHaveValue(item.calendar);
    await expect(page.locator("#date-a")).toHaveAttribute("data-canonical-date", item.date);
    const result = page.locator("pre");
    await expect(result).toContainText(item.expectedYear);
    if (item.expectedMonth) await expect(result).toContainText(item.expectedMonth);
  }
});

test("timestamp JSON and ICS exports keep the canonical date and selected-zone instant", async ({ page }) => {
  await seedWorkspace(page, "json", "persian", "Asia/Baku", { dateA: "2026-10-23" });
  await page.goto("/datetime/editor?feature=json");
  await expect(page.getByRole("combobox", { name: "Calendar system" })).toHaveValue("persian");
  await expect(page.locator("pre")).toContainText('"isoDate": "2026-10-23"');
  await expect(page.locator("pre")).toContainText('"instantAtNoon": "2026-10-23T08:00:00.000Z"');

  await seedWorkspace(page, "ics-generator", "persian", "Asia/Baku", {
    dateA: "2026-10-23",
    eventTime: "12:00",
    title: "GaGet.dev test event",
  });
  await page.goto("/datetime/editor?feature=ics-generator");
  await expect(page.getByRole("combobox", { name: "Calendar system" })).toHaveValue("persian");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download .ics event" }).click(),
  ]);
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const ics = await readFile(downloadPath!, "utf8");
  expect(ics).toContain("DTSTART:20261023T080000Z");
  expect(ics).toContain("DTEND:20261023T090000Z");
});

test("time-zone conversion rejects a nonexistent local time at a DST boundary", async ({ page }) => {
  await seedWorkspace(page, "meeting-planner", "gregory", "America/New_York", {
    dateA: "2026-03-08",
    time: "02:30",
    fromZone: "America/New_York",
    toZone: "Europe/London",
  });
  await page.goto("/datetime/editor?feature=meeting-planner");
  await page.getByRole("button", { name: "Convert time" }).click();
  await expect(page.getByText(/does not exist/)).toBeVisible();
});
