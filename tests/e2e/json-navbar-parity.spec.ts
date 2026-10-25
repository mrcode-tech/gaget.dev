import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 744, height: 1024 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 1280, height: 600 },
] as const;

for (const viewport of viewports) {
  test(`JSON command bar matches the reference shell at ${viewport.width}×${viewport.height}`, async ({ page }) => {
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
    await expect.poll(() => stickyBar.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(viewport.width >= 1024 ? 68 : 0);
    const fileTrigger = page.getByRole("button", { name: "File", exact: true });
    const featuresTrigger = page.getByRole("button", { name: "Features", exact: true });
    await expect(featuresTrigger).toBeVisible();
    if (viewport.width < 768) {
      await expect(fileTrigger).toBeHidden();
      await featuresTrigger.click();
      await expect(page.getByTestId("json-mobile-file-actions")).toBeVisible();
      await expect(page.getByTestId("json-file-menu")).toHaveCount(0);
    } else {
      await expect(fileTrigger).toBeVisible();
      await featuresTrigger.click();
      await expect(page.getByTestId("json-mobile-file-actions")).toBeHidden();
      await featuresTrigger.click();
      await fileTrigger.click();
      await expect(page.getByTestId("json-file-menu")).toBeVisible();
    }
  });
}
