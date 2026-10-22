import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const outputPath = "artifacts/ci-logs/verification-manifest.json";
const evidenceRoots = [
  "artifacts/design-baseline",
  "artifacts/ci-logs",
  "test-results",
  "playwright-report",
];

async function listFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

async function readBaselineManifest() {
  try {
    return JSON.parse(await readFile("artifacts/design-baseline/manifest.json", "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

function inferViewport(filePath) {
  const file = path.basename(filePath).toLowerCase();
  // Prefer explicit dimensions embedded in E2E screenshot names so every
  // viewport in the responsive panel matrix is represented in the manifest.
  const dimensions = file.match(/(?:^|[^0-9])(\d{3,4})x(\d{3,4})(?:[^0-9]|$)/);
  if (dimensions) return { width: Number(dimensions[1]), height: Number(dimensions[2]) };
  if (file.includes("tablet") || file.includes("768x1024")) return { width: 768, height: 1024 };
  if (file.includes("desktop") && filePath.startsWith("test-results/")) return { width: 1440, height: 900 };
  if (file.includes("mobile-390x844")) return { width: 390, height: 844 };
  if (file.includes("mobile-short") || file.includes("mobile-390x640") || file.includes("rtl")) return { width: 390, height: 640 };
  if (file.includes("datetime-mobile-file-menu") || file.includes("datetime-mobile-features-menu")) return { width: 390, height: 844 };
  return null;
}

function inferState(filePath) {
  const file = path.basename(filePath).toLowerCase();
  if (file.includes("threshold-9") && file.includes("search-no-match")) return "threshold-9-search-no-match";
  if (file.includes("threshold-9") && file.includes("search-match")) return "threshold-9-search-match";
  if (file.includes("search-no-match")) return "feature-search-no-match";
  if (file.includes("search-match")) return "feature-search-match";
  if (file.includes("threshold-8")) return "threshold-8-no-search";
  if (file.includes("threshold-9") && file.includes("tablet")) return "threshold-9-tablet-no-search";
  if (file.includes("threshold-9")) return "threshold-9-search-visible";
  if (file.includes("file-menu")) return "file-menu";
  if (file.includes("desktop-features-menu")) return "desktop-features-menu";
  if (file.includes("features-menu")) return "features-menu-default";
  if (file.includes("panel-resized-reopened")) return "panel-resized-reopened";
  if (file.includes("-panel")) return "feature-panel";
  return null;
}

function inferScreenshotMetadata(filePath) {
  const file = path.basename(filePath).toLowerCase();
  const locale = file.startsWith("fa-") ? "fa" : file.startsWith("ar-") ? "ar" : "en";
  const direction = locale === "en" ? "ltr" : "rtl";
  const theme = file.includes("-dark-") ? "dark" : file.includes("-light-") ? "light" : undefined;
  let route;
  if (file.startsWith("feature-search-threshold-")) route = "/ci/feature-menu-search";
  else if (file.startsWith("photo-")) route = locale === "en" ? "/images/editor" : "/"+locale+"/images/editor";
  else if (file.startsWith("audio-")) route = locale === "en" ? "/audio/editor" : "/"+locale+"/audio/editor";
  else if (file.startsWith("video-")) route = locale === "en" ? "/video/editor" : "/"+locale+"/video/editor";
  else if (file.startsWith("datetime-") || file.startsWith("date-time-")) route = locale === "en" ? "/datetime/editor" : "/"+locale+"/datetime/editor";
  else if (file.startsWith("fa-images-editor-")) route = "/fa/images/editor";
  else if (file.startsWith("fa-audio-editor-")) route = "/fa/audio/editor";
  else if (file.startsWith("fa-video-editor-")) route = "/fa/video/editor";
  else if (file.startsWith("fa-datetime-editor-")) route = "/fa/datetime/editor";
  else if (file.startsWith("ar-images-editor-")) route = "/ar/images/editor";
  else if (file.startsWith("ar-audio-editor-")) route = "/ar/audio/editor";
  else if (file.startsWith("ar-video-editor-")) route = "/ar/video/editor";
  else if (file.startsWith("ar-datetime-editor-")) route = "/ar/datetime/editor";
  return { ...(route ? { route } : {}), locale, direction, ...(theme ? { theme } : {}) };
}

const commit = process.env.GITHUB_SHA ?? "unknown";
const repository = process.env.CI_REPOSITORY ?? process.env.GITHUB_REPOSITORY ?? "unknown";
const runId = process.env.CI_RUN_ID ?? process.env.GITHUB_RUN_ID ?? "unknown";
const baseline = await readBaselineManifest();
const files = (await Promise.all(evidenceRoots.map(listFiles))).flat().sort();
const baselineCaptureMap = new Map(
  (baseline?.captures ?? []).map((capture) => [
    path.join("artifacts/design-baseline", capture.screenshot),
    capture,
  ]),
);
const screenshots = files
  .filter((filePath) => filePath.toLowerCase().endsWith(".png"))
  .map((filePath) => {
    const capture = baselineCaptureMap.get(filePath);
    const inferred = inferScreenshotMetadata(filePath);
    return {
      path: filePath,
      commit,
      viewport: capture?.viewport ?? inferViewport(filePath),
      ...(capture ? {
        route: capture.route,
        locale: capture.locale,
        direction: capture.direction,
        theme: capture.theme,
        state: capture.state,
      } : {
        ...inferred,
        ...(inferState(filePath) ? { state: inferState(filePath) } : {}),
      }),
    };
  });
const testResults = {
  dependencyInstall: process.env.CI_DEPENDENCY_INSTALL ?? "unknown",
  browserInstall: process.env.CI_BROWSER_INSTALL ?? "unknown",
  unitTests: process.env.CI_UNIT_TESTS ?? "unknown",
  focusedPhotoAndSidebarRegressions: process.env.CI_FOCUSED_REGRESSIONS ?? "unknown",
  componentTests: process.env.CI_COMPONENT_TESTS ?? "unknown",
  lint: process.env.CI_LINT ?? "unknown",
  typecheck: process.env.CI_TYPECHECK ?? "unknown",
  productionBuild: process.env.CI_BUILD ?? "unknown",
  smokeTests: process.env.CI_SMOKE_TESTS ?? "unknown",
  e2eTests: process.env.CI_E2E_TESTS ?? "unknown",
  smokeE2EAndBaselineStep: process.env.CI_BROWSER_VALIDATION ?? "unknown",
  designBaselineCapture: process.env.CI_DESIGN_BASELINE
    ?? (baseline ? (baseline.failures?.length ? "failure" : "success") : "not-produced"),
  jobStatusAtManifestGeneration: process.env.CI_JOB_STATUS ?? "unknown",
};
const viewportCoverage = [];
for (const screenshot of screenshots) {
  if (!screenshot.viewport) continue;
  const key = `${screenshot.viewport.width}x${screenshot.viewport.height}`;
  if (!viewportCoverage.some((viewport) => `${viewport.width}x${viewport.height}` === key)) {
    viewportCoverage.push(screenshot.viewport);
  }
}
const validationErrors = [];
if (!/^[a-f0-9]{40}$/i.test(commit)) {
  validationErrors.push(`Expected a full 40-character tested commit SHA, received "${commit}".`);
}
if (baseline && baseline.commit !== commit) {
  validationErrors.push(`Baseline commit ${baseline.commit ?? "missing"} does not match tested commit ${commit}.`);
}
if (baseline?.failures?.length) {
  validationErrors.push(`Design baseline reported ${baseline.failures.length} failed capture(s).`);
}

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
for (const screenshot of screenshots) {
  try {
    const image = await readFile(screenshot.path);
    if (image.length < 24 || !image.subarray(0, 8).equals(pngSignature)) {
      validationErrors.push(`Screenshot is not a readable PNG: ${screenshot.path}`);
      continue;
    }
    if (image.readUInt32BE(16) < 1 || image.readUInt32BE(20) < 1) {
      validationErrors.push(`Screenshot has invalid PNG dimensions: ${screenshot.path}`);
    }
  } catch (error) {
    validationErrors.push(`Screenshot could not be read: ${screenshot.path}: ${String(error)}`);
  }
  if (screenshot.commit !== commit) {
    validationErrors.push(`Screenshot commit mismatch: ${screenshot.path}`);
  }
  if (screenshot.state && !screenshot.viewport) {
    validationErrors.push(`Screenshot state has no viewport metadata: ${screenshot.path}`);
  }
}

const requiredViewportKeys = [
  "320x844", "360x844", "390x844", "430x844",
  "390x640", "768x1024", "1440x900",
];
for (const key of requiredViewportKeys) {
  if (!viewportCoverage.some((viewport) => `${viewport.width}x${viewport.height}` === key)) {
    validationErrors.push(`Required viewport evidence is missing: ${key}`);
  }
}
for (const route of ["/images/editor", "/audio/editor", "/video/editor", "/datetime/editor"]) {
  const hasShortMobilePanel = screenshots.some((screenshot) =>
    screenshot.route === route
    && screenshot.state === "panel-resized-reopened"
    && screenshot.viewport?.width === 390
    && screenshot.viewport?.height === 640
  );
  if (!hasShortMobilePanel) {
    validationErrors.push(`Missing short-mobile resized/reopened panel screenshot for ${route}.`);
  }
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  valid: validationErrors.length === 0,
  validationErrors,
  repository,
  branch: process.env.GITHUB_REF_NAME ?? "unknown",
  commit,
  workflow: process.env.CI_WORKFLOW ?? process.env.GITHUB_WORKFLOW ?? "unknown",
  runId,
  runAttempt: process.env.CI_RUN_ATTEMPT ?? process.env.GITHUB_RUN_ATTEMPT ?? "unknown",
  runUrl: `https://github.com/${repository}/actions/runs/${runId}`,
  browser: baseline?.browser ?? "Playwright Chromium; exact version unavailable because baseline capture did not complete",
  testResults,
  viewportCoverage,
  screenshotCount: screenshots.length,
  screenshots,
  evidenceFiles: await Promise.all(files.map(async (filePath) => ({
    path: filePath,
    sizeBytes: (await stat(filePath)).size,
  }))),
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(manifest, null, 2) + "\n");
process.stdout.write(`Wrote ${outputPath} for commit ${commit}; ${screenshots.length} screenshots indexed; validation ${manifest.valid ? "passed" : "failed"}.\n`);
if (validationErrors.length) {
  for (const error of validationErrors) process.stderr.write(`Evidence validation error: ${error}\n`);
  process.exitCode = 1;
}
