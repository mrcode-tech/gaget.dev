import { transformEncoding, convertCharset } from "./encoding-operations.ts";
import { parseQueryString, buildQueryString } from "./extended-operations.ts";
export type PipelineDataType = "text" | "url" | "base64" | "base64url" | "base32" | "base58" | "ascii85" | "z85" | "hex" | "unicode" | "quoted-printable" | "entities" | "json" | "query";
export const PIPELINE_INPUT_TYPES: {value:PipelineDataType;label:string}[] = [
 {value:"text",label:"Plain text"},{value:"url",label:"URL-component encoded"},{value:"base64",label:"Base64 encoded"},{value:"base64url",label:"Base64url encoded"},{value:"base32",label:"Base32 encoded"},{value:"base58",label:"Bitcoin Base58 encoded"},{value:"ascii85",label:"Adobe ASCII85 encoded"},{value:"z85",label:"ZeroMQ Z85 encoded"},{value:"hex",label:"Hexadecimal bytes"},{value:"unicode",label:"Unicode escapes"},{value:"quoted-printable",label:"Quoted-printable"},{value:"entities",label:"HTML entities"},{value:"json",label:"JSON text"},{value:"query",label:"Query string"}
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
