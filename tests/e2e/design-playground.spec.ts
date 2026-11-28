import { expect, test } from "@playwright/test";

const styles = ["bauhaus", "swiss", "minimalism", "art-deco", "de-stijl"];

test("Design Playground landing page links to every registered style", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/design");
  await expect(page.getByRole("heading", { level: 1, name: "Explore the ideas that shape what you see." })).toBeVisible();
  const styleNavigation = page.getByRole("navigation", { name: "Design styles" });
  for (const style of styles) {
    await expect(styleNavigation.getByRole("link", { name: new RegExp(style === "art-deco" ? "Art Deco" : style === "de-stijl" ? "De Stijl" : style, "i") })).toHaveAttribute("href", `/design/${style}`);
  }
  await expect(page.getByRole("navigation", { name: "Design styles" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to GaGet" })).toHaveAttribute("href", "/");
});

for (const style of styles) {
  test(`Design style route /design/${style} renders learning content and sample portfolio`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const response = await page.goto(`/design/${style}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("region", { name: new RegExp(`Sample portfolio rendered in ${style} style`, "i") })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Historical context" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Color palette" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Typography" })).toBeVisible();
    await expect(page.getByText("Northline Journal", { exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Design styles" })).toBeVisible();
  });
}

test("unknown Design style returns the not-found page", async ({ page }) => {
  const response = await page.goto("/design/not-a-real-style");
  expect(response?.status()).toBe(404);
});
