import { expect, test } from "@playwright/test";

test("mobile Features menu exposes and executes JSON File actions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/json/formatter");
  const editor = page.getByRole("textbox", { name: "Input JSON" });
  await expect(page.getByRole("button", { name: "File", exact: true })).toBeHidden();

  await page.getByRole("button", { name: "Features", exact: true }).click();
  const fileActions = page.getByTestId("json-mobile-file-actions");
  await expect(fileActions).toBeVisible();
  for (const label of ["Open JSON file…", "Copy result", "Download JSON", "Undo", "Redo", "Load sample", "Clear"]) {
    await expect(fileActions.getByRole("menuitem", { name: label })).toBeVisible();
  }

  await fileActions.getByRole("menuitem", { name: "Load sample" }).click();
  await expect(editor).toHaveValue(/GaGet\.dev/);
  await page.getByRole("button", { name: "Features", exact: true }).click();
  await page.getByTestId("json-mobile-file-actions").getByRole("menuitem", { name: "Clear" }).click();
  await expect(editor).toHaveValue("");
});

test("tablet and desktop keep File actions in a separate menu", async ({ page }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/json/formatter");
    const fileTrigger = page.getByRole("button", { name: "File", exact: true });
    await expect(fileTrigger).toBeVisible();
    await page.getByRole("button", { name: "Features", exact: true }).click();
    await expect(page.getByTestId("json-mobile-file-actions")).toBeHidden();
    await page.getByRole("button", { name: "Features", exact: true }).click();
    await fileTrigger.click();
    await expect(page.getByTestId("json-file-menu")).toBeVisible();
  }
});
