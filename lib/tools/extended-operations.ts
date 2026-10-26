export const MAX_INSPECT_BYTES = 2_000_000;
export type ExtendedOperation =
  | "query-parse" | "query-build" | "key-value" | "number-base"
  | "hexdump" | "strings" | "byte-stats" | "network" | "cidr"
  | "mac" | "headers" | "cookies" | "statistics" | "arithmetic"
  | "compression";
export type ExtendedOptions = { radix?: number; width?: number; minLength?: number; format?: string; signed?: boolean; bits?: number; endian?: "big" | "little"; a?: string; b?: string; modulus?: string; action?: "compress" | "decompress" };
const guardText=(s:string)=>{if(s.length>200_000)throw new Error("Input exceeds the 200,000 character safety limit.");};
const guardBytes=(b:Uint8Array)=>{if(b.byteLength>MAX_INSPECT_BYTES)throw new Error("Binary inspection is limited to 2,000,000 bytes.");};
export function parseQueryString(input:string):string {
  guardText(input); const source=input.startsWith("?")?input.slice(1):input; const result:Record<string,string|string[]>={};
  for(const part of source.split("&")) { if(!part)continue; const i=part.indexOf("="); const rawKey=i<0?part:part.slice(0,i),rawValue=i<0?"":part.slice(i+1);
    let key:string,value:string; try { key=decodeURIComponent(rawKey.replace(/\+/g," ")); value=decodeURIComponent(rawValue.replace(/\+/g," ")); } catch { throw new Error("Query string contains an invalid percent escape."); }
    if(Object.hasOwn(result,key)){const previous=result[key];result[key]=Array.isArray(previous)?[...previous,value]:[previous,value];}else result[key]=value;
  }
  return JSON.stringify(result,null,2);
}
export function buildQueryString(input:string):string {
  guardText(input); let value:unknown;try{value=JSON.parse(input);}catch{throw new Error("Provide a valid JSON object to build a query string.");}
  if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Query parameters must be a JSON object.");
  const pairs:string[]=[];for(const [key,raw] of Object.entries(value as Record<string,unknown>)){const vals=Array.isArray(raw)?raw:[raw];for(const item of vals){if(item!==null&&typeof item==="object")throw new Error("Query values must be strings, numbers, booleans, null, or arrays of these values.");if(item===null)continue;pairs.push(encodeURIComponent(key)+"="+encodeURIComponent(String(item)));}}
  return pairs.join("&");
}
export function parseKeyValue(input:string):string {
  guardText(input);const result:Record<string,string|string[]>={};
  for(const [index,line] of input.split(/\r?\n/).entries()){if(!line.trim()||/^\s*[#;]/.test(line))continue;const i=line.indexOf("=");if(i<0)throw new Error("Line "+(index+1)+" must contain key=value.");const key=line.slice(0,i).trim(),value=line.slice(i+1).trim();if(!key)throw new Error("Line "+(index+1)+" has an empty key.");if(Object.hasOwn(result,key)){const prev=result[key];result[key]=Array.isArray(prev)?[...prev,value]:[prev,value];}else result[key]=value;}
  return JSON.stringify(result,null,2);
}
export function convertNumberBase(input:string,radix=10):string {
  const s=input.trim().replace(/_/g,"");if(!s)throw new Error("Enter an integer.");if(!Number.isInteger(radix)||radix<2||radix>36)throw new Error("Base must be between 2 and 36.");
  const sign=s.startsWith("-")?"-":"";const raw=sign?s.slice(1):s;let value:bigint;
  try{if(/^0[xob]/i.test(raw))value=BigInt(raw)*(sign?-1n:1n);else{const chars="0123456789abcdefghijklmnopqrstuvwxyz";const r=BigInt(radix);let n=0n;for(const c of raw.toLowerCase()){const digit=chars.indexOf(c);if(digit<0||digit>=radix)throw new Error("Digit is not valid for base "+radix+".");n=n*r+BigInt(digit);}value=n*(sign?-1n:1n);}}
  catch(e){if(e instanceof Error&&e.message.startsWith("Digit"))throw e;throw new Error("Enter a valid integer (decimal or prefixed 0x/0o/0b).");}
  return JSON.stringify({decimal:value.toString(10),binary:(value<0n?"-":"")+(value<0n?-value:value).toString(2),octal:(value<0n?"-":"")+(value<0n?-value:value).toString(8),hexadecimal:(value<0n?"-":"")+(value<0n?-value:value).toString(16).toUpperCase(),base:radix,representation:value.toString(radix)},null,2);
}
const ascii=(b:number)=>b>=32&&b<=126?String.fromCharCode(b):".";
export function hexDump(bytes:Uint8Array,width=16):string {
  guardBytes(bytes);if(!Number.isInteger(width)||width<8||width>32)throw new Error("Hexdump width must be between 8 and 32 bytes.");
  const lines:string[]=[];for(let offset=0;offset<bytes.length;offset+=width){const row=bytes.subarray(offset,Math.min(offset+width,bytes.length));const hex=Array.from(row,b=>b.toString(16).padStart(2,"0")).join(" ").padEnd(width*3-1," ");lines.push(offset.toString(16).padStart(8,"0")+"  "+hex+"  |"+Array.from(row,ascii).join("")+"|");}
  return lines.join("\n")||"(empty input)";
}
export function extractPrintableStrings(bytes:Uint8Array,minLength=4):string[] {
  guardBytes(bytes);if(!Number.isInteger(minLength)||minLength<2||minLength>128)throw new Error("Minimum string length must be between 2 and 128.");
  const out:string[]=[];let current="";for(const b of bytes){if(b>=32&&b<=126)current+=String.fromCharCode(b);else{if(current.length>=minLength)out.push(current);current="";}}if(current.length>=minLength)out.push(current);return out.slice(0,10_000);
}
export function byteStatistics(bytes:Uint8Array):string {
  guardBytes(bytes);const counts=new Uint32Array(256);for(const b of bytes)counts[b]++;
  const nonzero=Array.from(counts).filter(n=>n>0).length;let entropy=0;if(bytes.length)for(const count of counts){if(count){const p=count/bytes.length;entropy-=p*Math.log2(p);}}
  const top=Array.from(counts,(count,value)=>({byte:value,count,percent:bytes.length?Number((count*100/bytes.length).toFixed(3)):0})).filter(x=>x.count).sort((a,b)=>b.count-a.count||a.byte-b.byte).slice(0,16);
  return JSON.stringify({bytes:bytes.length,uniqueByteValues:nonzero,entropyBitsPerByte:Number(entropy.toFixed(6)),entropyInterpretation:"A statistical indicator only; not proof of encryption, malware, or file safety.",topByteValues:top},null,2);
}
function ipv4Number(s:string):bigint {
 const parts=s.split(".");if(parts.length!==4)throw new Error("IPv4 must contain four decimal octets.");
 let n=0n;for(const p of parts){if(!/^\d{1,3}$/.test(p)||Number(p)>255)throw new Error("IPv4 octets must be between 0 and 255.");n=(n<<8n)|BigInt(Number(p));}return n;
}
function ipv4String(n:bigint):string{return [24n,16n,8n,0n].map(shift=>Number((n>>shift)&255n)).join(".");}
function ipv6Groups(source:string):number[] {
 let s=source.toLowerCase();if(s.includes(".")){const i=s.lastIndexOf(":");if(i<0)throw new Error("Invalid IPv6 address.");const v=ipv4Number(s.slice(i+1));s=s.slice(0,i+1)+((v>>16n)&65535n).toString(16)+":"+ (v&65535n).toString(16);}
 if((s.match(/::/g)||[]).length>1)throw new Error("Invalid IPv6 compression.");const split=s.split("::");const left=split[0]?split[0].split(":"):[],right=split.length===2&&split[1]?split[1].split(":"):[];const missing=8-left.length-right.length;if((split.length===1&&missing!==0)||(split.length===2&&missing<1))throw new Error("IPv6 must contain eight groups unless :: compresses at least one group.");
 const groups=[...left,...Array(missing).fill("0"),...right];if(groups.length!==8||groups.some(g=>! /^[0-9a-f]{1,4}$/.test(g)))throw new Error("Invalid IPv6 group.");return groups.map(g=>parseInt(g,16));
}
function ipv6Number(s:string):bigint{return ipv6Groups(s).reduce((n,g)=>(n<<16n)|BigInt(g),0n);}
function ipv6String(n:bigint):string {
 const groups:number[]=[];for(let i=7;i>=0;i--)groups.unshift(Number((n>>BigInt(i*16))&65535n));
 let bestStart=-1,bestLen=1;for(let i=0;i<8;){if(groups[i]!==0){i++;continue;}let j=i;while(j<8&&groups[j]===0)j++;if(j-i>bestLen){bestStart=i;bestLen=j-i;}i=j;}
 const raw=groups.map(g=>g.toString(16));if(bestStart<0)return raw.join(":");const left=raw.slice(0,bestStart).join(":"),right=raw.slice(bestStart+bestLen).join(":");return left+"::"+right;
}
export function inspectNetwork(input:string,mode:"ip"|"cidr"="ip"):string {
 const s=input.trim();if(!s)throw new Error("Enter an IP address or CIDR range.");
 if(mode==="ip"){if(s.includes(":"))return JSON.stringify({type:"IPv6",normalized:ipv6String(ipv6Number(s)),valid:true},null,2);const n=ipv4Number(s);return JSON.stringify({type:"IPv4",normalized:ipv4String(n),integer:n.toString(),valid:true},null,2);}
 const [address,prefixText,...rest]=s.split("/");if(rest.length||prefixText===undefined)throw new Error("CIDR must use address/prefix notation, for example 192.168.1.12/24.");
 const isV6=address.includes(":");const bits=isV6?128:32;const prefix=Number(prefixText);if(!Number.isInteger(prefix)||prefix<0||prefix>bits)throw new Error("CIDR prefix must be between 0 and "+bits+".");
 const host=isV6?ipv6Number(address):ipv4Number(address);const mask=prefix===0?0n:((1n<<BigInt(prefix))-1n)<<BigInt(bits-prefix);const network=host&mask;const last=network|((1n<<BigInt(bits-prefix))-1n);
 return JSON.stringify({type:isV6?"IPv6":"IPv4",prefix,network:isV6?ipv6String(network):ipv4String(network),lastAddress:isV6?ipv6String(last):ipv4String(last),addressCount:(last-network+1n).toString(),hostAddress:address},null,2);
}
export function normalizeMac(input:string):string {
 const hex=input.replace(/[^0-9a-f]/gi,"");if(!/^[0-9a-f]{12}$/i.test(hex))throw new Error("Enter a 48-bit MAC address using 12 hexadecimal digits.");const upper=hex.toUpperCase();return upper.match(/.{2}/g)!.join(":");
}
export function parseHttpHeaders(input:string):string {
 guardText(input);const headers:{name:string;value:string}[]=[];for(const [i,line] of input.replace(/\r\n/g,"\n").split("\n").entries()){if(!line.trim())continue;if(/^\s/.test(line))throw new Error("Obsolete folded header at line "+(i+1)+" is not supported.");const p=line.indexOf(":");if(p<1)throw new Error("Header line "+(i+1)+" must use Name: value.");const name=line.slice(0,p).trim(),value=line.slice(p+1).trim();if(!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name))throw new Error("Invalid header name at line "+(i+1)+".");headers.push({name,value});}
 const grouped:Record<string,string[]>={};for(const h of headers){const k=h.name.toLowerCase();(grouped[k]??=[]).push(h.value);}
 return JSON.stringify({count:headers.length,headers,duplicates:Object.fromEntries(Object.entries(grouped).filter(([,v])=>v.length>1)),securityNote:"Parses supplied text only; no network request is made."},null,2);
}
export function parseCookies(input:string):string {
 guardText(input);const result:Record<string,string|string[]>={};for(const part of input.split(";")){const p=part.trim();if(!p)continue;const i=p.indexOf("=");if(i<1)throw new Error("Cookie entries must use name=value.");const key=p.slice(0,i).trim(),value=p.slice(i+1).trim();if(Object.hasOwn(result,key)){const prev=result[key];result[key]=Array.isArray(prev)?[...prev,value]:[prev,value];}else result[key]=value;}
 return JSON.stringify(result,null,2);
}
export function numericStatistics(input:string):string {
 guardText(input);const values=input.trim().split(/[\s,;]+/).filter(Boolean).map(Number);if(!values.length||values.some(n=>!Number.isFinite(n)))throw new Error("Enter a non-empty list of finite numbers separated by spaces, commas, or semicolons.");
 const sorted=[...values].sort((a,b)=>a-b),sum=values.reduce((a,b)=>a+b,0),mean=sum/values.length,median=sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;const variance=values.reduce((s,n)=>s+(n-mean)**2,0)/values.length;
 return JSON.stringify({count:values.length,min:sorted[0],max:sorted[sorted.length-1],sum,mean,median,populationVariance:variance,populationStandardDeviation:Math.sqrt(variance),sampleVariance:values.length>1?values.reduce((s,n)=>s+(n-mean)**2,0)/(values.length-1):null},null,2);
}
export function arithmetic(input:string,options:ExtendedOptions={}):string {
 const a=Number(options.a),b=Number(options.b);if(!options.a?.trim()||!options.b?.trim()||!Number.isFinite(a)||!Number.isFinite(b))throw new Error("Enter two finite numbers in the A and B fields.");
 if(input==="modular"){let m:bigint,x:bigint,y:bigint;try{m=BigInt(options.modulus??"");x=BigInt(options.a??"");y=BigInt(options.b??"");}catch{throw new Error("Modular arithmetic requires integer operands and a positive integer modulus.");}if(m<=0n)throw new Error("Modulus must be a positive integer.");return JSON.stringify({sum:((x+y)%m+m)%m,difference:((x-y)%m+m)%m,product:((x*y)%m+m)%m,modulus:m.toString()},null,2);}
 if(input==="divide"&&b===0)throw new Error("Cannot divide by zero.");const result=input==="add"?a+b:input==="subtract"?a-b:input==="multiply"?a*b:a/b;if(!Number.isFinite(result))throw new Error("Result is outside the finite numeric range.");return String(result);
}
export async function compressBytes(bytes:Uint8Array,format:"gzip"|"deflate",action:"compress"|"decompress"="compress"):Promise<Uint8Array> {
 guardBytes(bytes);const Stream=action==="compress"?globalThis.CompressionStream:globalThis.DecompressionStream;if(!Stream)throw new Error("Browser compression streams are unavailable in this environment.");
 const stream=new Blob([bytes.slice().buffer as ArrayBuffer]).stream().pipeThrough(new Stream(format));const output=new Uint8Array(await new Response(stream).arrayBuffer());if(output.byteLength>MAX_INSPECT_BYTES*4)throw new Error("Compressed/decompressed output exceeds the 8,000,000 byte safety limit.");return output;
}
export async function runExtendedOperation(operation:ExtendedOperation,input:string,bytes:Uint8Array,options:ExtendedOptions={}):Promise<string> {
 guardText(input);
 switch(operation){
 case "query-parse":return parseQueryString(input);
 case "query-build":return buildQueryString(input);
 case "key-value":return parseKeyValue(input);
 case "number-base":return convertNumberBase(input,options.radix??10);
 case "hexdump":return hexDump(bytes,options.width??16);
 case "strings":return JSON.stringify(extractPrintableStrings(bytes,options.minLength??4),null,2);
 case "byte-stats":return byteStatistics(bytes);
 case "network":return inspectNetwork(input,"ip");
 case "cidr":return inspectNetwork(input,"cidr");
 case "mac":return normalizeMac(input);
 case "headers":return parseHttpHeaders(input);
 case "cookies":return parseCookies(input);
 case "statistics":return numericStatistics(input);
 case "arithmetic":return arithmetic(input,options);
 case "compression":{const action=options.action??"compress";const format=options.format==="deflate"?"deflate":"gzip";const out=await compressBytes(bytes,format,action);let textPreview:string|null=null;try{textPreview=new TextDecoder("utf-8",{fatal:true}).decode(out);}catch{}return JSON.stringify({format,action,inputBytes:bytes.length,outputBytes:out.length,ratio:bytes.length?Number((out.length/bytes.length).toFixed(4)):null,base64:typeof btoa==="function"?btoa(Array.from(out,b=>String.fromCharCode(b)).join("")):"",textPreview:textPreview?.slice(0,20000)??null,hexPreview:Array.from(out.slice(0,128),b=>b.toString(16).padStart(2,"0")).join(" "),note:"Use the full base64 field as input to decompress or download the result as bytes."},null,2);}
 }
}
