import { expect, test } from "@playwright/test";

test("builder entry, required project definition, empty canvases, and independent preview", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("link", { name: "Website Design Builder" }).click();
  await expect(page).toHaveURL(/\\/website-builder$/);
  await expect(page.getByRole("heading", { name: "Website Design Builder" })).toBeVisible();

  await page.getByLabel("Project name").fill("North Studio");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.getByRole("alert")).toContainText("Describe the website purpose");

  await page.getByLabel("Website purpose").fill("Introduce the studio and explain its services.");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  await expect(page.getByText("North Studio", { exact: true })).toBeVisible();

  for (const breakpoint of ["Desktop", "Tablet", "Mobile"]) {
    await expect(page.getByRole("region", { name: breakpoint + " website canvas" })).toBeVisible();
  }
  await expect(page.getByText("0 sections", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Preview", exact: true }).first().click();
  await expect(page.getByRole("dialog", { name: "Editorial split" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Editorial split" })).toBeVisible();
  await page.getByRole("button", { name: "Close preview" }).click();
  await expect(page.getByText("0 sections", { exact: false })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const canvases = page.getByRole("region", { name: "Responsive website canvases" });
  await expect(canvases).toBeVisible();
  expect(await canvases.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  for (const breakpoint of ["Desktop", "Tablet", "Mobile"]) {
    await expect(page.getByRole("region", { name: breakpoint + " website canvas" })).toBeAttached();
  }
});

test("builder creation validation preserves entered values and communicates session-only state", async ({ page }) => {
  await page.goto("/website-builder");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.getByRole("alert")).toContainText("Add a project name");
  await page.getByLabel("Project name").fill("Field Notes");
  await page.getByRole("button", { name: /Create my website/ }).click();
  await expect(page.getByRole("alert")).toContainText("Describe the website purpose");
  await expect(page.getByLabel("Project name")).toHaveValue("Field Notes");
  await expect(page.getByText(/exist only in this browser session/i)).toBeVisible();
});
