import { expect, test } from "@playwright/test";

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 744, height: 1024 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
] as const;

for (const viewport of viewports) {
  test(`JSON command bar matches Photo Editor mobile shell at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/json/formatter");
    const jsonBar = page.getByTestId("json-editor-menubar");
    await expect(jsonBar).toBeVisible();

    const jsonGeometry = await jsonBar.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    await page.goto("/images/editor");
    const photoBar = page.getByTestId("editor-menubar");
    await expect(photoBar).toBeVisible();
    const photoGeometry = await photoBar.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    expect(jsonGeometry.x).toBeCloseTo(photoGeometry.x, 0);
    expect(jsonGeometry.y).toBeCloseTo(photoGeometry.y, 0);
    expect(jsonGeometry.width).toBeCloseTo(photoGeometry.width, 0);
    expect(jsonGeometry.height).toBe(68);
    expect(jsonGeometry.documentWidth).toBeLessThanOrEqual(jsonGeometry.viewportWidth);

    await page.goto("/json/formatter");
    const stickyBar = page.getByTestId("json-editor-menubar");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(() => stickyBar.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(0);
    await expect(page.getByRole("button", { name: "File" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Features" })).toBeVisible();
  });
}
