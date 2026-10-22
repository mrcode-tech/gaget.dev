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
  if (file.includes("mobile-short") || file.includes("mobile-390x640") || (file.includes("rtl") && file.includes("search"))) return { width: 390, height: 640 };
  if (file.includes("datetime-mobile-file-menu") || file.includes("datetime-mobile-features-menu")) return { width: 390, height: 844 };
  if (file.includes("tablet") || file.includes("768x1024")) return { width: 768, height: 1024 };
  if (file.includes("desktop") && filePath.startsWith("test-results/")) return { width: 1440, height: 900 };
  return null;
}

function inferState(filePath) {
  const file = path.basename(filePath).toLowerCase();
  if (file.includes("search-no-match")) return "feature-search-no-match";
  if (file.includes("search-match")) return "feature-search-match";
  if (file.includes("features-menu")) return "features-menu-default";
  return null;
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
    return {
      path: filePath,
      viewport: capture?.viewport ?? inferViewport(filePath),
      ...(capture ? {
        route: capture.route,
        locale: capture.locale,
        direction: capture.direction,
        theme: capture.theme,
        state: capture.state,
      } : {
        ...(inferState(filePath) ? { state: inferState(filePath) } : {}),
      }),
    };
  });
const testResults = {
  unitTests: process.env.CI_UNIT_TESTS ?? "unknown",
  focusedPhotoAndSidebarRegressions: process.env.CI_FOCUSED_REGRESSIONS ?? "unknown",
  componentTests: process.env.CI_COMPONENT_TESTS ?? "unknown",
  lint: process.env.CI_LINT ?? "unknown",
  typecheck: process.env.CI_TYPECHECK ?? "unknown",
  productionBuild: process.env.CI_BUILD ?? "unknown",
  smokeE2EAndBaselineStep: process.env.CI_BROWSER_VALIDATION ?? "unknown",
  designBaselineCapture: baseline
    ? (baseline.failures?.length ? "failure" : "success")
    : "not-produced",
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
const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
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
process.stdout.write(`Wrote ${outputPath} for commit ${commit}; ${screenshots.length} screenshots indexed.\n`);
