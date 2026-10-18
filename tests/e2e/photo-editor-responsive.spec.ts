import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 360, height: 800, label: "small mobile portrait" },
  { width: 390, height: 844, label: "mobile portrait" },
  { width: 844, height: 390, label: "mobile landscape / compact desktop layout" },
  { width: 744, height: 1024, label: "compact tablet portrait" },
  { width: 768, height: 1024, label: "tablet portrait" },
  { width: 1280, height: 800, label: "desktop" },
  { width: 1440, height: 900, label: "large desktop" },
] as const;

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/r4sAAAAASUVORK5CYII=",
  "base64",
);

async function openFeature(page: Page, width: number, feature: "Crop" | "Text & watermark" | "Color & filters") {
  if (width < 1024) {
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
    const editorNavbar = page.getByTestId("editor-menubar");
    await expect(editorNavbar).toHaveCSS("height", "68px");
    await expect(editorNavbar).toHaveCSS("padding-left", viewport.width >= 640 ? "24px" : "12px");
    await expect(editorNavbar).toHaveCSS("gap", "12px");

    if (viewport.width < 1024) {
      // Keep the shared header out of the compact photo-editing workspace and retain the main-site hamburger.
      await expect(page.locator('header input[aria-label]')).toBeHidden();
      const menubar = page.getByTestId("editor-menubar");
      const fileMenu = menubar.getByRole("button", { name: "File", exact: true });
      const featuresMenu = menubar.getByRole("button", { name: "Open photo editor features" });
      const siteMenu = menubar.getByRole("button", { name: "Open navigation" });
      await expect(siteMenu).toBeVisible();
      // The hamburger belongs to the editor's in-flow navbar, not a viewport overlay.
      await expect(siteMenu.locator("xpath=..")).toHaveCSS("position", "sticky");
      await expect(menubar).toHaveCSS("position", "sticky");
      await expect(menubar.getByRole("link", { name: "GaGet.dev home" })).toHaveCount(0);
      await expect(fileMenu).toBeVisible();
      await expect(featuresMenu).toBeVisible();
      await featuresMenu.click();
      const featureList = page.getByTestId("mobile-feature-menu");
      await expect(featureList).toBeVisible();
      const featureListBox = await featureList.boundingBox();
      const featuresTriggerBox = await featuresMenu.boundingBox();
      expect(featureListBox, "mobile feature list should have a measurable compact dropdown").not.toBeNull();
      expect(featuresTriggerBox, "Features trigger should have a measurable anchor").not.toBeNull();
      if (featureListBox && featuresTriggerBox) {
        expect(featureListBox.width).toBeLessThanOrEqual(256);
        expect(featureListBox.width).toBeLessThan(viewport.width - 80);
        expect(featureListBox.height).toBeLessThanOrEqual(Math.min(viewport.height * 0.7, 420) + 2);
        // The dropdown must align to the Features trigger, not stretch or anchor to the viewport/page.
        expect(featureListBox.x + featureListBox.width).toBeCloseTo(featuresTriggerBox.x + featuresTriggerBox.width, 0);
        expect(viewport.width - featureListBox.x - featureListBox.width).toBeCloseTo(viewport.width >= 640 ? 24 : 12, 0);
      }
      await expect(featureList.getByRole("button", { name: "Crop", exact: true })).toBeVisible();
      await expect(featureList.getByRole("button", { name: "SVG optimize", exact: true })).toBeVisible();
      await featuresMenu.click();
      await expect(featureList).toBeHidden();
      const menubarBox = await menubar.boundingBox();
      const siteMenuBox = await siteMenu.boundingBox();
      const fileBox = await fileMenu.boundingBox();
      const featuresBox = await featuresMenu.boundingBox();
      expect(menubarBox).not.toBeNull();
      expect(siteMenuBox).not.toBeNull();
      expect(fileBox).not.toBeNull();
      expect(featuresBox).not.toBeNull();
      if (menubarBox && siteMenuBox && fileBox && featuresBox) {
        // Main site navigation occupies the left edge; File follows it and Features stays at the right.
        expect(fileBox.x).toBeGreaterThanOrEqual(siteMenuBox.x + siteMenuBox.width - 1);
        expect(featuresBox.x).toBeGreaterThanOrEqual(fileBox.x + fileBox.width);
        expect(menubarBox.x + menubarBox.width - featuresBox.x - featuresBox.width).toBeCloseTo(viewport.width >= 640 ? 24 : 12, 0);
      }
      await expect.poll(() => editor.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
      await expect(editor).toHaveClass(/h-dvh/);
      const initialNavbarY = await menubar.evaluate((element) => element.getBoundingClientRect().top);
      // The page itself should not scroll; the editor canvas is the scrollable workspace.
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect(siteMenu).toBeVisible();
      await expect.poll(() => menubar.evaluate((element) => element.getBoundingClientRect().top)).toBe(initialNavbarY);
      await siteMenu.click();
      const drawer = page.getByTestId("mobile-navigation-drawer");
      await expect(drawer).toBeVisible();
      const logo = drawer.getByRole("link", { name: "GaGet.dev home" });
      const closeButton = drawer.getByRole("button", { name: "Close navigation", exact: true });
      await expect(logo).toBeVisible();
      await expect(closeButton).toBeVisible();
      const logoBox = await logo.boundingBox();
      const closeBox = await closeButton.boundingBox();
      expect(logoBox).not.toBeNull();
      expect(closeBox).not.toBeNull();
      if (logoBox && closeBox) {
        const overlaps = logoBox.x < closeBox.x + closeBox.width
          && logoBox.x + logoBox.width > closeBox.x
          && logoBox.y < closeBox.y + closeBox.height
          && logoBox.y + logoBox.height > closeBox.y;
        expect(overlaps, "drawer close button must not overlap the GaGet.dev logo").toBe(false);
      }
      await closeButton.click();
      await expect(drawer).toBeHidden();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true);
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

    if (viewport.width < 640) {
      await expect(page.getByRole("slider", { name: "Resize editing panel" })).toBeVisible();
    } else {
      await expect(panel).toHaveClass(/sm:w-\[320px\]/);
    }

    const workspace = page.getByTestId("canvas-scroll-area");
    const canvasBox = await workspace.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(canvasBox, "canvas workspace should have a measurable viewport").not.toBeNull();
    expect(panelBox, "editing panel should have a measurable viewport").not.toBeNull();
    if (canvasBox && panelBox && viewport.width < 640) {
      expect(panelBox.y).toBeGreaterThanOrEqual(canvasBox.y + canvasBox.height - 2);
      // Every mobile feature starts at the same useful default height.
      // Verify rendered geometry rather than coupling the test to Tailwind classes.
      const defaultPanelHeight = Math.min(viewport.height * 0.45, 380);
      expect(panelBox.height).toBeGreaterThanOrEqual(defaultPanelHeight - 2);
      expect(panelBox.height).toBeLessThanOrEqual(defaultPanelHeight + 2);
    } else if (canvasBox && panelBox) {
      expect(panelBox.x).toBeGreaterThanOrEqual(canvasBox.x + canvasBox.width - 2);
    }

    const textControls = panel.getByTestId("text-watermark-controls");
    await expect(textControls).toBeVisible();
    if (viewport.width < 1024) {
      await expect(textControls).toHaveClass(/flex-col/);
      await expect(textControls).toHaveClass(/overflow-x-hidden/);
      await expect(textControls.locator(".overflow-x-auto")).toHaveCount(0);
      await expect.poll(() => textControls.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
      await expect.poll(() => panel.evaluate((element) => {
        const scroller = element.querySelector(":scope > div > div.flex-1");
        return scroller instanceof HTMLElement && scroller.scrollWidth <= scroller.clientWidth;
      })).toBe(true);
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
    const panelScroller = panel.locator(".overflow-y-auto");
    const adjustments = page.getByTestId("filter-adjustments");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveClass(/h-\[min\(45dvh,380px\)\]/);
    await expect(adjustments.getByLabel("Brightness")).toBeVisible();
    await expect(adjustments.getByLabel("Contrast")).toBeAttached();

    // The bottom sheet's content is the only scroll container. Filter controls
    // must fit its width and must not create their own horizontal scroller.
    await expect(panel.locator(".overflow-y-auto")).toHaveCount(1);
    await expect(panel.locator(".overflow-x-auto")).toHaveCount(0);
    await expect.poll(() => panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect.poll(() => panelScroller.evaluate((element) => {
      const style = getComputedStyle(element);
      // There should be one vertical scroller, with horizontal overflow clipped
      // at this boundary. scrollWidth may include descendants clipped by
      // overflow-x:hidden, so it is not a reliable visible-overflow assertion.
      return element.classList.contains("overflow-x-hidden") && style.overflowY === "auto";
    })).toBe(true);
    await expect.poll(() => panelScroller.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
    await expect(adjustments.locator(".overflow-x-auto")).toHaveCount(0);
    await expect.poll(() => adjustments.locator("label").evaluateAll((labels) => {
      const bounds = labels.map((label) => label.getBoundingClientRect());
      const ranges = Array.from(document.querySelectorAll('[data-testid="filter-adjustments"] input[type="range"]'));
      return bounds.every((box) => box.width > 0)
        && ranges.length === 6
        && ranges.every((input) => {
          const inputBox = input.getBoundingClientRect();
          const labelBox = input.closest("label")?.getBoundingClientRect();
          return Boolean(labelBox)
            && inputBox.width > 0
            && inputBox.left >= labelBox!.left
            && inputBox.right <= labelBox!.right;
        });
    })).toBe(true);

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


test("mobile feature panel has a shared default height and supports bounded drag and keyboard resizing", async ({ page }) => {
  const width = 390;
  const height = 844;
  await page.setViewportSize({ width, height });
  await page.goto("/images/editor");
  await loadTestPhoto(page);
  await openFeature(page, width, "Color & filters");

  const panel = page.getByTestId("feature-panel");
  const handle = page.getByRole("slider", { name: "Resize editing panel" });
  const panelHeight = () => panel.evaluate((element) => element.getBoundingClientRect().height);
  await expect(panel).toBeVisible();
  const initialHeight = await panelHeight();
  expect(initialHeight).toBeCloseTo(Math.min(height * 0.45, 380), 0);

  // Switching tools retains the current sheet height rather than resetting it.
  await openFeature(page, width, "Text & watermark");
  await expect(panel.getByRole("heading", { name: "Text & watermark" })).toBeVisible();
  await expect.poll(panelHeight).toBeCloseTo(initialHeight, 0);

  const handleBox = await handle.boundingBox();
  expect(handleBox).not.toBeNull();
  if (!handleBox) return;
  const startX = handleBox.x + handleBox.width / 2;
  const startY = handleBox.y + handleBox.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY - 90, { steps: 5 });
  await page.mouse.up();
  await expect.poll(panelHeight).toBeGreaterThan(initialHeight + 50);

  const draggedHeight = await panelHeight();
  await openFeature(page, width, "Crop");
  await expect(panel.getByRole("heading", { name: "Crop" })).toBeVisible();
  await expect.poll(panelHeight).toBeCloseTo(draggedHeight, 0);

  // Keyboard controls expose and enforce the practical minimum and viewport-based maximum.
  await handle.focus();
  await page.keyboard.press("Home");
  await expect.poll(panelHeight).toBeGreaterThanOrEqual(Math.max(160, height * 0.2) - 3);
  await expect.poll(panelHeight).toBeLessThanOrEqual(Math.max(160, height * 0.2) + 3);
  await page.keyboard.press("End");
  await expect.poll(panelHeight).toBeGreaterThanOrEqual(height * 0.7 - 3);
  await expect.poll(panelHeight).toBeLessThanOrEqual(height * 0.7 + 3);

  await expect.poll(() => page.locator("main[aria-label='GaGet Photo Editor']").evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});


test("desktop photo File dropdown stays to the right of the expanded and collapsed sidebar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/images/editor");

  const sidebar = page.locator("aside").first();
  const fileTrigger = page.getByTestId("editor-menubar").getByRole("button", { name: "File", exact: true });
  await expect(sidebar).toBeVisible();

  await fileTrigger.click();
  const fileMenu = page.locator("[data-testid='editor-menubar'] > div.absolute");
  await expect(fileMenu).toBeVisible();
  let sidebarBox = await sidebar.boundingBox();
  let menuBox = await fileMenu.boundingBox();
  expect(sidebarBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  if (sidebarBox && menuBox) {
    expect(menuBox.x, "Photo File dropdown must start after the expanded sidebar").toBeGreaterThanOrEqual(sidebarBox.x + sidebarBox.width - 1);
  }
  await fileTrigger.click();

  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
  await expect.poll(async () => (await sidebar.boundingBox())?.width).toBe(64);
  await page.getByTestId("editor-menubar").getByRole("button", { name: "File", exact: true }).click();
  await expect(fileMenu).toBeVisible();
  sidebarBox = await sidebar.boundingBox();
  menuBox = await fileMenu.boundingBox();
  expect(sidebarBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  if (sidebarBox && menuBox) {
    expect(menuBox.x, "Photo File dropdown must start after the collapsed sidebar").toBeGreaterThanOrEqual(sidebarBox.x + sidebarBox.width - 1);
  }
});


test("photo editor file and feature menus share icon rows, bounded widths, and outside-click dismissal", async ({ page }) => {
  for (const width of [390, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/images/editor");
    const menubar = page.getByTestId("editor-menubar");
    await menubar.getByRole("button", { name: "File", exact: true }).click();
    const fileMenu = page.getByTestId("photo-file-menu");
    await expect(fileMenu.getByRole("button", { name: /Open photo/ }).locator("svg")).toBeVisible();
    const fileBox = await fileMenu.boundingBox();
    expect(fileBox).not.toBeNull();
    if (fileBox) expect(fileBox.width).toBeLessThanOrEqual(320);
    await page.getByRole("heading", { name: "GaGet Photo Editor" }).click();
    await expect(fileMenu).toBeHidden();

    if (width >= 1024) {
      await menubar.getByRole("button", { name: "Edit", exact: true }).click();
      const menu = page.getByTestId("photo-feature-menu");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("button", { name: "Crop", exact: true }).locator("svg")).toBeVisible();
      const box = await menu.boundingBox();
      expect(box).not.toBeNull();
      if (box) expect(box.width).toBeLessThanOrEqual(320);
      await page.getByRole("heading", { name: "GaGet Photo Editor" }).click();
      await expect(menu).toBeHidden();
    } else {
      await menubar.getByRole("button", { name: "Open photo editor features" }).click();
      const menu = page.getByTestId("mobile-feature-menu");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("button", { name: "Crop", exact: true }).locator("svg")).toBeVisible();
      const box = await menu.boundingBox();
      expect(box).not.toBeNull();
      if (box) expect(box.width).toBeLessThanOrEqual(256);
      await page.getByRole("heading", { name: "GaGet Photo Editor" }).click();
      await expect(menu).toBeHidden();
    }
  }
});
