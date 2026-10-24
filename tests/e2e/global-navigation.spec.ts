import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/tools",
  "/json/formatter",
  "/encoding/base64",
  "/datetime/world-clock",
];

for (const route of routes) {
  test(`mobile site navbar and hamburger stay fixed on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    if (route.startsWith("/datetime/") || route.startsWith("/json/")) {
      const header = page.locator("header").first();
      const commandBar = route.startsWith("/datetime/")
        ? page.getByRole("navigation", { name: "Date and time editor commands" })
        : page.getByTestId("json-editor-menubar");
      const hamburger = commandBar.getByRole("button", { name: "Open navigation" });
      await expect(header).toBeHidden();
      await expect(commandBar).toBeVisible();
      await expect(hamburger).toBeVisible();
      await expect(page.getByRole("button", { name: "Open navigation" })).toHaveCount(1);

      await hamburger.click();
      const drawer = page.getByTestId("mobile-navigation-drawer");
      await expect(drawer).toBeVisible();
      await drawer.getByRole("button", { name: "Close navigation", exact: true }).click();
      await expect(drawer).toBeHidden();
      return;
    }

    const header = page.locator("header").first();
    const hamburger = page.getByRole("button", { name: "Open navigation" });
    await expect(header).toBeVisible();
    await expect(hamburger).toBeVisible();
    await expect(hamburger.locator("xpath=..")).toHaveAttribute("class", /fixed/);
    await expect(header).toHaveCSS("position", "fixed");

    // Ensure even short utility routes can exercise real viewport scrolling.
    await page.evaluate(() => { document.body.style.minHeight = "180vh"; });
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect.poll(() => header.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(0);
    await expect(hamburger).toBeVisible();
    await expect(hamburger).toHaveCSS("position", "static");

    // The trigger belongs to the shared header, not an independently floating overlay.
    expect(await hamburger.evaluate((element) => element.closest("header") !== null)).toBe(true);
    expect(await page.locator('[data-testid="mobile-site-navigation-trigger"]').count()).toBe(0);

    await hamburger.click();
    const drawer = page.getByTestId("mobile-navigation-drawer");
    await expect(drawer).toBeVisible();
    const logoBox = await drawer.getByRole("link", { name: "GaGet.dev home" }).boundingBox();
    const closeBox = await drawer.getByRole("button", { name: "Close navigation", exact: true }).boundingBox();
    expect(logoBox).not.toBeNull();
    expect(closeBox).not.toBeNull();
    if (logoBox && closeBox) {
      const overlaps = logoBox.x < closeBox.x + closeBox.width
        && logoBox.x + logoBox.width > closeBox.x
        && logoBox.y < closeBox.y + closeBox.height
        && logoBox.y + logoBox.height > closeBox.y;
      expect(overlaps, "navigation drawer close button must not overlap the GaGet.dev logo").toBe(false);
    }
  });
}

test("desktop navbar remains fixed beside the sidebar while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/tools");
  const header = page.locator("header").first();
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS("position", "fixed");
  await page.evaluate(() => { document.body.style.minHeight = "180vh"; });
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect.poll(() => header.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(0);

  const headerBox = await header.boundingBox();
  expect(headerBox).not.toBeNull();
  if (headerBox) expect(headerBox.x).toBeGreaterThanOrEqual(240);
});


test("desktop search is centered in the available page area and language menu layers above the navbar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/tools");

  const header = page.locator("header").first();
  const search = header.getByRole("textbox", { name: "Search tools" });
  await expect(search).toBeVisible();
  const headerBox = await header.boundingBox();
  const searchBox = await search.boundingBox();
  expect(headerBox).not.toBeNull();
  expect(searchBox).not.toBeNull();
  if (headerBox && searchBox) {
    const headerCenter = headerBox.x + headerBox.width / 2;
    const searchCenter = searchBox.x + searchBox.width / 2;
    expect(Math.abs(searchCenter - headerCenter), "desktop search should be centered in the content area beside the sidebar").toBeLessThanOrEqual(3);
  }

  const languageTrigger = page.getByRole("combobox", { name: "Language" });
  await languageTrigger.click();
  const languageList = page.getByRole("listbox");
  await expect(languageList).toBeVisible();
  await expect(page.getByRole("option", { name: "Español" })).toBeVisible();
  const headerZIndex = Number(await header.evaluate((element) => getComputedStyle(element).zIndex));
  const listZIndex = Number(await languageList.evaluate((element) => getComputedStyle(element).zIndex));
  expect(listZIndex, "language options must render above the fixed navbar instead of behind it").toBeGreaterThan(headerZIndex);
});

test("mobile sidebar language selector opens its options above the navigation drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tools");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByTestId("mobile-navigation-drawer");
  await expect(drawer).toBeVisible();

  const languageTrigger = drawer.getByRole("combobox", { name: "Language" });
  await expect(languageTrigger).toBeVisible();
  await languageTrigger.click();

  const languageList = page.getByRole("listbox");
  await expect(languageList).toBeVisible();
  await expect(page.getByRole("option", { name: "Español" })).toBeVisible();
  const drawerZIndex = Number(await drawer.evaluate((element) => getComputedStyle(element).zIndex));
  const listZIndex = Number(await languageList.evaluate((element) => getComputedStyle(element).zIndex));
  expect(listZIndex, "language options must appear above the mobile navigation drawer").toBeGreaterThan(drawerZIndex);
});
