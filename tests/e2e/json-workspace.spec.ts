import { expect, test } from "@playwright/test";

test.describe("JSON workspace responsive editor and diagnostics", () => {
  for (const viewport of [
    { name: "wide desktop", width: 1440, height: 900 },
    { name: "tablet portrait", width: 768, height: 1024 },
    { name: "mobile portrait", width: 390, height: 640 },
    { name: "mobile landscape short height", width: 844, height: 390 },
  ]) {
    test(`supports ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/json/formatter");
      const editor = page.getByRole("textbox", { name: "Input JSON" });
      await expect(editor).toBeVisible();
      await editor.fill('{"first": 1,\n  "second": }');
      await page.getByRole("button", { name: "Features" }).click();
      await page.getByRole("menuitemradio", { name: /Validate/ }).click();
      await page.getByRole("button", { name: "Run operation" }).click();
      const diagnostic = page.getByRole("button", { name: /Go to line 2, column 13/ });
      await expect(diagnostic).toBeVisible();
      await diagnostic.click();
      await expect(editor).toBeFocused();
      await expect(editor).toHaveValue('{"first": 1,\n  "second": }');
      const numbers = page.getByTestId("json-line-numbers");
      await expect(numbers).toContainText("1\n2");
      await page.getByRole("button", { name: "Features" }).click();
      const menu = page.getByTestId("json-features-menu");
      await expect(menu).toBeVisible();
      const menuBox = await menu.boundingBox();
      expect(menuBox).not.toBeNull();
      if (menuBox) {
        expect(menuBox.x).toBeGreaterThanOrEqual(-1);
        expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width + 1);\n        expect(menuBox.y).toBeGreaterThanOrEqual(-1);\n        expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(viewport.height + 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    });
  }

  test("preserves the loaded document across viewport changes and supports compare compatibility route", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/json/formatter");
    const editor = page.getByRole("textbox", { name: "Input JSON" });
    await editor.fill('{"kept":"content"}');
    await page.setViewportSize({ width: 390, height: 640 });
    await expect(editor).toHaveValue('{"kept":"content"}');
    await page.goto("/json/diff");
    await expect(page.getByRole("textbox", { name: "JSON A input" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "JSON B input" })).toBeVisible();
    await page.getByRole("textbox", { name: "JSON A input" }).fill('{"a":1}');
    await page.getByRole("textbox", { name: "JSON B input" }).fill('{"a":2}');
    await page.getByRole("button", { name: "Run operation" }).click();
    await expect(page.getByText("$.a")).toBeVisible();
  });
});

test("imports and downloads JSON locally through the File menu", async ({ page }) => {
  await page.goto("/json/formatter");
  const file = page.locator('input[type="file"]');
  await file.setInputFiles({
    name: "imported.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"imported":true}'),
  });
  const editor = page.getByRole("textbox", { name: "Input JSON" });
  await expect(editor).toHaveValue('{"imported":true}');
  await page.getByRole("button", { name: "File" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "Download JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("document.json");
});

for (const localePrefix of ["/fa", "/ar"]) {
  test(`keeps JSON source left-to-right in RTL locale ${localePrefix}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.goto(localePrefix + "/json/formatter");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const editor = page.locator("textarea").first();
    await expect(editor).toHaveAttribute("dir", "ltr");
    await editor.fill('{"rtl":"متن","count":2}');
    await page.getByTestId("json-editor-menubar").getByRole("button").last().click();
    await expect(page.getByTestId("json-features-menu")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });
}
