import { expect, test } from "@playwright/test";

test("website builder supports a real session project composition and JSON handoff", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/website-builder");

  await expect(page.getByRole("heading", { name: "Website Design Builder" })).toBeVisible();
  await page.getByLabel("Project name").fill("North Studio");
  await page.getByLabel("Business or organization").fill("Independent design studio");
  await page.getByLabel("What should the website achieve?").fill("Introduce the studio and its work.");
  await page.getByLabel("Who is it for?").fill("Potential clients");
  await page.getByRole("button", { name: "Create my website" }).click();

  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  await expect(page.getByText("Editorial split", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Add", exact: true }).first().click();
  await expect(page.getByText("Editorial split", { exact: true })).toBeVisible();

  await page.getByLabel("Title", { exact: true }).fill("Design with purpose");
  await expect(page.getByText("Design with purpose", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Tablet" }).first().click();
  await page.getByRole("button", { name: "Hide on Tablet" }).click();
  await expect(page.getByText("Section design replaced", { exact: false })).not.toBeVisible();

  await page.getByRole("button", { name: /Pages · 1/ }).click();
  await page.getByPlaceholder("New page name").fill("About");
  await page.getByRole("button", { name: "+ Add page" }).click();
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  await expect(page.getByText("/about", { exact: true })).toBeVisible();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON", exact: true }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("website-design.json");
  const stream = await file.createReadStream();
  expect(stream).not.toBeNull();
  let json = "";
  for await (const chunk of stream!) json += chunk.toString();
  const blueprint = JSON.parse(json);
  expect(blueprint.schemaVersion).toBe("1.0.0");
  expect(blueprint.project.name).toBe("North Studio");
  expect(blueprint.project.pages).toHaveLength(2);
  expect(blueprint.status).toBe("Complete");
});

test("website builder blocks an empty project name and exposes session-only behavior", async ({ page }) => {
  await page.goto("/website-builder");
  await page.getByRole("button", { name: "Create my website" }).click();
  await expect(page.getByRole("status")).toContainText("Add a project name");
  await expect(page.getByText(/exists only in this browser session/i)).toBeVisible();
});
