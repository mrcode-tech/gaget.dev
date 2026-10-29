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

test("OpenSSH public-key inspector parses a supplied Ed25519 key without exposing its comment",async({page})=>{
 await page.goto("/inspection/network-file");
 await page.getByRole("combobox",{name:"Extended operation"}).click();
 await page.getByRole("option",{name:"Inspect OpenSSH public key"}).click();
 const encoded=await page.evaluate(()=>{
  const field=(value:Uint8Array)=>{const n=value.length;return [n>>>24,(n>>>16)&255,(n>>>8)&255,n&255,...value];};
  const type=new TextEncoder().encode("ssh-ed25519"),key=Uint8Array.from({length:32},(_,i)=>i);
  const blob=Uint8Array.from([...field(type),...field(key)]);
  return btoa(Array.from(blob,b=>String.fromCharCode(b)).join(""));
 });
 await page.getByRole("textbox",{name:"Extended tool input"}).fill("ssh-ed25519 "+encoded+" private-looking-comment");
 await page.getByRole("button",{name:"Process"}).click();
 const output=page.getByRole("textbox",{name:"Extended tool output"});
 await expect(output).toHaveValue(/"fingerprint"/);
 await expect(output).toHaveValue(/"trustValidated": false/);
 await expect(output).not.toHaveValue(/private-looking-comment/);
});

test("legacy UUID URL redirects to the unified Data Generator",async({page})=>{await page.goto("/generators/uuid");await expect(page).toHaveURL(/\/generators\/sample-data$/);await expect(page.getByRole("heading",{name:"Data Generator"})).toBeVisible();await expect(page.getByRole("combobox",{name:"Data generator operation"})).toBeVisible();});


test("shared developer tools load a local UTF-8 CSV file and process it in-browser",async({page})=>{
 await page.goto("/data/csv-json");
 await page.getByLabel("Choose a text file for CSV ↔ JSON converter").setInputFiles({name:"sample.csv",mimeType:"text/csv",buffer:Buffer.from('name,city\nAda,"London, UK"',"utf8")});
 await expect(page.getByText(/Loaded sample.csv as UTF-8 text/i)).toBeVisible();
 await expect(page.getByRole("textbox",{name:"CSV ↔ JSON converter input"})).toHaveValue('name,city\nAda,"London, UK"');
 await page.getByRole("button",{name:"Process"}).click();
 await expect(page.getByRole("textbox",{name:"CSV ↔ JSON converter output"})).toHaveValue(/"city": "London, UK"/);
});

test("shared developer tools reject non-UTF-8 and oversized text files",async({page})=>{
 await page.goto("/data/csv-json");
 await page.getByLabel("Choose a text file for CSV ↔ JSON converter").setInputFiles({name:"invalid.csv",mimeType:"text/csv",buffer:Buffer.from([0xc3,0x28])});
 await expect(page.locator('[role="alert"]')).toContainText(/UTF-8/i);
 await page.getByLabel("Choose a text file for CSV ↔ JSON converter").setInputFiles({name:"large.csv",mimeType:"text/csv",buffer:Buffer.alloc(200001,0x61)});
 await expect(page.locator('[role="alert"]')).toContainText(/200,000 bytes/i);
});
