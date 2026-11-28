import { expect, test } from "@playwright/test";

test("builder entry, required project definition, empty canvases, and independent preview", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("link", { name: "Website Design Builder" }).click();
  await expect(page).toHaveURL(new RegExp("/website-builder$"));
  await expect(page.getByRole("heading", { name: "Website Design Builder" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Search tools" })).toHaveCount(0);

  await page.getByLabel("Project name").fill("North Studio");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.locator('p[role="alert"]')).toContainText("Describe the website purpose");

  await page.getByLabel("Website purpose").fill("Introduce the studio and explain its services.");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  await expect(page.getByText("North Studio", { exact: true })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("refreshing or closing this page may discard unexported work");
  await page.screenshot({ path: testInfo.outputPath("website-builder-workspace-desktop-1440x1000-light.png"), fullPage: true });

  for (const breakpoint of ["Desktop", "Tablet", "Mobile"]) {
    await expect(page.getByRole("region", { name: breakpoint + " website canvas" })).toBeVisible();
  }
  await expect(page.getByText("0 sections", { exact: false })).toBeVisible();

  const previewTrigger = page.getByRole("button", { name: "Preview", exact: true }).first();
  await previewTrigger.focus();
  await previewTrigger.click();
  await expect(page.getByRole("dialog", { name: "Editorial split" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Editorial split" })).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Add this design" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(previewTrigger).toBeFocused();
  await expect(page.getByText("0 sections", { exact: false })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const canvases = page.getByRole("region", { name: "Responsive website canvases" });
  await expect(canvases).toBeVisible();
  expect(await canvases.evaluate(element => (element as HTMLElement).scrollWidth > (element as HTMLElement).clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("website-builder-workspace-mobile-390x844-light.png"), fullPage: true });
  for (const breakpoint of ["Desktop", "Tablet", "Mobile"]) {
    await expect(page.getByRole("region", { name: breakpoint + " website canvas" })).toBeAttached();
  }
});

test("builder creation validation preserves entered values and communicates session-only state", async ({ page }) => {
  await page.goto("/website-builder");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.locator('p[role="alert"]')).toContainText("Add a project name");
  await page.getByLabel("Project name").fill("Field Notes");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.locator('p[role="alert"]')).toContainText("Describe the website purpose");
  await expect(page.getByLabel("Project name")).toHaveValue("Field Notes");
  await expect(page.getByText(/exist only in this browser session/i)).toBeVisible();
});

test("builder theme follows the host theme provider without rendering the GaGet shell", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/website-builder");
  await expect(page.getByRole("button", { name: "Light mode" })).toBeVisible();
  await page.getByLabel("Project name").fill("Night Studio");
  await page.getByLabel("Website purpose").fill("Create a calm dark-themed workspace preview.");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.locator("main").first()).toHaveClass(/bg-\[#17201d\]/);
  await expect(page.getByRole("button", { name: "Light mode" })).toBeVisible();
  await page.getByRole("button", { name: "Light mode" }).click();
  await expect(page.getByRole("button", { name: "Dark mode" })).toBeVisible();
});

test("localized builder route preserves RTL document direction and its own shell", async ({ page }) => {
  await page.goto("/fa/website-builder");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "Website Design Builder" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(0);
});
\ntest("project state is intentionally not restored after a page refresh", async ({ page }) => {\n  await page.goto("/website-builder");\n  await page.getByLabel("Project name").fill("Session Only Studio");\n  await page.getByLabel("Website purpose").fill("A temporary in-memory website project.");\n  await page.getByRole("button", { name: /Create my website/ }).click();\n  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();\n  await page.reload();\n  await expect(page.getByRole("heading", { name: "Website Design Builder" })).toBeVisible();\n  await expect(page.getByLabel("Project name")).toHaveValue("");\n});\n