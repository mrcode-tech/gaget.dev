import { expect, test } from "@playwright/test";

const calendars = [
  "gregory",
  "persian",
  "islamic",
  "islamic-umalqura",
  "hebrew",
  "buddhist",
  "indian",
];

test("global Persian locale stays RTL while every supported calendar remains independently selectable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/fa/datetime/editor?feature=date-converter");

  await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("combobox", { name: "Display language" })).toHaveCount(0);

  const calendar = page.getByRole("combobox", { name: "Calendar system" });
  for (const value of calendars) {
    await calendar.selectOption(value);
    await expect(calendar).toHaveValue(value);
    await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("combobox", { name: "Display language" })).toHaveCount(0);
  }
});
