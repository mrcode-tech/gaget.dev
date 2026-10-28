import test from "node:test";
import assert from "node:assert/strict";
import { executePipeline, executeBatch, executeBatchAsync, executePipelineAsync, parsePipelineRecipe, validatePipelineRecipe, MAX_PIPELINE_STEPS } from "../lib/tools/workflow-pipeline.ts";
test("typed pipelines transform data through compatible operations and report intermediate values",()=>{const recipe={version:1,inputType:"text",steps:[{operation:"trim"},{operation:"uppercase"},{operation:"url-encode"}]};const result=executePipeline("  Hello world  ",recipe);assert.equal(result.output,"HELLO%20WORLD");assert.equal(result.steps.length,3);assert.equal(result.steps[2].outputType,"url");});
test("incompatible steps and unsupported operation IDs are rejected before execution",()=>{assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"base64-decode"}]}),/Incompatible/i);assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"arbitrary-code"}]}),/unsupported operation/i);assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",input:"secret",steps:[]}),/unsupported fields/i);});
test("versioned recipe import rejects malformed, oversized, and excessive-step recipes",()=>{assert.equal(parsePipelineRecipe('{"version":1,"inputType":"text","steps":[]}').version,1);assert.throws(()=>parsePipelineRecipe("{"),/valid JSON/i);assert.throws(()=>parsePipelineRecipe("x".repeat(32001)),/32,000/i);assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:Array.from({length:MAX_PIPELINE_STEPS+1},()=>({operation:"trim"}))}),/at most 20/i);});
test("batch mode is sequential, bounded, and isolates per-record failures",()=>{const result=JSON.parse(executeBatch("hello\nworld",{version:1,inputType:"text",steps:[{operation:"base64-encode"}]}));assert.deepEqual(result.map(x=>x.output),["aGVsbG8=","d29ybGQ="]);assert.throws(()=>executeBatch(Array.from({length:101},()=> "x").join("\n"),{version:1,inputType:"text",steps:[]}),/100 lines/i);});
test("pipeline input and output resource limits are enforced",()=>{assert.throws(()=>executePipeline("x".repeat(200001),{version:1,inputType:"text",steps:[]}),/200,000/i);assert.throws(()=>executePipeline("x".repeat(600000),{version:1,inputType:"text",steps:[{operation:"base64-encode"}]}),/200,000/i);});

test("batch input has a total-size cap before processing records",()=>{assert.throws(()=>executeBatch("x".repeat(200001),{version:1,inputType:"text",steps:[]}),/200,000 characters total/i);});

test("batch processing isolates malformed encoded records",()=>{const result=JSON.parse(executeBatch("SGVsbG8=\n%%% ",{version:1,inputType:"base64",steps:[{operation:"base64-decode"}]}));assert.equal(result[0].output,"Hello");assert.match(result[1].error,/Base64/i);});

test("async pipeline supports cooperative cancellation between bounded steps",async()=>{
 const controller=new AbortController();const recipe={version:1,inputType:"text",steps:Array.from({length:20},()=>({operation:"trim"}))};
 const promise=executePipelineAsync("  hello  ",recipe,controller.signal);setTimeout(()=>controller.abort(),0);
 await assert.rejects(promise,/cancelled/i);
});
test("async batch cancellation stops processing instead of swallowing the abort as a row error",async()=>{
 const controller=new AbortController();const recipe={version:1,inputType:"text",steps:[{operation:"trim"}]};
 const promise=executeBatchAsync(Array.from({length:100},(_,i)=>"line"+i).join("\n"),recipe,controller.signal);setTimeout(()=>controller.abort(),0);
 await assert.rejects(promise,/cancelled/i);
});

test("typed workflow supports Base64url, Base32 and Bitcoin Base58 without allowing incompatible byte/text steps",()=>{
 const cases=[
  {inputType:"text",steps:[{operation:"base64url-encode"},{operation:"base64url-decode"}],expected:"Hello 👋"},
  {inputType:"text",steps:[{operation:"base32-encode"},{operation:"base32-decode"}],expected:"Hello 👋"},
  {inputType:"text",steps:[{operation:"base58-encode"},{operation:"base58-decode"}],expected:"Hello 👋"}
 ];
 for(const c of cases){const result=executePipeline(c.expected,{version:1,inputType:c.inputType,steps:c.steps});assert.equal(result.output,c.expected);assert.equal(result.steps.length,2);}
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"base32-decode"}]}),/Incompatible/i);
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"base64url",steps:[{operation:"base64-decode"}]}),/Incompatible/i);
});

test("typed workflow encodes and decodes HTML entities as text without executing markup",()=>{
 const result=executePipeline("<script>alert('x')</script>",{version:1,inputType:"text",steps:[{operation:"html-entities-encode"},{operation:"html-entities-decode"}]});
 assert.equal(result.output,"<script>alert('x')</script>");
 assert.equal(executePipeline("<b>&</b>",{version:1,inputType:"text",steps:[{operation:"html-entities-encode"}]}).output,"&lt;b&gt;&amp;&lt;/b&gt;");
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"html-entities-decode"}]}),/Incompatible/i);
});

test("typed workflow supports explicit UTF-16 and Windows-1252 byte representations",()=>{
 const utf16le=executePipeline("A😀",{version:1,inputType:"text",steps:[{operation:"utf16le-encode"}]});
 assert.equal(utf16le.output,"41003dd800de");
 assert.equal(executePipeline(utf16le.output,{version:1,inputType:"hex",steps:[{operation:"utf16le-decode"}]}).output,"A😀");
 const utf16be=executePipeline("A",{version:1,inputType:"text",steps:[{operation:"utf16be-encode"}]});
 assert.equal(utf16be.output,"0041");
 assert.equal(executePipeline(utf16be.output,{version:1,inputType:"hex",steps:[{operation:"utf16be-decode"}]}).output,"A");
 const cp=executePipeline("café",{version:1,inputType:"text",steps:[{operation:"windows1252-encode"}]});
 assert.equal(cp.output,"636166e9");
 assert.equal(executePipeline(cp.output,{version:1,inputType:"hex",steps:[{operation:"windows1252-decode"}]}).output,"café");
 assert.throws(()=>executePipeline("🙂",{version:1,inputType:"text",steps:[{operation:"windows1252-encode"}]}),/cannot be represented/i);
});

test("typed workflow supports Adobe ASCII85 and ZeroMQ Z85 with explicit compatibility",()=>{
 const ascii=executePipeline("Man ",{version:1,inputType:"text",steps:[{operation:"ascii85-encode"},{operation:"ascii85-decode"}]});
 assert.equal(ascii.output,"Man ");assert.equal(ascii.steps[0].outputType,"ascii85");
 const z85=executePipeline("abcd",{version:1,inputType:"text",steps:[{operation:"z85-encode"},{operation:"z85-decode"}]});
 assert.equal(z85.output,"abcd");assert.equal(z85.steps[0].outputType,"z85");
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"z85-decode"}]}),/Incompatible/i);
 assert.throws(()=>executePipeline("abc",{version:1,inputType:"text",steps:[{operation:"z85-encode"}]}),/divisible by four/i);
});


test("byte-oriented workflows preserve arbitrary binary bytes across encoded representations",()=>{
 const source="00ff010d0a";
 const cases=[
  {encode:"bytes-base64-encode",decode:"base64-bytes-decode",expected:"AP8BDQo="},
  {encode:"bytes-base64url-encode",decode:"base64url-bytes-decode",expected:"AP8BDQo"},
  {encode:"bytes-base32-encode",decode:"base32-bytes-decode"},
  {encode:"bytes-base58-encode",decode:"base58-bytes-decode"},
  {encode:"bytes-ascii85-encode",decode:"ascii85-bytes-decode"},
  {encode:"bytes-quoted-printable-encode",decode:"quoted-printable-bytes-decode"},
  {encode:"bytes-binary-encode",decode:"binary-bytes-decode"}
 ];
 for(const item of cases){const encoded=executePipeline(source,{version:1,inputType:"raw-hex",steps:[{operation:item.encode}]});if(item.expected)assert.equal(encoded.output,item.expected,item.encode);const decoded=executePipeline(encoded.output,{version:1,inputType:encoded.steps[0].outputType,steps:[{operation:item.decode}]});assert.equal(decoded.output,source,item.encode+" round trip");}
});
test("byte-oriented workflow preserves invalid UTF-8 until an explicit text decode and supports Z85 blocks",()=>{
 const source="00010203";const encoded=executePipeline(source,{version:1,inputType:"raw-hex",steps:[{operation:"bytes-z85-encode"}]});assert.equal(encoded.output,"009c6");
 assert.equal(executePipeline(encoded.output,{version:1,inputType:"z85",steps:[{operation:"z85-bytes-decode"}]}).output,source);
 assert.throws(()=>executePipeline("ff",{version:1,inputType:"raw-hex",steps:[{operation:"raw-hex-to-text"}]}),/UTF-8/i);
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"base64-bytes-decode"}]}),/Incompatible/i);
});
test("recipe import stays data-only and rejects prototype keys, custom properties and unsupported operation fields",()=>{
 for(const source of [
  '{"version":1,"inputType":"raw-hex","steps":[],"__proto__":{"polluted":true}}',
  '{"version":1,"inputType":"raw-hex","steps":[{"operation":"bytes-base64-encode","script":"alert(1)"}]}',
  '{"version":1,"inputType":"raw-hex","steps":[{"operation":"bytes-base64-encode","options":{"key":"secret"}}]}'
 ])assert.throws(()=>parsePipelineRecipe(source),/unsupported fields|only an operation ID/i);
 assert.equal(Object.prototype.polluted,undefined);
});

test("raw-byte pipeline operations reverse bytes and apply invert/bit rotations without text decoding",()=>{
 const recipe=(operation)=>({version:1,inputType:"raw-hex",steps:[{operation}]});
 assert.equal(executePipeline("00ff017f",recipe("raw-bytes-reverse")).output,"7f01ff00");
 assert.equal(executePipeline("00ff017f",recipe("raw-bytes-not")).output,"ff00fe80");
 assert.equal(executePipeline("0180",recipe("raw-bytes-rotate-left")).output,"0201");
 assert.equal(executePipeline("0180",recipe("raw-bytes-rotate-right")).output,"8040");
 const roundTrip=executePipeline("00117f80ff",{version:1,inputType:"raw-hex",steps:[{operation:"raw-bytes-rotate-left"},{operation:"raw-bytes-rotate-right"}]});
 assert.equal(roundTrip.output,"00117f80ff");
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"raw-bytes-not"}]}),/Incompatible/i);
});

test("raw-byte workflow computes known checksums and bounded byte statistics",()=>{
 const recipe=(operation)=>({version:1,inputType:"raw-hex",steps:[{operation}]});
 assert.equal(executePipeline("313233343536373839",recipe("raw-bytes-crc32")).output,"CBF43926");
 assert.equal(executePipeline("313233343536373839",recipe("raw-bytes-adler32")).output,"091E01DE");
 const summary=JSON.parse(executePipeline("41414200",recipe("raw-bytes-summary")).output);
 assert.equal(summary.byteLength,4);assert.equal(summary.uniqueByteValues,3);assert.equal(summary.printableAsciiRatio,0.75);assert.equal(summary.crc32,"B1FB2A34");
 assert.throws(()=>validatePipelineRecipe({version:1,inputType:"text",steps:[{operation:"raw-bytes-crc32"}]}),/Incompatible/i);
});
