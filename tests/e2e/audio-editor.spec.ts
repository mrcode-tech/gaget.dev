import { expect, test } from "@playwright/test";

function makeWavFixture() {
  const sampleRate = 8000;
  const samples = sampleRate;
  const bytes = Buffer.alloc(44 + samples * 2);
  bytes.write("RIFF", 0);
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write("WAVE", 8);
  bytes.write("fmt ", 12);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(sampleRate, 24);
  bytes.writeUInt32LE(sampleRate * 2, 28);
  bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36);
  bytes.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) {
    bytes.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 8000), 44 + i * 2);
  }
  return bytes;
}

test("Audio Editor loads audio, switches features, and keeps processing available", async ({ page }) => {
  await page.goto("/audio/editor");
  await expect(page.getByRole("heading", { name: "Audio Editor" }).first()).toBeVisible();
  const openFeatures = page.getByRole("button", { name: "Open audio editor features" });
  await expect(openFeatures).toBeVisible();
  await openFeatures.click();
  const featureMenu = page.getByTestId("audio-feature-menu");
  await expect(featureMenu.locator("section button")).toHaveCount(18);
  await featureMenu.getByRole("button", { name: "Close feature menu" }).click();

  await page.locator("#audio-input").setInputFiles({
    name: "fixture.wav",
    mimeType: "audio/wav",
    buffer: makeWavFixture(),
  });
  await expect(page.getByText(/Decoded locally/i)).toBeVisible();
  await expect(page.locator("#audio-waveform")).toBeVisible();

  await openFeatures.click();
  await featureMenu.getByRole("button", { name: "Pitch preview" }).click();
  await expect(page.getByText(/does not apply speed or pitch changes/i)).toBeVisible();
  await expect(page.getByLabel("Preview speed (pitch changes with speed)")).toBeVisible();

  await openFeatures.click();
  await featureMenu.getByRole("button", { name: "Metadata sidecar" }).click();
  await expect(page.getByText(/Editing embedded ID3\/Vorbis tags is not supported/i)).toBeVisible();
  await expect(page.getByText(/Duration:/i)).toBeVisible();

  await openFeatures.click();
  await featureMenu.getByRole("button", { name: "WAV compression" }).click();
  await page.getByRole("button", { name: "Compress to WAV" }).click();
  await expect(page.getByText(/Ready:/i)).toBeVisible();
  await expect(page.getByText(/compressed\.wav/i)).toBeVisible();
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

test("mobile audio features use the compact bottom sheet instead of a list box", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/audio/editor");
  await expect(page.getByRole("button", { name: "Open audio editor features" })).toBeVisible();
  await page.getByRole("button", { name: "Open audio editor features" }).click();
  const menu = page.getByTestId("audio-feature-menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Pitch preview" }).click();
  await expect(menu).toBeHidden();
  await page.locator("#audio-input").setInputFiles({
    name: "fixture.wav",
    mimeType: "audio/wav",
    buffer: makeWavFixture(),
  });
  await expect(page.getByText(/Decoded locally/i)).toBeVisible();
  await page.getByRole("button", { name: "Open audio editor features" }).click();
  await page.getByTestId("audio-feature-menu").getByRole("button", { name: "Trim & range" }).click();
  const panel = page.getByTestId("audio-feature-panel");
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThan(100);
  expect(box!.y + box!.height).toBeLessThanOrEqual(790);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("audio editor menus and inspector dismiss with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/audio/editor");
  const trigger = page.getByRole("button", { name: "Open audio editor features" });
  await trigger.click();
  await expect(page.getByTestId("audio-feature-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("audio-feature-menu")).toBeHidden();
  await trigger.click();
  await page.getByTestId("audio-feature-menu").getByRole("button", { name: "Trim & range" }).click();
  await page.locator("#audio-input").setInputFiles({
    name: "fixture.wav",
    mimeType: "audio/wav",
    buffer: makeWavFixture(),
  });
  await expect(page.getByTestId("audio-feature-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("audio-feature-panel")).toBeHidden();
});

test("audio editor follows the Photo Editor navbar on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/audio/editor");

  const menubar = page.getByTestId("audio-editor-menubar");
  await expect(menubar).toBeVisible();
  await expect(menubar.getByRole("button", { name: "Open navigation" })).toBeVisible();
  await expect(menubar.getByRole("button", { name: "File menu" })).toBeVisible();
  await expect(menubar.getByRole("button", { name: "Open audio editor features" })).toBeVisible();
  await expect(page.locator("header input")).toBeHidden();
  await expect(page.getByRole("button", { name: "Export", exact: true })).toHaveCount(0);
  await expect(page.locator("main > div.fixed.inset-x-0.bottom-0")).toHaveCount(0);

  await menubar.getByRole("button", { name: "File menu" }).click();
  const fileMenu = page.getByTestId("audio-file-menu");
  await expect(fileMenu.getByRole("button", { name: "Open audio…" })).toBeVisible();
  await expect(fileMenu.getByRole("button", { name: "Export audio…" })).toBeVisible();
});

test("audio editor search returns on desktop like the shared header", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/audio/editor");
  await expect(page.locator("header input")).toBeVisible();
});
