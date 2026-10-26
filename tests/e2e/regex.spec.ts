import { expect, test } from "@playwright/test";

test("Regex Tester renders and finds matches with capture groups", async ({ page }) => {
  await page.goto("/text/regex");
  await expect(page.getByRole("heading", { name: "Regex Tester" })).toBeVisible();
  await page.getByLabel("Pattern").fill("(\\w+):(\\d+)");
  await page.getByLabel("Flags").fill("i");
  await page.getByLabel(/Test text/).fill("port:8080\nhost:443");
  await page.getByRole("button", { name: /Test pattern/ }).click();
  await expect(page.getByRole("status")).toContainText("2 match(es) found", { timeout: 3000 });
  await expect(page.getByText(/Index 0: "port:8080"/)).toBeVisible();
  await expect(page.getByText(/Captures: \["port","8080"\]/)).toBeVisible();
});

test("Regex Tester reports invalid syntax and supports keyboard-accessible clear", async ({ page }) => {
  await page.goto("/text/regex");
  await page.getByLabel("Pattern").fill("[");
  await page.getByRole("button", { name: /Test pattern/ }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByLabel("Pattern")).toHaveValue("");
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("Regex Tester keeps the document usable in narrow RTL layouts", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/fa/text/regex");
  await expect(page.getByRole("heading", { name: "Regex Tester" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
