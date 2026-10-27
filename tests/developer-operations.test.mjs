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

test("XML tokenizer handles quoted greater-than signs and rejects malformed lexical structures",()=>{
 assert.match(formatXml('<root value="a > b"><item/></root>'),/value="a > b"/);
 assert.throws(()=>formatXml("<root><!-- unfinished</root>"),/Unclosed XML comment/i);
 assert.throws(()=>formatXml("<root a=\"1\" a=\"2\"/>"),/Duplicate XML attribute/i);
 assert.throws(()=>formatXml("<root/><other/>"),/exactly one root/i);
 assert.throws(()=>formatXml("text<root/>"),/outside the XML root/i);
 assert.throws(()=>formatXml("<root><![CDATA[unfinished</root>"),/Unclosed CDATA/i);
 assert.throws(()=>formatXml("<root><item></root>"),/mismatched/i);
});
test("XML DOCTYPE is treated as inert source and is never resolved",()=>{
 const result=formatXml('<!DOCTYPE root [<!ENTITY local "value">]><root/>');
 assert.match(result,/<!DOCTYPE root/);
});

test("CSV rejects quotes in unquoted fields and characters after a closing quote",()=>{
 assert.throws(()=>parseCsv('na"me,value\nAda,1'),/quoted CSV field must begin/i);
 assert.throws(()=>parseCsv('name,value\n"Ada"x,1'),/after a closing CSV quote/i);
 assert.throws(()=>parseCsv('name,value\n"Ada" ,1'),/after a closing CSV quote/i);
 assert.deepEqual(parseCsv('name,value\n"Ada","hello, world"'),[["name","value"],["Ada","hello, world"]]);
});


test("cURL GET mode appends data and URL-encodes literal values without sending a request",()=>{
 const parsed=parseCurl("curl -G --data-urlencode 'q=hello world' --data 'page=2' https://example.test/search?existing=1");
 assert.equal(parsed.method,"GET");assert.equal(parsed.body,undefined);
 assert.equal(parsed.url,"https://example.test/search?existing=1&q=hello%20world&page=2");
 const generated=JSON.parse(transformDeveloperTool("curl","curl -G --data-urlencode 'access_token=top secret' https://example.test/search"));
 assert.equal(generated.request.method,"GET");assert.equal(generated.request.url.includes("top%20secret"),false);assert.equal(generated.request.url.includes("REDACTED"),true);
});

test("cURL data flags combine in order and file-backed URL-encoding is not read",()=>{
 const parsed=parseCurl("curl -d a=1 --data-raw b=2 --data-urlencode 'q=two words' https://example.test");
 assert.equal(parsed.method,"POST");assert.equal(parsed.body,"a=1&b=2&q=two%20words");
 const fileBased=parseCurl("curl --data-urlencode @private.txt https://example.test");
 assert.equal(fileBased.body,undefined);assert.match(fileBased.unsupported.join(" "),/file-based data is not read/i);
});


test("cURL preview redacts URL credentials, OAuth codes, session tokens, and secret-like headers",()=>{
 const output=transformDeveloperTool("curl","curl https://alice:password123@example.test/callback?code=oauth-secret&session=session-secret&client_secret=client-secret-value&mode=fast#ticket=fragment-secret -H 'X-Session-Token: header-secret'");
 const result=JSON.parse(output),url=result.request.url;
 for(const secret of ["alice","password123","oauth-secret","session-secret","client-secret-value","fragment-secret","header-secret"])assert.equal(JSON.stringify(result).includes(secret),false,secret+" leaked");
 assert.match(url,/mode=fast/);assert.match(url,/REDACTED/);
});


test("cURL parser consumes values for unsupported options instead of mistaking them for the URL",()=>{
 const parsed=parseCurl("curl -F 'upload=@private.txt' --connect-timeout 5 https://example.test/upload");
 assert.equal(parsed.url,"https://example.test/upload");
 assert.equal(parsed.body,undefined);
 assert.match(parsed.unsupported.join(" "),/--form|^-F/i);
 assert.match(parsed.unsupported.join(" "),/--connect-timeout/);
 assert.doesNotMatch(parsed.unsupported.join(" "),/private\.txt/);
});
