export const MAX_INSPECT_BYTES = 2_000_000;
export type ExtendedOperation =
  | "query-parse" | "query-build" | "key-value" | "key-value-build" | "number-base" | "numeric-view" | "float-view"
  | "hexdump" | "strings" | "byte-stats" | "network" | "cidr"
  | "mac" | "headers" | "cookies" | "network-extract" | "statistics" | "arithmetic" | "compression-detect"
  | "compression" | "byte-compare" | "dns-records" | "http-message" | "file-signatures";
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
export function buildKeyValue(input:string):string {
  guardText(input); let value: unknown;
  try { value = JSON.parse(input); } catch { throw new Error("Provide a valid JSON object to build key=value text."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Key-value input must be a JSON object.");
  const lines: string[] = [];
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!key.trim() || /[=\r\n]/.test(key)) throw new Error("Keys must be non-empty and cannot contain equals signs or line breaks.");
    for (const item of (Array.isArray(raw) ? raw : [raw])) {
      if (item !== null && typeof item === "object") throw new Error("Values must be strings, numbers, booleans, null, or arrays of these values.");
      const text = item === null ? "" : String(item);
      if (/[\r\n]/.test(text)) throw new Error("Multiline values are not supported by this key=value format.");
      lines.push(key + "=" + text);
    }
  }
  return lines.join("\n");
}
export function extractNetworkCandidates(input:string):string {
  guardText(input);
  const collect=(pattern:RegExp)=>Array.from(input.matchAll(pattern),m=>m[0].replace(/[),.;]+$/g,""));
  const unique=(items:string[])=>Array.from(new Set(items));
  const urls=unique(collect(/https?:\/\/[^\s<>"']+/gi));
  const emails=unique(collect(/[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/gi).map(s=>s.replace(/\s/g,"")));
  const ipv4=unique(collect(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g));
  const domains=unique(collect(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63})\b/gi));
  return JSON.stringify({urls,emails,ipv4Candidates:ipv4,domainCandidates:domains,validation:"Candidates are extracted by pattern only; they are not validated, resolved, or contacted."},null,2);
}
export function numericView(input:string,bits=32,signed=false,endian:"big"|"little"="big"):string {
  if (![8,16,32,64].includes(bits)) throw new Error("Integer width must be 8, 16, 32, or 64 bits.");
  const text=input.trim();
  if (!/^[+-]?(?:\d+|0x[\da-f]+|0b[01]+|0o[0-7]+)$/i.test(text)) throw new Error("Enter a decimal, hexadecimal (0x), binary (0b), or octal (0o) integer.");
  const negative=text.startsWith("-"),raw=text.replace(/^[+-]/,"");
  let value:bigint; try { value=BigInt(raw)*(negative?-BigInt(1):BigInt(1)); } catch { throw new Error("Enter a valid integer."); }
  const width=BigInt(bits),modulus=BigInt(1)<<width;
  const min=signed?-(BigInt(1)<<(width-BigInt(1))):BigInt(0);
  const max=signed?(BigInt(1)<<(width-BigInt(1)))-BigInt(1):modulus-BigInt(1);
  if(value<min||value>max) throw new Error("Value is outside the selected "+(signed?"signed":"unsigned")+" "+bits+"-bit range.");
  const encoded=value<0?modulus+value:value,bytes=new Uint8Array(bits/8);
  for(let i=0;i<bytes.length;i++){const shift=BigInt((endian==="little"?i:bytes.length-1-i)*8);bytes[i]=Number((encoded>>shift)&BigInt(255));}
  return JSON.stringify({input:text,bits,signed,endian,value:value.toString(),unsignedValue:encoded.toString(),hexadecimal:"0x"+encoded.toString(16).padStart(bits/4,"0").toUpperCase(),bytesHex:Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join(" "),byteOrder:"Bytes are shown in the selected endianness."},null,2);
}
export function floatView(input:string,bits=32,endian:"big"|"little"="big"):string {
  if(bits!==32&&bits!==64)throw new Error("Floating-point width must be 32 or 64 bits.");
  const trimmed=input.trim(),value=Number(trimmed);if(trimmed===""||(Number.isNaN(value)&&trimmed.toLowerCase()!=="nan"))throw new Error("Enter a valid floating-point number (including Infinity or NaN if needed).");
  const bytes=new Uint8Array(bits/8),view=new DataView(bytes.buffer);
  if(bits===32)view.setFloat32(0,value,endian==="little");else view.setFloat64(0,value,endian==="little");
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
  return JSON.stringify({input:trimmed,bits,endian,value:Number.isNaN(value)?"NaN":value.toString(),hexadecimal:"0x"+hex,bytesHex:Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join(" "),note:"IEEE-754 representation; Float32 may round the input value."},null,2);
}
export function detectCompression(bytes:Uint8Array):string {
  guardBytes(bytes);const gzip=bytes.length>=2&&bytes[0]===0x1f&&bytes[1]===0x8b,cmf=bytes[0]??0,flg=bytes[1]??0;
  const zlib=bytes.length>=2&&(cmf&15)===8&&(cmf>>>4)<=7&&((cmf<<8)|flg)%31===0;
  return JSON.stringify({bytes:bytes.length,detected:gzip?"gzip":zlib?"zlib-wrapped DEFLATE":"unknown",confidence:gzip||zlib?"wrapper signature matches":"no supported wrapper signature; raw DEFLATE and other formats cannot be distinguished from arbitrary bytes by this check",magicBytes:Array.from(bytes.slice(0,16),b=>b.toString(16).padStart(2,"0")).join(" ")},null,2);
}
export function convertNumberBase(input:string,radix=10):string {
  const s=input.trim().replace(/_/g,"");if(!s)throw new Error("Enter an integer.");if(!Number.isInteger(radix)||radix<2||radix>36)throw new Error("Base must be between 2 and 36.");
  const sign=s.startsWith("-")?"-":"";const raw=sign?s.slice(1):s;let value:bigint;
  try{if(/^0[xob]/i.test(raw))value=BigInt(raw)*(sign?-BigInt(1):BigInt(1));else{const chars="0123456789abcdefghijklmnopqrstuvwxyz";const r=BigInt(radix);let n=BigInt(0);for(const c of raw.toLowerCase()){const digit=chars.indexOf(c);if(digit<0||digit>=radix)throw new Error("Digit is not valid for base "+radix+".");n=n*r+BigInt(digit);}value=n*(sign?-BigInt(1):BigInt(1));}}
  catch(e){if(e instanceof Error&&e.message.startsWith("Digit"))throw e;throw new Error("Enter a valid integer (decimal or prefixed 0x/0o/0b).");}
  return JSON.stringify({decimal:value.toString(10),binary:(value<BigInt(0)?"-":"")+(value<BigInt(0)?-value:value).toString(2),octal:(value<BigInt(0)?"-":"")+(value<BigInt(0)?-value:value).toString(8),hexadecimal:(value<BigInt(0)?"-":"")+(value<BigInt(0)?-value:value).toString(16).toUpperCase(),base:radix,representation:value.toString(radix)},null,2);
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
 let n=BigInt(0);for(const p of parts){if(!/^\d{1,3}$/.test(p)||Number(p)>255)throw new Error("IPv4 octets must be between 0 and 255.");n=(n<<BigInt(8))|BigInt(Number(p));}return n;
}
function ipv4String(n:bigint):string{return [BigInt(24),BigInt(16),BigInt(8),BigInt(0)].map(shift=>Number((n>>shift)&BigInt(255))).join(".");}
function ipv6Groups(source:string):number[] {
 let s=source.toLowerCase();if(s.includes(".")){const i=s.lastIndexOf(":");if(i<0)throw new Error("Invalid IPv6 address.");const v=ipv4Number(s.slice(i+1));s=s.slice(0,i+1)+((v>>BigInt(16))&BigInt(65535)).toString(16)+":"+ (v&BigInt(65535)).toString(16);}
 if((s.match(/::/g)||[]).length>1)throw new Error("Invalid IPv6 compression.");const split=s.split("::");const left=split[0]?split[0].split(":"):[],right=split.length===2&&split[1]?split[1].split(":"):[];const missing=8-left.length-right.length;if((split.length===1&&missing!==0)||(split.length===2&&missing<1))throw new Error("IPv6 must contain eight groups unless :: compresses at least one group.");
 const groups=[...left,...Array(missing).fill("0"),...right];if(groups.length!==8||groups.some(g=>! /^[0-9a-f]{1,4}$/.test(g)))throw new Error("Invalid IPv6 group.");return groups.map(g=>parseInt(g,16));
}
function ipv6Number(s:string):bigint{return ipv6Groups(s).reduce((n,g)=>(n<<BigInt(16))|BigInt(g),BigInt(0));}
function ipv6String(n:bigint):string {
 const groups:number[]=[];for(let i=7;i>=0;i--)groups.push(Number((n>>BigInt(i*16))&BigInt(65535)));
 let bestStart=-1,bestLen=1;for(let i=0;i<8;){if(groups[i]!==0){i++;continue;}let j=i;while(j<8&&groups[j]===0)j++;if(j-i>bestLen){bestStart=i;bestLen=j-i;}i=j;}
 const raw=groups.map(g=>g.toString(16));if(bestStart<0)return raw.join(":");const left=raw.slice(0,bestStart).join(":"),right=raw.slice(bestStart+bestLen).join(":");return left+"::"+right;
}
export function inspectNetwork(input:string,mode:"ip"|"cidr"="ip"):string {
 const s=input.trim();if(!s)throw new Error("Enter an IP address or CIDR range.");
 if(mode==="ip"){if(s.includes(":"))return JSON.stringify({type:"IPv6",normalized:ipv6String(ipv6Number(s)),valid:true},null,2);const n=ipv4Number(s);return JSON.stringify({type:"IPv4",normalized:ipv4String(n),integer:n.toString(),valid:true},null,2);}
 const [address,prefixText,...rest]=s.split("/");if(rest.length||prefixText===undefined)throw new Error("CIDR must use address/prefix notation, for example 192.168.1.12/24.");
 const isV6=address.includes(":");const bits=isV6?128:32;const prefix=Number(prefixText);if(!Number.isInteger(prefix)||prefix<0||prefix>bits)throw new Error("CIDR prefix must be between 0 and "+bits+".");
 const host=isV6?ipv6Number(address):ipv4Number(address);const mask=prefix===0?BigInt(0):((BigInt(1)<<BigInt(prefix))-BigInt(1))<<BigInt(bits-prefix);const network=host&mask;const last=network|((BigInt(1)<<BigInt(bits-prefix))-BigInt(1));
 return JSON.stringify({type:isV6?"IPv6":"IPv4",prefix,network:isV6?ipv6String(network):ipv4String(network),lastAddress:isV6?ipv6String(last):ipv4String(last),addressCount:(last-network+BigInt(1)).toString(),hostAddress:address},null,2);
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
 if(input==="modular"){let m:bigint,x:bigint,y:bigint;try{m=BigInt(options.modulus??"");x=BigInt(options.a??"");y=BigInt(options.b??"");}catch{throw new Error("Modular arithmetic requires integer operands and a positive integer modulus.");}if(m<=BigInt(0))throw new Error("Modulus must be a positive integer.");return JSON.stringify({sum:(((x+y)%m+m)%m).toString(),difference:(((x-y)%m+m)%m).toString(),product:(((x*y)%m+m)%m).toString(),modulus:m.toString()},null,2);}
 if(input==="divide"&&b===0)throw new Error("Cannot divide by zero.");const result=input==="add"?a+b:input==="subtract"?a-b:input==="multiply"?a*b:a/b;if(!Number.isFinite(result))throw new Error("Result is outside the finite numeric range.");return String(result);
}
export async function compressBytes(bytes:Uint8Array,format:"gzip"|"deflate",action:"compress"|"decompress"="compress"):Promise<Uint8Array> {
 guardBytes(bytes);const Stream=action==="compress"?globalThis.CompressionStream:globalThis.DecompressionStream;if(!Stream)throw new Error("Browser compression streams are unavailable in this environment.");
 const stream=new Blob([bytes.slice().buffer as ArrayBuffer]).stream().pipeThrough(new Stream(format));const output=new Uint8Array(await new Response(stream).arrayBuffer());if(output.byteLength>MAX_INSPECT_BYTES*4)throw new Error("Compressed/decompressed output exceeds the 8,000,000 byte safety limit.");return output;
}

export function compareByteArrays(left:Uint8Array,right:Uint8Array):string {
 guardBytes(left);guardBytes(right);
 const length=Math.max(left.length,right.length),preview:{offset:number;left:string|null;right:string|null}[]=[];
 let firstDifference:number|null=null,differingPositions=0;
 for(let i=0;i<length;i++){const a=left[i],b=right[i];if(a===b)continue;if(firstDifference===null)firstDifference=i;differingPositions++;if(preview.length<100)preview.push({offset:i,left:a===undefined?null:a.toString(16).padStart(2,"0"),right:b===undefined?null:b.toString(16).padStart(2,"0")});}
 return JSON.stringify({identical:left.length===right.length&&differingPositions===0,leftBytes:left.length,rightBytes:right.length,lengthDifference:right.length-left.length,commonPrefixBytes:firstDifference===null?Math.min(left.length,right.length):firstDifference,firstDifferenceOffset:firstDifference,differingPositions,preview,truncated:differingPositions>preview.length,offsetsAreZeroBased:true},null,2);
}
const DNS_TYPES=new Set(["A","AAAA","CNAME","MX","TXT","NS","SOA","SRV","PTR","CAA","HTTPS","SVCB","TLSA","DS","DNSKEY"]);
export function parseDnsRecords(input:string):string {
 guardText(input);const records:{owner:string;ttl:number|null;class:string;type:string;value:string;line:number}[]=[];let skippedLines=0;
 for(const [index,raw] of input.replace(/\r\n/g,"\n").split("\n").entries()){
  const line=raw.trim();if(!line||line.startsWith(";")||line.startsWith("#")||line.startsWith("$"))continue;
  const tokens=line.match(/"(?:\\.|[^"\\])*"|\S+/g)??[];
  const typeIndex=tokens.findIndex((token,i)=>i>0&&DNS_TYPES.has(token.toUpperCase()));
  if(typeIndex<0){skippedLines++;continue;}
  const owner=tokens[0],before=tokens.slice(1,typeIndex),ttlText=before.find(token=>/^\d+$/.test(token)),recordClass=before.find(token=>/^(IN|CH|HS)$/i.test(token))?.toUpperCase()??"IN",value=tokens.slice(typeIndex+1).join(" ");
  if(!value)throw new Error("DNS record on line "+(index+1)+" is missing its value.");
  records.push({owner,ttl:ttlText===undefined?null:Number(ttlText),class:recordClass,type:tokens[typeIndex].toUpperCase(),value,line:index+1});
 }
 if(!records.length)throw new Error("No supported DNS records were found. Paste zone-file or dig-style record lines.");
 return JSON.stringify({count:records.length,records,skippedNonRecordLines:skippedLines,networkRequestsMade:false,note:"Offline text parsing only; records are not resolved, verified, or queried."},null,2);
}
const SENSITIVE_HTTP_HEADERS=/^(authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|x-access-token)$/i;
export function parseHttpMessage(input:string):string {
 guardText(input);const normalized=input.replace(/\r\n/g,"\n"),boundary=normalized.indexOf("\n\n"),head=boundary<0?normalized:normalized.slice(0,boundary),body=boundary<0?"":normalized.slice(boundary+2),lines=head.split("\n");
 const startLine=(lines.shift()??"").trim();if(!startLine)throw new Error("Enter an HTTP request or response start line.");
 const response=startLine.match(/^HTTP\/(\d(?:\.\d)?)\s+(\d{3})(?:\s+(.*))?$/i),request=startLine.match(/^([!#$%&'*+.^_|~0-9A-Za-z-]+)\s+(\S+)\s+HTTP\/(\d(?:\.\d)?)$/);
 if(!response&&!request)throw new Error("Start line must be an HTTP request line or HTTP status line.");
 const headers:{name:string;value:string;redacted:boolean}[]=[];
 for(const [index,line] of lines.entries()){
  if(!line.trim())continue;if(/^\s/.test(line))throw new Error("Obsolete folded header at line "+(index+2)+" is not supported.");
  const colon=line.indexOf(":");if(colon<1)throw new Error("Header line "+(index+2)+" must use Name: value.");
  const name=line.slice(0,colon).trim(),rawValue=line.slice(colon+1).trim();
  if(!/^[!#$%&'*+.^_|~0-9A-Za-z-]+$/.test(name))throw new Error("Invalid HTTP header name at line "+(index+2)+".");
  const redacted=SENSITIVE_HTTP_HEADERS.test(name);headers.push({name,value:redacted?"[REDACTED]":rawValue,redacted});
 }
 const grouped:Record<string,string[]>={};for(const header of headers)(grouped[header.name.toLowerCase()]??=[]).push(header.value);
 const contentType=headers.find(h=>h.name.toLowerCase()==="content-type")?.value??null;
 return JSON.stringify({messageType:response?"response":"request",startLine,...(response?{httpVersion:response[1],statusCode:Number(response[2]),reason:response[3]??""}:{method:request![1],target:request![2],httpVersion:request![3]}),headers,headerCount:headers.length,duplicateHeaders:Object.fromEntries(Object.entries(grouped).filter(([,values])=>values.length>1)),body:{utf8Bytes:new TextEncoder().encode(body).length,lineCount:body?body.split("\n").length:0,contentType,contentIncluded:false},networkRequestsMade:false,note:"Supplied HTTP text only. Sensitive header values are redacted and the body is deliberately omitted from the parsed result."},null,2);
}


export function inspectFileSignatures(bytes:Uint8Array):string {
 guardBytes(bytes);
 const ascii=(offset:number,length:number)=>Array.from(bytes.slice(offset,offset+length),b=>String.fromCharCode(b)).join("");
 const hex=(offset:number,length:number)=>Array.from(bytes.slice(offset,offset+length),b=>b.toString(16).padStart(2,"0")).join(" ");
 const matches:{format:string;mime:string;extension:string;offset:number;evidence:string}[]=[];
 const add=(format:string,mime:string,extension:string,offset:number,evidence:string)=>matches.push({format,mime,extension,offset,evidence});
 const starts=(values:number[])=>values.every((v,i)=>bytes[i]===v);
 if(starts([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))add("PNG image","image/png","png",0,hex(0,8));
 if(starts([0xff,0xd8,0xff]))add("JPEG image","image/jpeg","jpg",0,hex(0,3));
 if(ascii(0,6)==="GIF87a"||ascii(0,6)==="GIF89a")add("GIF image","image/gif","gif",0,ascii(0,6));
 if(ascii(0,2)==="BM")add("BMP image","image/bmp","bmp",0,ascii(0,2));
 if(ascii(0,4)==="RIFF"&&ascii(8,4)==="WEBP")add("WebP image","image/webp","webp",0,ascii(0,4)+"…"+ascii(8,4));
 if(ascii(0,4)==="RIFF"&&ascii(8,4)==="WAVE")add("WAVE audio","audio/wav","wav",0,ascii(0,4)+"…"+ascii(8,4));
 if(ascii(0,5)==="%PDF-")add("PDF document","application/pdf","pdf",0,ascii(0,5));
 if(starts([0x50,0x4b,0x03,0x04])||starts([0x50,0x4b,0x05,0x06])||starts([0x50,0x4b,0x07,0x08]))add("ZIP container","application/zip","zip",0,hex(0,4));
 if(starts([0x1f,0x8b]))add("GZIP stream","application/gzip","gz",0,hex(0,2));
 if(starts([0x7f,0x45,0x4c,0x46]))add("ELF executable/object","application/x-elf","elf",0,hex(0,4));
 if(ascii(0,16)==="SQLite format 3\u0000")add("SQLite database","application/vnd.sqlite3","sqlite",0,"SQLite format 3");
 if(ascii(4,4)==="ftyp")add("ISO base media / MP4 family","video/mp4","mp4",4,ascii(4,4));
 if(ascii(0,4)==="OggS")add("Ogg container","application/ogg","ogg",0,ascii(0,4));
 const firstByte=bytes[0],secondByte=bytes[1];if(ascii(0,3)==="ID3"||(firstByte===0xff&&secondByte!==undefined&&(secondByte&0xe0)===0xe0))add("MP3/audio frame candidate","audio/mpeg","mp3",0,hex(0,Math.min(3,bytes.length)));
 if(starts([0x00,0x61,0x73,0x6d]))add("WebAssembly module","application/wasm","wasm",0,hex(0,4));
 if(starts([0x37,0x7a,0xbc,0xaf,0x27,0x1c]))add("7-Zip archive","application/x-7z-compressed","7z",0,hex(0,6));
 if(ascii(0,7)==="Rar!\x1a\x07")add("RAR archive","application/vnd.rar","rar",0,hex(0,7));
 if(ascii(257,5)==="ustar")add("TAR archive","application/x-tar","tar",257,ascii(257,5));
 if(ascii(0,4)==="II*\u0000"||ascii(0,4)==="MM\u0000*")add("TIFF image","image/tiff","tif",0,hex(0,4));
 return JSON.stringify({bytes:bytes.length,firstBytesHex:hex(0,Math.min(32,bytes.length)),signatureMatches:matches,classification:matches.length?"Known signature match":"No known signature match",note:"Magic-byte matching is informational only; it does not validate the complete file, prove its extension, or establish that it is safe."},null,2);
}

export async function runExtendedOperation(operation:ExtendedOperation,input:string,bytes:Uint8Array,options:ExtendedOptions={}):Promise<string> {
 guardText(input);
 switch(operation){
 case "query-parse":return parseQueryString(input);
 case "query-build":return buildQueryString(input);
 case "key-value":return parseKeyValue(input);
 case "key-value-build":return buildKeyValue(input);
 case "number-base":return convertNumberBase(input,options.radix??10);
 case "numeric-view":return numericView(input,options.bits??32,options.signed??false,options.endian??"big");
 case "float-view":return floatView(input,options.bits??32,options.endian??"big");
 case "hexdump":return hexDump(bytes,options.width??16);
 case "strings":return JSON.stringify(extractPrintableStrings(bytes,options.minLength??4),null,2);
 case "byte-stats":return byteStatistics(bytes);
 case "network":return inspectNetwork(input,"ip");
 case "cidr":return inspectNetwork(input,"cidr");
 case "mac":return normalizeMac(input);
 case "headers":return parseHttpHeaders(input);
 case "cookies":return parseCookies(input);
 case "network-extract":return extractNetworkCandidates(input);
 case "compression-detect":return detectCompression(bytes);
 case "statistics":return numericStatistics(input);
 case "arithmetic":return arithmetic(input,options);
 case "byte-compare":throw new Error("Choose two files in the workbench to compare bytes.");
 case "dns-records":return parseDnsRecords(input);
 case "http-message":return parseHttpMessage(input);
 case "file-signatures":return inspectFileSignatures(bytes);
 case "compression":{const action=options.action??"compress";const format=options.format==="deflate"?"deflate":"gzip";const out=await compressBytes(bytes,format,action);let textPreview:string|null=null;try{textPreview=new TextDecoder("utf-8",{fatal:true}).decode(out);}catch{}return JSON.stringify({format,action,inputBytes:bytes.length,outputBytes:out.length,ratio:bytes.length?Number((out.length/bytes.length).toFixed(4)):null,base64:typeof btoa==="function"?btoa(Array.from(out,b=>String.fromCharCode(b)).join("")):"",textPreview:textPreview?.slice(0,20000)??null,hexPreview:Array.from(out.slice(0,128),b=>b.toString(16).padStart(2,"0")).join(" "),note:"Use the full base64 field as input to decompress or download the result as bytes."},null,2);}
 }
}
