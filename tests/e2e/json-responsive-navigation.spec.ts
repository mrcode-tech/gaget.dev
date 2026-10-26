import { expect, test } from "@playwright/test";

test("mobile File and Feature menus are separate and execute their own actions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/json/formatter");
  const editor = page.getByRole("textbox", { name: "Input JSON" });
  const fileTrigger = page.getByRole("button", { name: "File", exact: true });
  const featureTrigger = page.getByRole("button", { name: "Feature", exact: true });
  await expect(fileTrigger).toBeVisible();
  await expect(featureTrigger).toBeVisible();

  await fileTrigger.click();
  const fileMenu = page.getByTestId("json-file-menu");
  for (const label of ["Open JSON file…", "Copy result", "Download JSON", "Undo", "Redo", "Load sample JSON", "Clear document"]) {
    await expect(fileMenu.getByRole("menuitem", { name: label })).toBeVisible();
  }
  await fileMenu.getByRole("menuitem", { name: "Load sample JSON" }).click();
  await expect(editor).toHaveValue(/GaGet\.dev/);

  await featureTrigger.click();
  const featuresMenu = page.getByTestId("json-features-menu");
  await expect(featuresMenu).toBeVisible();
  await expect(featuresMenu.getByTestId("json-mobile-feature-list").getByRole("menuitemradio")).toHaveCount(9);
  await expect(featuresMenu.getByRole("menuitem", { name: "Clear document" })).toHaveCount(0);
  await featureTrigger.click();
  await fileTrigger.click();
  await page.getByTestId("json-file-menu").getByRole("menuitem", { name: "Clear document" }).click();
  await expect(editor).toHaveValue("");
});

test("tablet and desktop keep File actions separate and show four desktop menus", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/json/formatter");
  const bar = page.getByTestId("json-editor-menubar");
  for (const label of ["File", "Utilities", "View", "Convert"]) {
    await expect(bar.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
  await bar.getByRole("button", { name: "File", exact: true }).click();
  await expect(page.getByTestId("json-file-menu")).toBeVisible();

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/json/formatter");
  const desktopBar = page.getByTestId("json-editor-menubar");
  for (const label of ["File", "Utilities", "View", "Convert"]) {
    await expect(desktopBar.getByRole("button", { name: label, exact: true })).toBeVisible();
  }
  await desktopBar.getByRole("button", { name: "Utilities", exact: true }).click();
  await expect(page.getByTestId("json-group-menu").getByRole("menuitemradio")).toHaveCount(5);
});
