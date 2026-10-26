import test from "node:test";
import assert from "node:assert/strict";
import { csvToJson, jsonToCsv, parseCsv, formatXml, formatHtml, formatSql, parseCurl, transformDeveloperTool } from "../lib/tools/developer-operations.ts";
test("CSV parser handles quoted delimiters, newlines, escaped quotes and BOM",()=>{assert.deepEqual(parseCsv('\uFEFFname,notes\r\nAda,"hello, world"\r\nGrace,"line 1\nline ""2"""'),[["name","notes"],["Ada","hello, world"],["Grace",'line 1\nline "2"']]);});
test("CSV to JSON disambiguates duplicate headers and preserves strings",()=>{assert.deepEqual(JSON.parse(csvToJson("name,name\nAda,42")),[{name:"Ada",name_2:"42"}]);});
test("JSON to CSV quotes values and prefixes spreadsheet formulas",()=>{assert.equal(jsonToCsv('[{"name":"Ada","value":"=1+1"}]'),"name,value\nAda,'=1+1");});
test("CSV rejects unclosed quotes and extra cells",()=>{assert.throws(()=>parseCsv('a,b\n"unfinished'),/unclosed/i);assert.throws(()=>csvToJson("a\nb,c"),/more cells/i);});
test("XML formatter preserves comments and detects mismatched tags",()=>{assert.match(formatXml("<root><item>ok</item><!-- note --></root>"),/<!-- note -->/);assert.throws(()=>formatXml("<root></wrong>"),/mismatched/i);});
test("HTML formatter returns text and supports minification",()=>{assert.equal(formatHtml("<main> <p>Hello</p> </main>",true),"<main><p>Hello</p></main>");assert.match(formatHtml("<main><p>Hello</p></main>"),/\n/);});
test("SQL formatter preserves quoted values and produces clause breaks",()=>{const r=formatSql("select 'from users' as label from users where id=1;");assert.match(r,/SELECT/i);assert.match(r,/FROM users/i);assert.ok(!r.includes("FROM USERS'"));});
test("cURL parser handles quotes and redacts secrets",()=>{const r=parseCurl("curl -X POST https://example.com/api -H 'Authorization: Bearer secret' -d '{\"x\":\"y\"}'");assert.equal(r.method,"POST");assert.equal(r.url,"https://example.com/api");const out=transformDeveloperTool("curl","curl -H 'Authorization: Bearer secret' https://example.com");assert.match(out,/REDACTED/);assert.doesNotMatch(out,/Bearer secret/);});
test("regex tester reports ranges and handles zero-width global matches",()=>{const r=JSON.parse(transformDeveloperTool("regex","aba",{pattern:"(?=a)",flags:"g"}));assert.equal(r.count,2);assert.throws(()=>transformDeveloperTool("regex","x",{pattern:"["}),/regular expression/i);});
test("text operations reject oversized input",()=>{assert.throws(()=>transformDeveloperTool("html","x".repeat(200001)),/safety limit/i);});

test("cURL output redacts sensitive URL query parameters and consumes credential flags",()=>{const out=transformDeveloperTool("curl","curl -u user:password https://example.com/api?access_token=topsecret");assert.doesNotMatch(out,/user:password|access_token=topsecret|topsecret/);assert.match(out,/REDACTED/);});
