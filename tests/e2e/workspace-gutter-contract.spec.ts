import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 744, height: 1024 },
  { width: 768, height: 1024 },
  { width: 1023, height: 800 },
  { width: 1024, height: 800 },
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const surfaces = [
  { route: "/tools", selector: '[data-testid="tool-catalog"]', label: "Dev Tools catalog" },
  { route: "/images/editor", selector: '[data-testid="canvas-scroll-area"]', label: "Photo Editor workspace" },
  { route: "/video/editor", selector: '[data-testid="video-workspace-content"]', label: "Video Editor workspace" },
  { route: "/datetime/editor", selector: '[data-testid="datetime-workspace-grid"] > section', label: "Date & Time workspace" },
  { route: "/json/formatter", selector: '[data-testid="json-workspace-content"]', label: "JSON workspace content" },
] as const;

for (const viewport of viewports) {
  test(`shared workspace gutters and overflow at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const expectedGutter = viewport.width < 640 ? 12 : viewport.width < 1024 ? 24 : 32;

    for (const surface of surfaces) {
      await page.goto(surface.route);
      const content = page.locator(surface.selector);
      await expect(content, surface.label + " should render").toBeVisible();

      const geometry = await content.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          paddingLeft: style.paddingLeft,
          paddingRight: style.paddingRight,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
        };
      });

      expect(geometry.paddingLeft, surface.label + " left gutter").toBe(`${expectedGutter}px`);
      expect(geometry.paddingRight, surface.label + " right gutter").toBe(`${expectedGutter}px`);
      expect(
        geometry.documentWidth,
        surface.label + " must not introduce horizontal page overflow",
      ).toBeLessThanOrEqual(geometry.viewportWidth);
    }
  });
}
