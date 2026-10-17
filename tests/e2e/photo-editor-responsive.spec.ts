import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 360, height: 800, label: "small mobile portrait" },
  { width: 390, height: 844, label: "mobile portrait" },
  { width: 844, height: 390, label: "mobile landscape / compact desktop layout" },
  { width: 768, height: 1024, label: "tablet portrait" },
  { width: 1280, height: 800, label: "desktop" },
  { width: 1440, height: 900, label: "large desktop" },
] as const;

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/r4sAAAAASUVORK5CYII=",
  "base64",
);

async function openFeature(page: Page, width: number, feature: "Crop" | "Text & watermark" | "Color & filters") {
  if (width < 768) {
    await page.getByRole("button", { name: "Open photo editor features" }).click();
  } else {
    await page.getByRole("button", { name: "Edit", exact: true }).click();
  }
  await page.getByRole("button", { name: feature, exact: true }).click();
}

async function loadTestPhoto(page: Page) {
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "accessibility-test.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  });
  await expect(page.locator("canvas[role='img']")).toBeVisible();
}

for (const viewport of viewports) {
  test(`responsive editor and WCAG accessibility at ${viewport.width}×${viewport.height} (${viewport.label})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/images/editor");

    const editor = page.getByRole("main", { name: "GaGet Photo Editor" });
    await expect(editor).toBeVisible();

    if (viewport.width < 768) {
      // Keep the global search field out of the compact photo-editing workspace.
      await expect(page.locator('header input[aria-label]')).toBeHidden();
      const menubar = page.getByTestId("editor-menubar");
      const fileMenu = menubar.getByRole("button", { name: "File", exact: true });
      const featuresMenu = menubar.getByRole("button", { name: "Open photo editor features" });
      await expect(fileMenu).toBeVisible();
      await expect(featuresMenu).toBeVisible();
      const fileBox = await fileMenu.boundingBox();
      const featuresBox = await featuresMenu.boundingBox();
      expect(fileBox).not.toBeNull();
      expect(featuresBox).not.toBeNull();
      if (fileBox && featuresBox) {
        expect(featuresBox.x).toBeGreaterThanOrEqual(fileBox.x + fileBox.width - 1);
        expect(featuresBox.x - (fileBox.x + fileBox.width)).toBeLessThan(32);
      }
    } else {
      await expect(page.locator('header input[aria-label]')).toBeVisible();
    }

    await loadTestPhoto(page);
    if (viewport.width >= 768) {
      await expect(page.getByRole("status")).toBeVisible();
    } else {
      await expect(page.getByRole("status")).toBeHidden();
    }
    await openFeature(page, viewport.width, "Text & watermark");

    const panel = page.getByTestId("feature-panel");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("role", "region");
    await expect(panel).toHaveAttribute("aria-labelledby", "feature-panel-title");
    await expect(panel.getByRole("heading", { name: "Text & watermark" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close feature panel" })).toBeVisible();
    await expect.poll(() => panel.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe("none");

    if (viewport.width < 768) {
      await expect(page.getByRole("button", { name: "Expand editing panel" })).toBeVisible();
    } else {
      await expect(panel).toHaveClass(/md:w-\[320px\]/);
    }

    const workspace = page.getByTestId("canvas-scroll-area");
    const canvasBox = await workspace.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(canvasBox, "canvas workspace should have a measurable viewport").not.toBeNull();
    expect(panelBox, "editing panel should have a measurable viewport").not.toBeNull();
    if (canvasBox && panelBox && viewport.width < 768) {
      expect(panelBox.y).toBeGreaterThanOrEqual(canvasBox.y + canvasBox.height - 2);
      // The mobile feature sheet is intentionally compact; verify rendered geometry
      // rather than coupling this test to Tailwind class names.
      expect(panelBox.height).toBeGreaterThan(0);
      expect(panelBox.height).toBeLessThanOrEqual(Math.min(viewport.height * 0.24, 200) + 2);
    } else if (canvasBox && panelBox) {
      expect(panelBox.x).toBeGreaterThanOrEqual(canvasBox.x + canvasBox.width - 2);
    }

    await page.getByRole("button", { name: "Add text layer" }).click();
    const canvas = page.locator("canvas[role='img']");
    await canvas.click();
    await expect(panel).toBeVisible();
    await canvas.focus();
    await page.keyboard.press("ArrowRight");
    await expect(panel.getByRole("textbox", { name: "Text" })).toBeVisible();

    const accessibility = await new AxeBuilder({ page })
      .include('[data-testid="photo-editor"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      accessibility.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.help,
        nodes: violation.nodes.map((node) => node.target),
      })),
      `axe-core reported accessibility violations at ${viewport.width}×${viewport.height}`,
    ).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();

    await openFeature(page, viewport.width, "Crop");
    await expect(panel.getByRole("heading", { name: "Crop" })).toBeVisible();
    await canvas.focus();
    await page.keyboard.press("ArrowRight");
    await expect(panel).toBeVisible();
  });
}

for (const width of [320, 360, 390, 430]) {
  test(`mobile Color & filters stays inside the viewport and responds to slider changes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/images/editor");
    await loadTestPhoto(page);
    await openFeature(page, width, "Color & filters");

    const panel = page.getByTestId("feature-panel");
    const panelScroller = panel.locator(":scope > .overflow-y-auto");
    const adjustments = page.getByTestId("filter-adjustments");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveClass(/h-\[min\(52dvh,420px\)\]/);
    await expect(adjustments.getByLabel("Brightness")).toBeVisible();
    await expect(adjustments.getByLabel("Contrast")).toBeAttached();

    // The bottom sheet's content is the only scroll container. Filter controls
    // must fit its width and must not create their own horizontal scroller.
    await expect(panel.locator(".overflow-y-auto")).toHaveCount(1);
    await expect(panel.locator(".overflow-x-auto")).toHaveCount(0);
    await expect.poll(() => panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect.poll(() => panelScroller.evaluate((element) => {
      const style = getComputedStyle(element);
      // Assert the intended utility class and real layout behavior. Checking
      // computed overflowX alone is brittle across browser/CSS normalization;
      // actual horizontal overflow is covered by scrollWidth/clientWidth below.
      return element.classList.contains("overflow-x-hidden")
        && style.overflowY === "auto"
        && element.scrollWidth <= element.clientWidth;
    })).toBe(true);
    await expect.poll(() => panelScroller.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    await expect.poll(() => adjustments.evaluate((element) => {
      const style = getComputedStyle(element);
      return style.overflowX === "hidden" && element.scrollWidth <= element.clientWidth;
    })).toBe(true);
    await expect(adjustments.locator(".overflow-x-auto")).toHaveCount(0);
    await expect.poll(() => adjustments.locator("input[type='range']").evaluateAll((inputs) =>
      inputs.length === 6 && inputs.every((input) => input.scrollWidth <= input.clientWidth),
    )).toBe(true);

    await panelScroller.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    await expect.poll(() => panelScroller.evaluate((element) => element.scrollTop > 0)).toBe(true);

    const brightness = adjustments.getByLabel("Brightness");
    await brightness.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => page.locator("canvas[role='img']").evaluate((element) => (element as HTMLCanvasElement).style.filter))
      .toContain("brightness(1.01)");

    await expect.poll(() => page.locator("main[aria-label='GaGet Photo Editor']").evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
}
