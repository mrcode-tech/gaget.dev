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

  await page.locator("#audio-input").setInputFiles({
    name: "fixture.wav",
    mimeType: "audio/wav",
    buffer: makeWavFixture(),
  });
  await expect(page.getByText(/Decoded locally/i)).toBeVisible();
  await expect(page.locator("#audio-waveform")).toBeVisible();

  await openFeatures.click();
  await featureMenu.getByRole("button", { name: "Pitch preview" }).click();
  await expect(page.getByText(/does not export time-stretched or pitch-shifted audio/i)).toBeVisible();
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
