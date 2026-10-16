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

async function openFeature(page: Page, width: number, feature: "Crop & resize" | "Text & watermark") {
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
    await loadTestPhoto(page);
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
      await expect(panel).toHaveClass(/h-\[min\(44dvh,360px\)\]/);
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

    await openFeature(page, viewport.width, "Crop & resize");
    await expect(panel.getByRole("heading", { name: "Crop & resize" })).toBeVisible();
    await canvas.focus();
    await page.keyboard.press("ArrowRight");
    await expect(panel).toBeVisible();
  });
}
