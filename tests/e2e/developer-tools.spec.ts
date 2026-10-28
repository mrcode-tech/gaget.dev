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
 await expect(page.locator('p[role="alert"]')).toContainText(/exceeded 1000 ms/i,{timeout:5000});
 await expect(page.getByRole("button",{name:"Process"})).toBeEnabled();
});

test("workflow pipeline executes a typed recipe in its dedicated worker",async({page})=>{
 await page.goto("/workflow/pipeline");
 await page.getByRole("button",{name:"Run workflow"}).click();
 await expect(page.getByRole("textbox",{name:"Workflow final output"})).toHaveValue("Hello%20GaGet.dev!",{timeout:10_000});
});
test("HTML formatter preserves mixed inline text in the browser",async({page})=>{
 await page.goto("/web/html-formatter");
 const input=page.getByRole("textbox",{name:"HTML formatter input"});
 await input.fill("<p>Hello <b>world</b> again</p>");
 await page.getByRole("button",{name:"Process"}).click();
 await expect(page.getByRole("textbox",{name:"HTML formatter output"})).toHaveValue("<p>Hello <b>world</b> again</p>");
});
