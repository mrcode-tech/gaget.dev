import { expect, test } from "@playwright/test";
test("regex workbench returns results from an isolated worker",async({page})=>{
 await page.goto("/text/regex");
 await page.getByRole("button",{name:"Process"}).click();
 await expect(page.getByRole("textbox",{name:"Text output"})).not.toHaveValue("");
});
test("pathological regex is terminated without blocking the page",async({page})=>{
 await page.goto("/text/regex");
 await page.getByRole("textbox",{name:"Text input"}).fill("a".repeat(20000)+"!");
 await page.getByRole("textbox",{name:"Regular expression pattern"}).fill("^(a+)+$");
 await page.getByRole("button",{name:"Process"}).click();
 await expect(page.getByRole("alert")).toContainText(/exceeded 1000 ms/i,{timeout:5000});
 await expect(page.getByRole("button",{name:"Process"})).toBeEnabled();
});
