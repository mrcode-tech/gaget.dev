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


test("changing the global locale preserves the selected calendar and canonical date", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/datetime/editor?feature=date-converter");
  const calendar = page.getByRole("combobox", { name: "Calendar system" });
  await calendar.selectOption("persian");
  await expect(calendar).toHaveValue("persian");
  const dateField = page.locator("#convert-date");
  const canonicalDate = await dateField.getAttribute("data-canonical-date");
  expect(canonicalDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

  await page.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "Italiano" }).click();

  await expect(page).toHaveURL(/\/it\/datetime\/editor\?feature=date-converter/);
  await expect(page.locator("main")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("combobox", { name: "Calendar system" })).toHaveValue("persian");
  await expect(page.locator("#convert-date")).toHaveAttribute("data-canonical-date", canonicalDate!);
});
