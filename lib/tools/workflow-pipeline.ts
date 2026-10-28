import { transformEncoding, convertCharset, encodeByteRepresentation, decodeByteRepresentation } from "./encoding-operations.ts";
import { parseQueryString, buildQueryString } from "./extended-operations.ts";
export type PipelineDataType = "text" | "url" | "base64" | "base64url" | "base32" | "base58" | "ascii85" | "z85" | "hex" | "raw-hex" | "binary" | "unicode" | "quoted-printable" | "entities" | "json" | "query";
export const PIPELINE_INPUT_TYPES: {value:PipelineDataType;label:string}[] = [
 {value:"text",label:"Plain text"},{value:"url",label:"URL-component encoded"},{value:"base64",label:"Base64 encoded"},{value:"base64url",label:"Base64url encoded"},{value:"base32",label:"Base32 encoded"},{value:"base58",label:"Bitcoin Base58 encoded"},{value:"ascii85",label:"Adobe ASCII85 encoded"},{value:"z85",label:"ZeroMQ Z85 encoded"},{value:"hex",label:"Hexadecimal UTF-8 text bytes"},{value:"raw-hex",label:"Raw bytes (hex; byte-preserving)"},{value:"binary",label:"Binary byte representation"},{value:"unicode",label:"Unicode escapes"},{value:"quoted-printable",label:"Quoted-printable"},{value:"entities",label:"HTML entities"},{value:"json",label:"JSON text"},{value:"query",label:"Query string"}
];
export const PIPELINE_OPERATIONS = [
 {id:"trim",label:"Trim whitespace",input:"text",output:"text"},
 {id:"uppercase",label:"Uppercase",input:"text",output:"text"},
 {id:"lowercase",label:"Lowercase",input:"text",output:"text"},
 {id:"url-encode",label:"URL component encode",input:"text",output:"url"},
 {id:"url-decode",label:"URL component decode",input:"url",output:"text"},
 {id:"base64-encode",label:"Base64 encode",input:"text",output:"base64"},
 {id:"base64-decode",label:"Base64 decode",input:"base64",output:"text"},
 {id:"base64url-encode",label:"Base64url encode",input:"text",output:"base64url"},
 {id:"base64url-decode",label:"Base64url decode",input:"base64url",output:"text"},
 {id:"base32-encode",label:"Base32 encode",input:"text",output:"base32"},
 {id:"base32-decode",label:"Base32 decode",input:"base32",output:"text"},
 {id:"base58-encode",label:"Bitcoin Base58 encode",input:"text",output:"base58"},
 {id:"base58-decode",label:"Bitcoin Base58 decode",input:"base58",output:"text"},
 {id:"ascii85-encode",label:"Adobe ASCII85 encode",input:"text",output:"ascii85"},
 {id:"ascii85-decode",label:"Adobe ASCII85 decode",input:"ascii85",output:"text"},
 {id:"z85-encode",label:"ZeroMQ Z85 encode",input:"text",output:"z85"},
 {id:"z85-decode",label:"ZeroMQ Z85 decode",input:"z85",output:"text"},
 {id:"hex-encode",label:"Hex encode UTF-8 bytes",input:"text",output:"hex"},
 {id:"hex-decode",label:"Hex decode UTF-8 bytes",input:"hex",output:"text"},
 {id:"text-to-raw-hex",label:"UTF-8 text to raw bytes (hex)",input:"text",output:"raw-hex"},
 {id:"raw-hex-to-text",label:"Raw bytes (hex) to UTF-8 text",input:"raw-hex",output:"text"},
 {id:"bytes-base64-encode",label:"Raw bytes → Base64",input:"raw-hex",output:"base64"},
 {id:"base64-bytes-decode",label:"Base64 → raw bytes (hex)",input:"base64",output:"raw-hex"},
 {id:"bytes-base64url-encode",label:"Raw bytes → Base64url",input:"raw-hex",output:"base64url"},
 {id:"base64url-bytes-decode",label:"Base64url → raw bytes (hex)",input:"base64url",output:"raw-hex"},
 {id:"bytes-base32-encode",label:"Raw bytes → Base32",input:"raw-hex",output:"base32"},
 {id:"base32-bytes-decode",label:"Base32 → raw bytes (hex)",input:"base32",output:"raw-hex"},
 {id:"bytes-base58-encode",label:"Raw bytes → Bitcoin Base58",input:"raw-hex",output:"base58"},
 {id:"base58-bytes-decode",label:"Bitcoin Base58 → raw bytes (hex)",input:"base58",output:"raw-hex"},
 {id:"bytes-ascii85-encode",label:"Raw bytes → Adobe ASCII85",input:"raw-hex",output:"ascii85"},
 {id:"ascii85-bytes-decode",label:"Adobe ASCII85 → raw bytes (hex)",input:"ascii85",output:"raw-hex"},
 {id:"bytes-z85-encode",label:"Raw bytes → ZeroMQ Z85",input:"raw-hex",output:"z85"},
 {id:"z85-bytes-decode",label:"ZeroMQ Z85 → raw bytes (hex)",input:"z85",output:"raw-hex"},
 {id:"bytes-binary-encode",label:"Raw bytes → binary bits",input:"raw-hex",output:"binary"},
 {id:"binary-bytes-decode",label:"Binary bits → raw bytes (hex)",input:"binary",output:"raw-hex"},
 {id:"bytes-quoted-printable-encode",label:"Raw bytes → quoted-printable",input:"raw-hex",output:"quoted-printable"},
 {id:"quoted-printable-bytes-decode",label:"Quoted-printable → raw bytes (hex)",input:"quoted-printable",output:"raw-hex"},
 {id:"unicode-escape",label:"Unicode escape",input:"text",output:"unicode"},
 {id:"unicode-unescape",label:"Unicode unescape",input:"unicode",output:"text"},
 {id:"quoted-printable-encode",label:"Quoted-printable encode",input:"text",output:"quoted-printable"},
 {id:"quoted-printable-decode",label:"Quoted-printable decode",input:"quoted-printable",output:"text"},
 {id:"html-entities-encode",label:"HTML entity encode",input:"text",output:"entities"},
 {id:"html-entities-decode",label:"HTML entity decode",input:"entities",output:"text"},
 {id:"utf16le-encode",label:"UTF-16LE encode to hex",input:"text",output:"hex"},
 {id:"utf16le-decode",label:"UTF-16LE decode from hex",input:"hex",output:"text"},
 {id:"utf16be-encode",label:"UTF-16BE encode to hex",input:"text",output:"hex"},
 {id:"utf16be-decode",label:"UTF-16BE decode from hex",input:"hex",output:"text"},
 {id:"windows1252-encode",label:"Windows-1252 encode to hex",input:"text",output:"hex"},
 {id:"windows1252-decode",label:"Windows-1252 decode from hex",input:"hex",output:"text"},
 {id:"raw-bytes-reverse",label:"Reverse raw byte order",input:"raw-hex",output:"raw-hex"},
 {id:"raw-bytes-not",label:"Bitwise NOT each byte",input:"raw-hex",output:"raw-hex"},
 {id:"raw-bytes-rotate-left",label:"Rotate each byte left by one bit",input:"raw-hex",output:"raw-hex"},
 {id:"raw-bytes-rotate-right",label:"Rotate each byte right by one bit",input:"raw-hex",output:"raw-hex"},
 {id:"raw-bytes-crc32",label:"CRC-32/IEEE checksum",input:"raw-hex",output:"text"},
 {id:"raw-bytes-adler32",label:"Adler-32 checksum",input:"raw-hex",output:"text"},
 {id:"raw-bytes-summary",label:"Byte statistics summary",input:"raw-hex",output:"json"},
 {id:"json-format",label:"Format JSON",input:"json",output:"json"},
 {id:"json-minify",label:"Minify JSON",input:"json",output:"json"},
 {id:"query-parse",label:"Parse query string to JSON",input:"query",output:"json"},
 {id:"query-build",label:"Build query string from JSON",input:"json",output:"query"}
] as const;
export type PipelineOperation = typeof PIPELINE_OPERATIONS[number]["id"];
export type PipelineStep = {operation:PipelineOperation};
export type PipelineRecipe = {version:1;inputType:PipelineDataType;steps:PipelineStep[]};
export type PipelineStepResult = {index:number;operation:PipelineOperation;outputType:PipelineDataType;outputLength:number;preview:string};
export const MAX_PIPELINE_INPUT=200_000,MAX_PIPELINE_OUTPUT=1_000_000,MAX_PIPELINE_STEPS=20,MAX_BATCH_RECORDS=100,MAX_RECIPE_BYTES=32_000;
export const SAVED_PIPELINE_RECIPES_KEY="gaget.workflow-recipes.v1";
export const MAX_SAVED_PIPELINE_RECIPES=10;
export const MAX_SAVED_PIPELINE_RECIPES_BYTES=320_000;
export type SavedPipelineRecipe={id:string;name:string;recipe:PipelineRecipe;savedAt:number};
export function parseSavedPipelineRecipes(source:string):SavedPipelineRecipe[]{
 if(source.length>MAX_SAVED_PIPELINE_RECIPES_BYTES)throw new Error("Saved workflow recipes exceed the 320 KB limit.");
 let value:unknown;try{value=JSON.parse(source);}catch{throw new Error("Saved workflow recipes are not valid JSON.");}
 if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Saved workflow recipes must be an object.");
 const envelope=value as Record<string,unknown>;
 if(Object.keys(envelope).some(key=>!["version","recipes"].includes(key))||envelope.version!==1||!Array.isArray(envelope.recipes))throw new Error("Saved workflow recipe storage has an unsupported version or shape.");
 if(envelope.recipes.length>MAX_SAVED_PIPELINE_RECIPES)throw new Error("At most 10 workflow recipes can be saved in this browser.");
 const ids=new Set<string>(),names=new Set<string>();
 return envelope.recipes.map((raw,index)=>{
  if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new Error("Saved workflow recipe "+(index+1)+" is invalid.");
  const item=raw as Record<string,unknown>;
  if(Object.keys(item).some(key=>!["id","name","recipe","savedAt"].includes(key))||typeof item.id!=="string"||!/^[a-zA-Z0-9_-]{1,80}$/.test(item.id)||typeof item.name!=="string"||item.name.trim().length<1||item.name.trim().length>80||typeof item.savedAt!=="number"||!Number.isFinite(item.savedAt)||item.savedAt<0)throw new Error("Saved workflow recipe "+(index+1)+" has invalid metadata.");
  const normalizedName=item.name.trim(),nameKey=normalizedName.toLocaleLowerCase("en-US");
  if(ids.has(item.id)||names.has(nameKey))throw new Error("Saved workflow recipe IDs and names must be unique.");
  ids.add(item.id);names.add(nameKey);
  return {id:item.id,name:normalizedName,recipe:validatePipelineRecipe(item.recipe),savedAt:item.savedAt};
 });
}
export function serializeSavedPipelineRecipes(recipes:SavedPipelineRecipe[]):string{
 if(recipes.length>MAX_SAVED_PIPELINE_RECIPES)throw new Error("At most 10 workflow recipes can be saved in this browser.");
 const serialized=JSON.stringify({version:1,recipes});
 const parsed=parseSavedPipelineRecipes(serialized);
 const output=JSON.stringify({version:1,recipes:parsed});
 if(output.length>MAX_SAVED_PIPELINE_RECIPES_BYTES)throw new Error("Saved workflow recipes exceed the 320 KB limit.");
 return output;
}
const typeSet=new Set<string>(PIPELINE_INPUT_TYPES.map(x=>x.value));
const operationMap=new Map<string,typeof PIPELINE_OPERATIONS[number]>(PIPELINE_OPERATIONS.map(x=>[x.id,x] as const));
export function getPipelineOperation(id:string){const operation=operationMap.get(id);if(!operation)throw new Error("Recipe contains an unsupported operation: "+id+".");return operation;}
export function getCompatiblePipelineOperations(inputType:PipelineDataType){return PIPELINE_OPERATIONS.filter(operation=>operation.input===inputType);}
export function validatePipelineRecipe(value:unknown):PipelineRecipe{
 if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Recipe must be a JSON object.");
 const recipe=value as Record<string,unknown>;
 if(Object.keys(recipe).some(k=>!["version","inputType","steps"].includes(k)))throw new Error("Recipe contains unsupported fields; only version, inputType and steps are allowed.");
 if(recipe.version!==1)throw new Error("Only workflow recipe version 1 is supported.");
 if(typeof recipe.inputType!=="string"||!typeSet.has(recipe.inputType))throw new Error("Recipe has an unsupported input type.");
 if(!Array.isArray(recipe.steps)||recipe.steps.length>MAX_PIPELINE_STEPS)throw new Error("Recipe must contain at most 20 steps.");
 let current=recipe.inputType as PipelineDataType;const steps:PipelineStep[]=[];
 for(const raw of recipe.steps){
  if(!raw||typeof raw!=="object"||Array.isArray(raw))throw new Error("Each recipe step must be an object.");
  const item=raw as Record<string,unknown>;
  if(Object.keys(item).length!==1||typeof item.operation!=="string")throw new Error("Each recipe step must contain only an operation ID.");
  const operation=getPipelineOperation(item.operation);
  if(operation.input!==current)throw new Error("Incompatible workflow step: "+operation.label+" expects "+operation.input+" but receives "+current+".");
  steps.push({operation:operation.id});current=operation.output;
 }
 return {version:1,inputType:recipe.inputType as PipelineDataType,steps};
}
export function parsePipelineRecipe(text:string):PipelineRecipe{
 if(text.length>MAX_RECIPE_BYTES)throw new Error("Recipe files are limited to 32,000 characters.");
 let value:unknown;try{value=JSON.parse(text);}catch{throw new Error("Recipe is not valid JSON.");}
 return validatePipelineRecipe(value);
}
function applyOperation(id:PipelineOperation,input:string):string{
 const enc=(mode:"url"|"base64"|"base64url"|"base32"|"base58"|"base85"|"z85"|"hex"|"html-entities"|"unicode-escapes"|"quoted-printable",direction:"encode"|"decode")=>transformEncoding(mode,direction,input);
 switch(id){
  case "trim":return input.trim();
  case "uppercase":return input.toLocaleUpperCase("en-US");
  case "lowercase":return input.toLocaleLowerCase("en-US");
  case "url-encode":return enc("url","encode");
  case "url-decode":return enc("url","decode");
  case "base64-encode":return enc("base64","encode");
  case "base64-decode":return enc("base64","decode");
  case "base64url-encode":return enc("base64url","encode");
  case "base64url-decode":return enc("base64url","decode");
  case "base32-encode":return enc("base32","encode");
  case "base32-decode":return enc("base32","decode");
  case "base58-encode":return enc("base58","encode");
  case "base58-decode":return enc("base58","decode");
  case "ascii85-encode":return enc("base85","encode");
  case "ascii85-decode":return enc("base85","decode");
  case "z85-encode":return enc("z85","encode");
  case "z85-decode":return enc("z85","decode");
  case "hex-encode":return enc("hex","encode");
  case "hex-decode":return enc("hex","decode");
  case "text-to-raw-hex":return encodeByteRepresentation("hex",new TextEncoder().encode(input));
  case "raw-hex-to-text":return new TextDecoder("utf-8",{fatal:true}).decode(decodeByteRepresentation("hex",input));
  case "bytes-base64-encode":return encodeByteRepresentation("base64",decodeByteRepresentation("hex",input));
  case "base64-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("base64",input));
  case "bytes-base64url-encode":return encodeByteRepresentation("base64url",decodeByteRepresentation("hex",input));
  case "base64url-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("base64url",input));
  case "bytes-base32-encode":return encodeByteRepresentation("base32",decodeByteRepresentation("hex",input));
  case "base32-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("base32",input));
  case "bytes-base58-encode":return encodeByteRepresentation("base58",decodeByteRepresentation("hex",input));
  case "base58-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("base58",input));
  case "bytes-ascii85-encode":return encodeByteRepresentation("base85",decodeByteRepresentation("hex",input));
  case "ascii85-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("base85",input));
  case "bytes-z85-encode":return encodeByteRepresentation("z85",decodeByteRepresentation("hex",input));
  case "z85-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("z85",input));
  case "bytes-binary-encode":return encodeByteRepresentation("binary",decodeByteRepresentation("hex",input));
  case "binary-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("binary",input));
  case "bytes-quoted-printable-encode":return encodeByteRepresentation("quoted-printable",decodeByteRepresentation("hex",input));
  case "quoted-printable-bytes-decode":return encodeByteRepresentation("hex",decodeByteRepresentation("quoted-printable",input));
  case "unicode-escape":return enc("unicode-escapes","encode");
  case "unicode-unescape":return enc("unicode-escapes","decode");
  case "quoted-printable-encode":return enc("quoted-printable","encode");
  case "quoted-printable-decode":return enc("quoted-printable","decode");
  case "html-entities-encode":return enc("html-entities","encode");
  case "html-entities-decode":return enc("html-entities","decode");
  case "utf16le-encode":return convertCharset("encode",input,"utf-16le");
  case "utf16le-decode":return convertCharset("decode",input,"utf-16le");
  case "utf16be-encode":return convertCharset("encode",input,"utf-16be");
  case "utf16be-decode":return convertCharset("decode",input,"utf-16be");
  case "windows1252-encode":return convertCharset("encode",input,"windows-1252");
  case "windows1252-decode":return convertCharset("decode",input,"windows-1252");
  case "raw-bytes-reverse":return encodeByteRepresentation("hex",decodeByteRepresentation("hex",input).reverse());
  case "raw-bytes-not":return encodeByteRepresentation("hex",Uint8Array.from(decodeByteRepresentation("hex",input),byte=>byte^0xff));
  case "raw-bytes-rotate-left":return encodeByteRepresentation("hex",Uint8Array.from(decodeByteRepresentation("hex",input),byte=>((byte<<1)|(byte>>>7))&0xff));
  case "raw-bytes-rotate-right":return encodeByteRepresentation("hex",Uint8Array.from(decodeByteRepresentation("hex",input),byte=>((byte>>>1)|(byte<<7))&0xff));
  case "raw-bytes-crc32":{const bytes=decodeByteRepresentation("hex",input);let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return ((crc^0xffffffff)>>>0).toString(16).padStart(8,"0").toUpperCase();}
  case "raw-bytes-adler32":{const bytes=decodeByteRepresentation("hex",input);let a=1,b=0;for(const byte of bytes){a=(a+byte)%65521;b=(b+a)%65521;}return (((b<<16)|a)>>>0).toString(16).padStart(8,"0").toUpperCase();}
  case "raw-bytes-summary":{const bytes=decodeByteRepresentation("hex",input);const counts=new Uint32Array(256);let printable=0;for(const byte of bytes){counts[byte]++;if(byte===9||byte===10||byte===13||(byte>=32&&byte<=126))printable++;}let entropy=0,unique=0;for(const count of counts){if(count){unique++;const probability=count/Math.max(1,bytes.length);entropy-=probability*Math.log2(probability);}}return JSON.stringify({byteLength:bytes.length,uniqueByteValues:unique,printableAsciiRatio:bytes.length?Number((printable/bytes.length).toFixed(6)):0,shannonEntropyBitsPerByte:Number(entropy.toFixed(6)),crc32:((()=>{let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;})()).toString(16).padStart(8,"0").toUpperCase()});}
  case "json-format":return JSON.stringify(JSON.parse(input),null,2);
  case "json-minify":return JSON.stringify(JSON.parse(input));
  case "query-parse":return parseQueryString(input);
  case "query-build":return buildQueryString(input);
 }
 throw new Error("Unsupported pipeline operation.");
}
export function executePipeline(input:string,rawRecipe:PipelineRecipe):{output:string;steps:PipelineStepResult[]}{
 const recipe=validatePipelineRecipe(rawRecipe);if(input.length>MAX_PIPELINE_INPUT)throw new Error("Workflow input is limited to 200,000 characters.");
 let output=input,currentType=recipe.inputType;const results:PipelineStepResult[]=[];
 for(let index=0;index<recipe.steps.length;index++){
  const step=recipe.steps[index],contract=getPipelineOperation(step.operation);
  if(contract.input!==currentType)throw new Error("Incompatible workflow step at position "+(index+1)+".");
  try{output=applyOperation(step.operation,output);}catch(error){throw new Error("Step "+(index+1)+" ("+contract.label+") failed: "+(error instanceof Error?error.message:"invalid input"));}
  if(output.length>MAX_PIPELINE_OUTPUT)throw new Error("Workflow output exceeds the 1,000,000 character limit at step "+(index+1)+".");
  currentType=contract.output;results.push({index,operation:step.operation,outputType:currentType,outputLength:output.length,preview:output.slice(0,2000)});
 }
 return {output,steps:results};
}
export function executeBatch(input:string,recipe:PipelineRecipe):string{
 if(input.length>MAX_PIPELINE_INPUT)throw new Error("Batch input is limited to 200,000 characters total.");
 const lines=input.split(/\r?\n/);if(lines.length>MAX_BATCH_RECORDS)throw new Error("Batch mode is limited to 100 lines.");
 const results:{line:number;output?:string;error?:string}[]=[];let total=0;
 for(let index=0;index<lines.length;index++){
  try{const output=executePipeline(lines[index],recipe).output;if(total+output.length>MAX_PIPELINE_OUTPUT)throw new Error("Batch result exceeds the 1,000,000 character limit.");total+=output.length;results.push({line:index+1,output});}
  catch(error){const message=error instanceof Error?error.message:"Unable to process line";results.push({line:index+1,error:message});total+=message.length;}
  if(total>MAX_PIPELINE_OUTPUT)throw new Error("Batch result exceeds the 1,000,000 character limit.");
 }
 const output=JSON.stringify(results,null,2);if(output.length>MAX_PIPELINE_OUTPUT)throw new Error("Batch result exceeds the 1,000,000 character limit.");return output;
}

function yieldToBrowser(): Promise<void> { return new Promise(resolve => setTimeout(resolve, 0)); }
export async function executePipelineAsync(input:string,rawRecipe:PipelineRecipe,signal?:AbortSignal):Promise<{output:string;steps:PipelineStepResult[]}> {
 const recipe=validatePipelineRecipe(rawRecipe);
 if(input.length>MAX_PIPELINE_INPUT)throw new Error("Workflow input is limited to 200,000 characters.");
 let output=input,currentType=recipe.inputType;const results:PipelineStepResult[]=[];
 for(let index=0;index<recipe.steps.length;index++){
  if(signal?.aborted)throw new Error("Workflow cancelled.");
  const step=recipe.steps[index],contract=getPipelineOperation(step.operation);
  if(contract.input!==currentType)throw new Error("Incompatible workflow step at position "+(index+1)+".");
  try{output=applyOperation(step.operation,output);}catch(error){throw new Error("Step "+(index+1)+" ("+contract.label+") failed: "+(error instanceof Error?error.message:"invalid input"));}
  if(output.length>MAX_PIPELINE_OUTPUT)throw new Error("Workflow output exceeds the 1,000,000 character limit at step "+(index+1)+".");
  currentType=contract.output;results.push({index,operation:step.operation,outputType:currentType,outputLength:output.length,preview:output.slice(0,2000)});
  await yieldToBrowser();
 }
 if(signal?.aborted)throw new Error("Workflow cancelled.");
 return {output,steps:results};
}
export async function executeBatchAsync(input:string,recipe:PipelineRecipe,signal?:AbortSignal):Promise<string> {
 if(input.length>MAX_PIPELINE_INPUT)throw new Error("Batch input is limited to 200,000 characters total.");
 const lines=input.split(/\r?\n/);if(lines.length>MAX_BATCH_RECORDS)throw new Error("Batch mode is limited to 100 lines.");
 const results:{line:number;output?:string;error?:string}[]=[];let total=0;
 for(let index=0;index<lines.length;index++){
  if(signal?.aborted)throw new Error("Workflow cancelled.");
  try{const output=(await executePipelineAsync(lines[index],recipe,signal)).output;if(total+output.length>MAX_PIPELINE_OUTPUT)throw new Error("Batch result exceeds the 1,000,000 character limit.");total+=output.length;results.push({line:index+1,output});}
  catch(error){if(signal?.aborted)throw new Error("Workflow cancelled.");const message=error instanceof Error?error.message:"Unable to process line";results.push({line:index+1,error:message});total+=message.length;}
  if(total>MAX_PIPELINE_OUTPUT)throw new Error("Batch result exceeds the 1,000,000 character limit.");
  await yieldToBrowser();
 }
 const output=JSON.stringify(results,null,2);if(output.length>MAX_PIPELINE_OUTPUT)throw new Error("Batch result exceeds the 1,000,000 character limit.");return output;
}
