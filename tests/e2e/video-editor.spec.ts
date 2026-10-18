import { expect, test } from "@playwright/test";

test("Video Editor uses the shared empty state and responsive feature menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/video/editor");
  await expect(page.getByTestId("video-editor-menubar")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Video Editor" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Choose video" })).toBeVisible();

  await page.getByRole("button", { name: "Open video editor features" }).click();
  const menu = page.getByTestId("video-feature-menu");
  await expect(menu).toBeVisible();
  await expect(menu.locator("section button")).toHaveCount(23);
  await menu.getByRole("button", { name: "Trim video" }).click();
  await expect(menu).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.getByTestId("video-feature-menu").getByRole("button", { name: "Trim video" })).toBeVisible();
});

test("legacy video feature route redirects into the unified editor with feature selected", async ({ page }) => {
  await page.goto("/video/trim");
  await expect(page).toHaveURL(/\/video\/editor\?feature=trim$/);
  await expect(page.getByTestId("video-editor")).toBeVisible();
});
