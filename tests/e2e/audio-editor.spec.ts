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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/audio/editor");
  await expect(page.getByTestId("audio-editor-menubar")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.getByTestId("audio-empty-intro")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Audio Editor" })).toBeVisible();
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
  await expect(page.getByTestId("audio-empty-description")).toBeHidden();
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

test("audio empty-state description aligns with the toolbar and keeps a clear upload gap across viewports", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 640, height: 800 },
    { width: 744, height: 1024 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1536, height: 960 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/audio/editor");
    const description = page.getByTestId("audio-empty-description");
    const uploadArea = page.locator('[data-testid="audio-empty-intro"] > div').first();
    await expect(description).toBeVisible();
    await expect(uploadArea).toBeVisible();
    const descriptionBox = await description.boundingBox();
    const uploadBox = await uploadArea.boundingBox();
    expect(descriptionBox).not.toBeNull();
    expect(uploadBox).not.toBeNull();
    if (descriptionBox && uploadBox) {
      expect(uploadBox.y - (descriptionBox.y + descriptionBox.height)).toBeGreaterThanOrEqual(31);
    }
    if (viewport.width >= 1024) {
      const fileMenu = await page.getByRole("button", { name: "File menu" }).boundingBox();
      expect(fileMenu).not.toBeNull();
      if (fileMenu && descriptionBox) expect(descriptionBox.x).toBeCloseTo(fileMenu.x, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
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
  expect(box!.y + box!.height).toBeLessThanOrEqual(840);
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

test("audio editor toolbar sits below the fixed global header on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/audio/editor");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.getByTestId("audio-empty-intro")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Audio Editor" })).toBeVisible();
  const menubar = page.getByTestId("audio-editor-menubar");
  await expect(menubar).toBeVisible();
  await expect(menubar.getByRole("button", { name: "Open navigation" })).toBeVisible();
  await expect(menubar.getByRole("button", { name: "File menu" })).toBeVisible();
  await expect(menubar.getByRole("button", { name: "Open audio editor features" })).toBeVisible();
  const audioBox = await menubar.boundingBox();
  expect(audioBox).not.toBeNull();
  // Match the photo editor: on mobile the editor toolbar replaces the global header,
  // so the site hamburger, File, and Features share one in-flow navbar row.
  await expect(page.locator("header")).toBeHidden();
  expect(Math.abs(audioBox!.y)).toBeLessThanOrEqual(1);
  const hamburger = menubar.getByRole("button", { name: "Open navigation" });
  const fileButton = menubar.getByRole("button", { name: "File menu" });
  const featuresButton = menubar.getByRole("button", { name: "Open audio editor features" });
  const hamburgerBox = await hamburger.boundingBox();
  const fileBox = await fileButton.boundingBox();
  const featuresBox = await featuresButton.boundingBox();
  expect(hamburgerBox).not.toBeNull();
  expect(fileBox).not.toBeNull();
  expect(featuresBox).not.toBeNull();
  if (hamburgerBox && fileBox && featuresBox && audioBox) {
    expect(fileBox.x).toBeGreaterThanOrEqual(hamburgerBox.x + hamburgerBox.width - 1);
    expect(featuresBox.x).toBeGreaterThan(fileBox.x + fileBox.width);
    expect(audioBox.x + audioBox.width - featuresBox.x - featuresBox.width).toBeCloseTo(12, 0);
  }
  await expect(page.locator("header input")).toBeHidden();
  await expect(page.getByRole("button", { name: "Export", exact: true })).toHaveCount(0);
  await expect(page.locator("main > div.fixed.inset-x-0.bottom-0")).toHaveCount(0);

  await menubar.getByRole("button", { name: "File menu" }).click();
  const fileMenu = page.getByTestId("audio-file-menu");
  await expect(fileMenu.getByRole("button", { name: "Open audio…" })).toBeVisible();
  await expect(fileMenu.getByRole("button", { name: "Export audio…" })).toBeVisible();
});

test("audio editor desktop search and category menus match the shared header", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/audio/editor");
  await expect(page.locator("header input")).toBeVisible();
  await expect(page.getByRole("button", { name: "Open audio editor features" })).toBeHidden();
  await page.getByRole("button", { name: "Export & data", exact: true }).click();
  await expect(page.getByTestId("audio-feature-menu").getByRole("button", { name: "Audio converter" })).toBeVisible();
});


test("desktop audio File and category dropdowns align with the sidebar and their triggers", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/audio/editor");

  const sidebar = page.locator("aside").first();
  const menubar = page.getByTestId("audio-editor-menubar");
  const fileTrigger = menubar.getByRole("button", { name: "File menu" });
  const sidebarToggle = page.getByRole("button", { name: "Collapse sidebar" });

  await expect(sidebar).toBeVisible();
  await fileTrigger.click();
  const fileMenu = page.getByTestId("audio-file-menu");
  await expect(fileMenu).toBeVisible();
  let sidebarBox = await sidebar.boundingBox();
  let menuBox = await fileMenu.boundingBox();
  expect(sidebarBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  if (sidebarBox && menuBox) {
    expect(menuBox.x, "File dropdown must begin after the expanded sidebar").toBeGreaterThanOrEqual(sidebarBox.x + sidebarBox.width - 1);
  }
  await fileTrigger.click();
  await expect(fileMenu).toBeHidden();

  await sidebarToggle.click();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
  await expect.poll(async () => (await sidebar.boundingBox())?.width).toBe(64);
  await page.getByRole("button", { name: "File menu" }).click();
  await expect(fileMenu).toBeVisible();
  sidebarBox = await sidebar.boundingBox();
  menuBox = await fileMenu.boundingBox();
  expect(sidebarBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  if (sidebarBox && menuBox) {
    expect(menuBox.x, "File dropdown must begin after the collapsed sidebar").toBeGreaterThanOrEqual(sidebarBox.x + sidebarBox.width - 1);
  }
  await page.getByRole("button", { name: "File menu" }).click();

  for (const group of ["Edit", "Adjust", "Analyze", "Export & data", "Record"]) {
    const trigger = page.getByRole("button", { name: group, exact: true });
    await trigger.click();
    const menu = page.getByTestId("audio-feature-menu");
    await expect(menu).toBeVisible();
    const triggerBox = await trigger.boundingBox();
    const menuBox = await menu.boundingBox();
    expect(triggerBox, group + " trigger should have a measurable position").not.toBeNull();
    expect(menuBox, group + " dropdown should have a measurable position").not.toBeNull();
    if (triggerBox && menuBox) {
      expect(menuBox.y, group + " dropdown must open below its trigger").toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height - 1);
      expect(Math.abs(menuBox.x - triggerBox.x), group + " dropdown should align to its own trigger").toBeLessThanOrEqual(2);
    }
    await expect(menu.getByRole("button", { name: "Close feature menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  }
});


test("audio editor menus use icon rows, bounded desktop widths, and outside-click dismissal", async ({ page }) => {
  for (const width of [768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/audio/editor");
    const menubar = page.getByTestId("audio-editor-menubar");
    if (width >= 1024) {
      await menubar.getByRole("button", { name: "Export & data", exact: true }).click();
      const menu = page.getByTestId("audio-feature-menu");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("button", { name: "Audio converter" }).locator("svg")).toBeVisible();
      const box = await menu.boundingBox();
      expect(box).not.toBeNull();
      if (box) expect(box.width).toBeLessThanOrEqual(320);
      await page.getByTestId("audio-editor").click({ position: { x: 5, y: 75 } });
      await expect(menu).toBeHidden();
    } else {
      const trigger = menubar.getByRole("button", { name: "Open audio editor features" });
      await trigger.click();
      const menu = page.getByTestId("audio-feature-menu");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("button", { name: "Trim & range" }).locator("svg")).toBeVisible();
      const box = await menu.boundingBox();
      expect(box).not.toBeNull();
      if (box) expect(box.width).toBeLessThanOrEqual(256);
      await page.mouse.click(5, 75);
      await expect(menu).toBeHidden();
    }
  }
});
