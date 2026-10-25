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
      if (viewport.width < 1024) {
        await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
        await expect(page.getByRole("textbox", { name: "Search tools" })).toBeHidden();
      }
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
        expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(menuBox.y).toBeGreaterThanOrEqual(-1);
        expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(viewport.height + 1);
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
    await page.getByRole("textbox", { name: "JSON A input" }).fill('{"a":1,"b":1}');
    await page.getByRole("textbox", { name: "JSON B input" }).fill('{"a":2,"b":2}');
    await page.getByRole("button", { name: "Run operation" }).click();
    await expect(page.getByText("$.a")).toBeVisible();
    await expect(page.getByText("Difference 1 of 2")).toBeVisible();
    await page.getByRole("button", { name: "Next difference" }).click();
    await expect(page.getByText("Difference 2 of 2")).toBeVisible();
    await page.getByRole("button", { name: "Previous difference" }).click();
    await expect(page.getByText("Difference 1 of 2")).toBeVisible();
  });
});

test("preserves diagnostics and an open menu across the desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/json/formatter");
  const editor = page.getByRole("textbox", { name: "Input JSON" });
  await editor.fill('{"boundary": }');
  await page.getByRole("button", { name: "Features" }).click();
  await page.getByRole("menuitemradio", { name: /^Validate/i }).click();
  await page.getByRole("button", { name: "Run operation" }).click();
  const diagnostic = page.getByRole("button", { name: /Go to line/ });
  await expect(diagnostic).toBeVisible();

  await page.setViewportSize({ width: 1023, height: 800 });
  await expect(editor).toHaveValue('{"boundary": }');
  await expect(diagnostic).toBeVisible();
  await expect(page.locator("header").first()).toBeHidden();
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Features" }).click();
  const menu = page.getByTestId("json-features-menu");
  await expect(menu).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(page.locator("header").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();
  await expect(menu).toBeVisible();
  const menuBox = await menu.boundingBox();
  expect(menuBox).not.toBeNull();
  if (menuBox) {
    expect(menuBox.x).toBeGreaterThanOrEqual(-1);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(1025);
    expect(menuBox.y).toBeGreaterThanOrEqual(-1);
    expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(801);
  }
  await page.getByRole("button", { name: "Features" }).click();
  await page.setViewportSize({ width: 1025, height: 800 });
  await expect(editor).toHaveValue('{"boundary": }');
  await expect(diagnostic).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test("finds keys and values and navigates through matches", async ({ page }) => {
  await page.goto("/json/formatter");
  await page.getByRole("button", { name: "Features" }).click();
  await page.getByRole("menuitemradio", { name: /^Find keys and values/i }).click();
  await page.getByRole("textbox", { name: "Search text" }).fill("a");
  await page.getByRole("button", { name: "Run operation" }).click();
  await expect(page.getByText(/^Match 1 of \d+$/)).toBeVisible();
  await page.getByRole("button", { name: "Next match" }).click();
  await expect(page.getByText(/^Match 2 of \d+$/)).toBeVisible();
  await page.getByRole("button", { name: "Previous match" }).click();
  await expect(page.getByText(/^Match 1 of \d+$/)).toBeVisible();
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

  await page.getByRole("button", { name: "Features" }).click();
  await page.getByRole("menuitemradio", { name: /^Escape string contents/i }).click();
  await editor.fill('raw "text"\n');
  await page.getByRole("button", { name: "Run operation" }).click();
  await page.getByRole("button", { name: "File" }).click();
  const textDownloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "Download text result" }).click();
  const textDownload = await textDownloadPromise;
  expect(textDownload.suggestedFilename()).toBe("string-content.txt");
});

for (const localePrefix of ["/fa", "/ar"]) {
  test(`keeps JSON source left-to-right in RTL locale ${localePrefix}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.goto(localePrefix + "/json/formatter");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const editor = page.locator("textarea").first();
    await expect(editor).toHaveAttribute("dir", "ltr");
    const gutterBox = await page.getByTestId("json-line-numbers").boundingBox();
    const editorBox = await editor.boundingBox();
    expect(gutterBox).not.toBeNull();
    expect(editorBox).not.toBeNull();
    if (gutterBox && editorBox) expect(gutterBox.x + gutterBox.width).toBeLessThanOrEqual(editorBox.x + 1);
    await editor.fill('{"rtl":"متن","count":2}');
    await page.getByTestId("json-editor-menubar").getByRole("button").last().click();
    await expect(page.getByTestId("json-features-menu")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });
}


test("Validate and Find Key do not render an irrelevant JSON output panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/json/formatter");
  const run = page.getByRole("button", { name: "Run operation" });
  const input = page.getByRole("textbox", { name: "Input JSON" });
  const choose = async (label: string) => {
    await page.getByRole("button", { name: "Features" }).click();
    await page.getByRole("menuitemradio", { name: new RegExp("^" + label, "i") }).click();
  };

  await choose("Validate");
  await run.click();
  await expect(page.getByRole("status")).toContainText("JSON is valid");
  await expect(page.getByLabel("Output")).toHaveCount(0);

  await input.fill('{"ready": }');
  await run.click();
  await expect(page.locator('section[aria-label="Validation diagnostics"] p[role="alert"]')).toContainText("Expected a JSON value");
  await expect(page.getByRole("button", { name: /Go to line/ })).toBeVisible();
  await expect(page.getByLabel("Output")).toHaveCount(0);

  await input.fill('{"person":{"name":"Ada"},"ready":true}');
  await choose("Find keys and values");
  await page.getByRole("textbox", { name: "Search text" }).fill("Ada");
  await run.click();
  await expect(page.getByText("$.person.name")).toBeVisible();
  await expect(page.getByLabel("Output")).toHaveCount(0);

  await page.getByRole("textbox", { name: "Search text" }).fill("not-present");
  await run.click();
  await expect(page.getByText("No matching keys or values.")).toBeVisible();
  await expect(page.getByLabel("Output")).toHaveCount(0);

  await choose("Minify");
  await run.click();
  await expect(page.getByLabel("Output")).toContainText('{"person":{"name":"Ada"},"ready":true}');

  await choose("Compare");
  await run.click();
  await expect(page.getByRole("heading", { name: /Comparison result/ })).toBeVisible();
});

test("Run action stacks on mobile and returns to a horizontal header on desktop", async ({ page }) => {
  await page.goto("/json/formatter");
  const header = page.getByTestId("json-operation-header");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(header).toHaveCSS("flex-direction", "column");
  const description = await page.getByTestId("json-operation-description").boundingBox();
  const button = await page.getByTestId("json-run-operation").boundingBox();
  const headerBox = await header.boundingBox();
  expect(description).not.toBeNull();
  expect(button).not.toBeNull();
  expect(headerBox).not.toBeNull();
  if (description && button && headerBox) {
    expect(button.y).toBeGreaterThanOrEqual(description.y + description.height - 1);
    expect(button.width).toBeGreaterThanOrEqual(headerBox.width - 8);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(header).toHaveCSS("flex-direction", "row");
});

test("removes the repeated JSON privacy disclosure from responsive File-action menus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/json/formatter");
  await expect(page.getByText(/JSON is processed locally in your browser/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Features", exact: true }).click();
  await expect(page.getByTestId("json-mobile-file-actions").getByText(/JSON is processed locally in your browser/i)).toHaveCount(0);
  await expect(page.getByTestId("json-features-menu").getByText(/JSON is processed locally in your browser/i)).toHaveCount(0);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/json/formatter");
  await expect(page.getByText(/JSON is processed locally in your browser/i)).toHaveCount(0);
  await page.getByRole("button", { name: "File", exact: true }).click();
  await expect(page.getByTestId("json-file-menu").getByText(/JSON is processed locally in your browser/i)).toHaveCount(0);
});

test("tablet and desktop JSON File menu exposes every supported action, including short-height scrolling", async ({ page }) => {
  for (const viewport of [
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 900 },
    { width: 1920, height: 900 },
    { width: 1440, height: 640 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/json/formatter");
    const fileTrigger = page.getByRole("button", { name: "File", exact: true });
    await expect(fileTrigger).toBeVisible();
    await fileTrigger.click();
    const fileMenu = page.getByTestId("json-file-menu");
    await expect(fileMenu).toBeVisible();
    await expect(fileMenu.getByRole("menuitem")).toHaveCount(7);
    for (const label of ["Open JSON file…", "Copy result", "Download JSON", "Undo", "Redo", "Load sample JSON", "Clear document"]) {
      await expect(fileMenu.getByRole("menuitem", { name: label })).toBeAttached();
    }
    const finalAction = fileMenu.getByRole("menuitem", { name: "Clear document" });
    await finalAction.scrollIntoViewIfNeeded();
    await expect(finalAction).toBeVisible();
    await fileTrigger.click();
    await page.getByRole("button", { name: "Features" }).click();
    await expect(page.getByTestId("json-mobile-file-actions")).toBeHidden();
  }
});


test("keeps desktop JSON menus together on the left and exposes expandable feature categories", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/json/formatter");
  const bar = page.getByTestId("json-editor-menubar");
  const fileTrigger = bar.getByRole("button", { name: "File", exact: true });
  const featuresTrigger = bar.getByRole("button", { name: "Features", exact: true });
  await expect(fileTrigger).toBeVisible();
  await expect(featuresTrigger).toBeVisible();
  const barBox = await bar.boundingBox();
  const fileBox = await fileTrigger.boundingBox();
  const featuresBox = await featuresTrigger.boundingBox();
  expect(barBox && fileBox && featuresBox).not.toBeNull();
  if (barBox && fileBox && featuresBox) {
    expect(featuresBox.x).toBeGreaterThanOrEqual(fileBox.x);
    expect(featuresBox.x + featuresBox.width).toBeLessThan(barBox.x + barBox.width * 0.5);
    expect(Math.abs(featuresBox.y - fileBox.y)).toBeLessThanOrEqual(2);
  }

  await featuresTrigger.click();
  const menu = page.getByTestId("json-features-menu");
  await expect(menu).toBeVisible();
  for (const category of ["Core JSON", "Inspect and Navigate", "Transform"]) {
    await expect(menu.getByRole("button", { name: category })).toBeVisible();
  }
  await expect(menu.getByRole("menuitemradio", { name: /^Format/i })).toBeVisible();
  await expect(menu.getByRole("menuitemradio", { name: /^Tree Viewer/i })).toBeAttached();
  await expect(menu.getByRole("menuitemradio", { name: /^Escape string contents/i })).toBeAttached();
});
