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

test("cURL GET data is appended before fragments and ordinary data never reads @files",()=>{
 const get=parseCurl("curl -G --data-urlencode 'q=hello world' https://example.test/search?existing=1#anchor");
 assert.equal(get.url,"https://example.test/search?existing=1&q=hello%20world#anchor");
 const file=parseCurl("curl --data @private.txt https://example.test/upload");
 assert.equal(file.body,undefined);assert.match(file.unsupported.join(" "),/file-backed data is not read/i);
 const literal=parseCurl("curl --data-raw @literal-value https://example.test/upload");
 assert.equal(literal.body,"@literal-value");
});


test("cURL --json produces a JSON body and default JSON headers without reading files",()=>{
 const parsed=parseCurl("curl --json '{\"ok\":true}' https://example.test/api");
 assert.equal(parsed.method,"POST");assert.equal(parsed.body,'{"ok":true}');
 assert.deepEqual(parsed.headers,[["Content-Type","application/json"],["Accept","application/json"]]);
 const custom=parseCurl("curl --header 'Content-Type: application/problem+json' --json '{\"ok\":false}' https://example.test/api");
 assert.deepEqual(custom.headers,[["Content-Type","application/problem+json"],["Accept","application/json"]]);
 const file=parseCurl("curl --json @body.json https://example.test/api");
 assert.equal(file.body,undefined);assert.match(file.unsupported.join(" "),/file-backed data is not read/i);
});

test("XML formatting preserves text and mixed-content whitespace instead of changing document values",()=>{
 const mixed='<p>Hello <b>GaGet</b> world</p>';
 assert.equal(formatXml(mixed),mixed);
 assert.equal(formatXml(mixed,true),mixed);
 assert.equal(formatXml('<root>  meaningful text  </root>'),'<root>  meaningful text  </root>');
 assert.equal(formatXml('<root><item/><other/></root>'),'<root>\n  <item/>\n  <other/>\n</root>');
 assert.equal(formatXml('<root>\n  <item/>\n</root>'),'<root>\n  <item/>\n</root>');
});

test("XML rejects malformed, undeclared and external entity references without resolving them",()=>{
 assert.equal(formatXml('<root a="&amp;&#x41;">&lt;&#65;</root>'),'<root a="&amp;&#x41;">&lt;&#65;</root>');
 assert.throws(()=>formatXml("<root>&broken</root>"),/Malformed XML entity reference/i);
 assert.throws(()=>formatXml("<root>&unknown;</root>"),/Unknown or external XML entity/i);
 assert.throws(()=>formatXml('<root a="left < right"/>'),/attribute values cannot contain/i);
 assert.throws(()=>formatXml("<root>\u0000</root>"),/not allowed by XML 1.0/i);
 const internal='<!DOCTYPE root [<!ENTITY local "inert">]><root>&local;</root>';
 assert.equal(formatXml(internal,true),internal);
 const external='<!DOCTYPE root [<!ENTITY ext SYSTEM "file:///not-read">]><root>&ext;</root>';
 assert.throws(()=>formatXml(external),/Unknown or external XML entity/i);
});

test("XML pretty formatting indents element-only parents while preserving inline text nodes",()=>{
 assert.equal(formatXml("<catalog><item>one</item><item>two &amp; three</item></catalog>"),"<catalog>\n  <item>one</item>\n  <item>two &amp; three</item>\n</catalog>");
 assert.throws(()=>formatXml("<![CDATA[outside]]><root/>"),/CDATA is only allowed/i);
 assert.throws(()=>formatXml("<!DOCTYPE root><!DOCTYPE root><root/>"),/DOCTYPE must appear at most once/i);
});

test("HTML formatting preserves mixed inline text and quoted greater-than attributes",()=>{
 const mixed='<p>Hello <b>world</b> again</p>';
 assert.equal(formatHtml(mixed,true),mixed);
 assert.equal(formatHtml(mixed),mixed);
 const quoted='<main data-note="a > b"><p>Hello</p><p>World</p></main>';
 assert.equal(formatHtml(quoted),'<main data-note="a > b">\n  <p>Hello</p>\n  <p>World</p>\n</main>');
 assert.equal(formatHtml('<main> <p>Hello</p> </main>',true),'<main><p>Hello</p></main>');
});
test("HTML script/style bodies are treated as inert raw text during formatting",()=>{
 const source='<script>if (a < b) console.log(">");</script>';
 assert.equal(formatHtml(source,true),source);
 assert.equal(formatHtml(source),source);
});
