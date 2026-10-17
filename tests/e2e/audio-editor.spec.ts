import { expect, test } from "@playwright/test";

test("Audio Editor exposes all 18 capabilities in one feature selector", async ({ page }) => {
  await page.goto("/audio/editor");
  await expect(page.getByRole("heading", { name: "Audio Editor" }).first()).toBeVisible();
  const features = page.getByRole("combobox", { name: "Audio editing feature" });
  await expect(features).toBeVisible();
  await expect(features.locator("option")).toHaveCount(18);
  await features.selectOption("pitch");
  await expect(page.getByText(/does not export time-stretched or pitch-shifted audio/i)).toBeVisible();
  await features.selectOption("metadata-editor");
  await expect(page.getByText(/embedded ID3\/Vorbis tags is not supported/i)).toBeVisible();
});

for (const viewport of [
  { width: 320, height: 720 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 640, height: 800 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1536, height: 960 },
  { width: 1920, height: 1080 },
]) {
  test(`Audio Editor has no horizontal page overflow at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/audio/editor");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}
