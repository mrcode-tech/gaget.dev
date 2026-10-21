import { expect, test, type Page, type TestInfo } from "@playwright/test";

const shellPhotoPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAIAAABqVuVZAAABz0lEQVR42u3aP0rEQBQG8OQjeAIRBMEDWG8vsqX9go0XkEVItSew2iY3sHDBXrBJYWextSew1M4DrJ3FrpO8+T+Z+V6ZnRDy43uPSTb118+uYqkLJCAQgQhUVVXb9QQa0YlihGllJ7wR2FnD1UxuarZdv17OJSuPt9d7R75nL1klSBUfSawOdVQHh6tOdic9qqDKkURBHiVMVCfYeHIJtFhtog9mYRPJew1udeyNtHT2FmuNGOFiOM+Oqxwlsg9IawaZ3a1XI7iNj02Iou8JvQCpLHSNLHX84cKHjq6Rk9vzZARPOvI1Dm/s9v1evli4V4Q/nSglNEpoJz1MmeZgtn0WM4jP88NNSJ31cq7aB+o+0CNMcx2e5TU7bdf/C2HwukMvQZaj5y9HYTpL+NrIWYJSeBYNf6EmpM5itTk7PakmVZn/L2YfIoRsrijxsTRC3jr2Rshex9IIJeh4abH8dMxCVNbXHQZGKK25dI3A0aMHVIKOVohQZnbkRii2s4RGRX+jKDECB/M4UMk6oyGqr+6emJ3Po0fVT83u/NXNNTKdU/yQnEAEIlDMUv6rMXv7GDhte3nBBLEIRCACEYhABCIQgQjEIhCBCEQgAk2xfgG3srhQVmi9cgAAAABJRU5ErkJggg==",
  "base64",
);

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
    bytes.writeInt16LE(
      Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 8000),
      44 + i * 2,
    );
  }
  return bytes;
}

type EditorCase = {
  id: string;
  title: string;
  route: string;
  menubar: string;
  fileMenu: string;
  featureMenu: string;
  panel: string;
  featureButton: RegExp;
  featureName: RegExp;
  desktopFeatureTrigger: RegExp;
  desktopFeatureMenu: string;
  desktopFeatureName: RegExp;
};

const editors: EditorCase[] = [
  {
    id: "photo",
    title: "Photo",
    route: "/images/editor",
    menubar: '[data-testid="editor-menubar"]',
    fileMenu: '[data-testid="photo-file-menu"]',
    featureMenu: '[data-testid="mobile-feature-menu"]',
    panel: '[data-testid="feature-panel"]',
    featureButton: /Open photo editor features/i,
    featureName: /^Crop$/,
    desktopFeatureTrigger: /^Edit$/,
    desktopFeatureMenu: '[data-testid="photo-feature-menu"]',
    desktopFeatureName: /^Crop$/,
  },
  {
    id: "audio",
    title: "Audio",
    route: "/audio/editor",
    menubar: '[data-testid="audio-editor-menubar"]',
    fileMenu: '[data-testid="audio-file-menu"]',
    featureMenu: '[data-testid="audio-feature-menu"]',
    panel: '[data-testid="audio-feature-panel"]',
    featureButton: /Open audio editor features/i,
    featureName: /^Trim & range$/,
    desktopFeatureTrigger: /^Edit$/,
    desktopFeatureMenu: '[data-testid="audio-feature-menu"]',
    desktopFeatureName: /^Trim & range$/,
  },
  {
    id: "video",
    title: "Video",
    route: "/video/editor",
    menubar: '[data-testid="video-editor-menubar"]',
    fileMenu: '[data-testid="video-file-menu"]',
    featureMenu: '[data-testid="video-feature-menu"]',
    panel: '[data-testid="video-feature-panel"]',
    featureButton: /Open video editor features/i,
    featureName: /^Trim video$/,
    desktopFeatureTrigger: /^Edit$/,
    desktopFeatureMenu: '[data-testid="video-feature-menu"]',
    desktopFeatureName: /^Trim video$/,
  },
  {
    id: "datetime",
    title: "Date & Time",
    route: "/datetime/editor",
    menubar: 'nav[aria-label="Date and time editor commands"]',
    fileMenu: '[data-testid="datetime-file-menu"]',
    featureMenu: '[data-testid="datetime-feature-menu"]',
    panel: '[data-testid="datetime-feature-panel"]',
    featureButton: /^Features$/,
    featureName: /.*/,
    desktopFeatureTrigger: /^Date$/,
    desktopFeatureMenu: '[data-testid="datetime-date-menu"]',
    desktopFeatureName: /^Calendar\b/,
  },
];

const viewports = [
  { name: "mobile-short", width: 390, height: 640 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

async function makeWebmFixture(page: Page): Promise<Buffer | null> {
  const result = await page.evaluate(async () => {
    if (typeof MediaRecorder === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 90;
    const context = canvas.getContext("2d");
    if (!context || typeof canvas.captureStream !== "function") return null;
    const mimeType = ["video/webm;codecs=vp8", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
    if (!mimeType) return null;

    const stream = canvas.captureStream(8);
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, { mimeType });
    const stopped = new Promise<void>((resolve) => {
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => resolve(), { once: true });
    });
    recorder.start();
    const startedAt = performance.now();
    while (performance.now() - startedAt < 1000) {
      context.fillStyle = "#e8f0ff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#3b82f6";
      context.fillRect(12, 12, 60, 48);
      context.fillStyle = "#16a34a";
      context.fillRect(80, 28, 64, 42);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    recorder.stop();
    await stopped;
    stream.getTracks().forEach((track) => track.stop());
    const blob = new Blob(chunks, { type: recorder.mimeType || mimeType });
    if (!blob.size) return null;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return { base64: btoa(binary), mimeType: blob.type };
  });
  return result ? Buffer.from(result.base64, "base64") : null;
}

async function assertWithinViewport(page: Page, selector: string, label: string) {
  const box = await page.locator(selector).boundingBox();
  expect(box, `${label} should have a measurable rendered box`).not.toBeNull();
  if (!box) return;
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  if (!viewport) return;
  expect(box.x, `${label} should not be clipped beyond the left viewport edge`).toBeGreaterThanOrEqual(-1);
  expect(box.y, `${label} should not be clipped beyond the top viewport edge`).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width, `${label} should not exceed the right viewport edge`).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height, `${label} should not exceed the bottom viewport edge`).toBeLessThanOrEqual(viewport.height + 1);
}

async function saveStateScreenshot(page: Page, testInfo: TestInfo, name: string) {
  await page.screenshot({ path: testInfo.outputPath(name), animations: "disabled" });
}

for (const editor of editors) {
  for (const viewport of viewports) {
    for (const theme of ["light", "dark"] as const) {
      test(`${editor.title} shared shell menus stay viewport-bounded at ${viewport.width}×${viewport.height} in ${theme} theme`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
        await page.goto(editor.route);

        const menubar = page.locator(editor.menubar);
        await expect(menubar).toBeVisible();
        await expect(menubar).toHaveCSS("height", "68px");

        const fileTrigger = menubar.getByRole("button", { name: /^File( menu)?$/ });
        await expect(fileTrigger).toBeVisible();
        await fileTrigger.click();
        await expect(page.locator(editor.fileMenu)).toBeVisible();
        await assertWithinViewport(page, editor.fileMenu, `${editor.title} File menu`);
        await saveStateScreenshot(page, testInfo, `${editor.id}-${viewport.name}-${theme}-file-menu.png`);
        await page.keyboard.press("Escape");
        await expect(page.locator(editor.fileMenu)).toBeHidden();
        await expect(fileTrigger).toBeFocused();

        if (viewport.width < 1024) {
          const featureTrigger = menubar.getByRole("button", { name: editor.featureButton });
          await expect(featureTrigger).toBeVisible();
          await featureTrigger.click();
          const featureMenu = page.locator(editor.featureMenu);
          await expect(featureMenu).toBeVisible();
          await assertWithinViewport(page, editor.featureMenu, `${editor.title} Features menu`);
          await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
          await saveStateScreenshot(page, testInfo, `${editor.id}-${viewport.name}-${theme}-features-menu.png`);
          await page.keyboard.press("Escape");
          await expect(featureMenu).toBeHidden();
          await expect(featureTrigger).toBeFocused();
        } else {
          const featureTrigger = menubar.getByRole("button", { name: editor.desktopFeatureTrigger });
          await expect(featureTrigger).toBeVisible();
          await featureTrigger.click();
          const featureMenu = page.locator(editor.desktopFeatureMenu);
          await expect(featureMenu).toBeVisible();
          await expect(featureMenu.getByRole("button", { name: editor.desktopFeatureName })).toBeVisible();
          await assertWithinViewport(page, editor.desktopFeatureMenu, `${editor.title} desktop feature menu`);
          await saveStateScreenshot(page, testInfo, `${editor.id}-${viewport.name}-${theme}-desktop-features-menu.png`);
          await page.keyboard.press("Escape");
          await expect(featureMenu).toBeHidden();
          await expect(featureTrigger).toBeFocused();
        }

        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      });
    }
  }
}

const panelViewports = [
  { name: "mobile-short", width: 390, height: 640 },
  { name: "tablet", width: 768, height: 1024 },
] as const;

for (const editor of editors) {
  for (const viewport of panelViewports) {
    for (const theme of ["light", "dark"] as const) {
      test(`${editor.title} shared shell keeps its feature panel inside the ${viewport.name} viewport in ${theme} theme`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
        await page.goto(editor.route);

        if (editor.id === "photo") {
          await page.locator('input[type="file"]').first().setInputFiles({
            name: "shell-fixture.png",
            mimeType: "image/png",
            buffer: shellPhotoPng,
          });
          await expect(page.locator("canvas[role='img']")).toBeVisible();
        }

        const menubar = page.locator(editor.menubar);
        const featureTrigger = menubar.getByRole("button", { name: editor.featureButton });
        await featureTrigger.click();
        const featureMenu = page.locator(editor.featureMenu);
        await expect(featureMenu).toBeVisible();

        const featureButton = editor.id === "datetime"
          ? featureMenu.locator("section button").first()
          : featureMenu.getByRole("button", { name: editor.featureName });
        await expect(featureButton).toBeVisible();
        await featureButton.click();

        if (editor.id === "audio") {
          await page.locator("#audio-input").setInputFiles({
            name: "shell-fixture.wav",
            mimeType: "audio/wav",
            buffer: makeWavFixture(),
          });
          await expect(page.getByText(/Decoded locally/i)).toBeVisible();
        }

        const panel = page.locator(editor.panel);
        await expect(panel).toBeVisible();
        await assertWithinViewport(page, editor.panel, `${editor.title} feature panel`);
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await saveStateScreenshot(page, testInfo, `${editor.id}-${viewport.name}-${theme}-panel.png`);
      });
    }
  }
}

test("Video loaded-state feature panel remains bounded on short mobile screens", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/video/editor");
  const videoFixture = await makeWebmFixture(page);
  test.skip(!videoFixture, "This Chromium runtime cannot create a supported WebM fixture with MediaRecorder.");

  await page.locator('input[type="file"]').first().setInputFiles({
    name: "shell-fixture.webm",
    mimeType: "video/webm",
    buffer: videoFixture!,
  });
  await expect(page.getByText(/Video ready\. Source stays on your device\./i)).toBeVisible({ timeout: 10000 });
  await expect(page.locator("video")).toBeVisible();

  const menubar = page.locator('[data-testid="video-editor-menubar"]');
  const featureTrigger = menubar.getByRole("button", { name: /Open video editor features/i });
  await featureTrigger.click();
  const featureMenu = page.locator('[data-testid="video-feature-menu"]');
  await expect(featureMenu).toBeVisible();
  await featureMenu.getByRole("button", { name: /^Trim video$/ }).click();

  const panel = page.locator('[data-testid="video-feature-panel"]');
  await expect(panel).toBeVisible();
  await assertWithinViewport(page, '[data-testid="video-feature-panel"]', "Video loaded-state feature panel");
  await saveStateScreenshot(page, testInfo, "video-mobile-short-dark-loaded-panel.png");
});

for (const route of ["/fa/images/editor", "/fa/audio/editor", "/fa/video/editor", "/fa/datetime/editor", "/ar/datetime/editor"]) {
  test(`RTL editor shell stays within viewport on ${route}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto(route);

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const main = route.includes("/datetime/")
      ? page.locator("main").first()
      : page.locator('[data-testid$="-editor"], [data-testid="photo-editor"]').first();
    await expect(main).toBeVisible();
    if (route.includes("/datetime/")) await expect(main).toHaveAttribute("dir", "rtl");

    const menubar = route.includes("/datetime/")
      ? page.locator('nav[aria-label="Date and time editor commands"]')
      : page.locator(route.includes("/images/") ? '[data-testid="editor-menubar"]' : route.includes("/audio/") ? '[data-testid="audio-editor-menubar"]' : '[data-testid="video-editor-menubar"]');
    const fileTrigger = menubar.getByRole("button", { name: /^File( menu)?$/ });
    const fileMenuSelector = route.includes("/datetime/") ? '[data-testid="datetime-file-menu"]' : route.includes("/images/") ? '[data-testid="photo-file-menu"]' : route.includes("/audio/") ? '[data-testid="audio-file-menu"]' : '[data-testid="video-file-menu"]';
    await fileTrigger.click();
    await expect(page.locator(fileMenuSelector)).toBeVisible();
    await assertWithinViewport(page, fileMenuSelector, `RTL File menu for ${route}`);
    await saveStateScreenshot(page, testInfo, `${route.replaceAll("/", "-").replace(/^-/, "")}-rtl-dark-file-menu.png`);
    await page.keyboard.press("Escape");
    await expect(page.locator(fileMenuSelector)).toBeHidden();

    const featureTrigger = menubar.getByRole("button", { name: route.includes("/datetime/") ? /^Features$/ : /Open .* editor features/i });
    await featureTrigger.click();
    const menuSelector = route.includes("/datetime/") ? '[data-testid="datetime-feature-menu"]' : route.includes("/images/") ? '[data-testid="mobile-feature-menu"]' : route.includes("/audio/") ? '[data-testid="audio-feature-menu"]' : '[data-testid="video-feature-menu"]';
    await expect(page.locator(menuSelector)).toBeVisible();
    await assertWithinViewport(page, menuSelector, `RTL Features menu for ${route}`);
    const featureTriggerBox = await featureTrigger.boundingBox();
    const featureMenuBox = await page.locator(menuSelector).boundingBox();
    expect(featureTriggerBox).not.toBeNull();
    expect(featureMenuBox).not.toBeNull();
    if (featureTriggerBox && featureMenuBox) {
      if (route.includes("/datetime/")) {
        expect(featureMenuBox.x).toBeCloseTo(featureTriggerBox.x, 0);
      } else {
        expect(featureMenuBox.x + featureMenuBox.width).toBeCloseTo(featureTriggerBox.x + featureTriggerBox.width, 0);
      }
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await saveStateScreenshot(page, testInfo, `${route.replaceAll("/", "-").replace(/^-/, "")}-rtl-dark-features-menu.png`);
  });
}
