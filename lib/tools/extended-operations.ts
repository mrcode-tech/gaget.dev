export const MAX_INSPECT_BYTES = 2_000_000;
export type ExtendedOperation =
  | "query-parse" | "url-parse" | "data-uri" | "query-build" | "key-value" | "key-value-build" | "number-base" | "numeric-view" | "float-view"
  | "hexdump" | "byte-range" | "strings" | "byte-stats" | "network" | "cidr"
  | "mac" | "headers" | "cookies" | "network-extract" | "statistics" | "character-stats" | "arithmetic" | "compression-detect"
  | "compression" | "byte-compare" | "dns-records" | "http-message" | "file-signatures" | "file-metadata" | "certificate-container";
export type ExtendedOptions = { radix?: number; width?: number; offset?: number; length?: number; minLength?: number; format?: string; signed?: boolean; bits?: number; endian?: "big" | "little"; a?: string; b?: string; modulus?: string; action?: "compress" | "decompress" };
const guardText=(s:string)=>{if(s.length>200_000)throw new Error("Input exceeds the 200,000 character safety limit.");};
const guardBytes=(b:Uint8Array)=>{if(b.byteLength>MAX_INSPECT_BYTES)throw new Error("Binary inspection is limited to 2,000,000 bytes.");};
export function parseUrlComponents(input:string):string {
  guardText(input);
  let parsed:URL;
  try { parsed=new URL(input.trim()); } catch { throw new Error("Enter a valid absolute URL, including its scheme (for example, https://example.com/path)."); }
  const query:Record<string,string|string[]> = Object.create(null);
  for(const [key,value] of parsed.searchParams.entries()){
    if(Object.hasOwn(query,key)){const previous=query[key];query[key]=Array.isArray(previous)?[...previous,value]:[previous,value];}
    else query[key]=value;
  }
  return JSON.stringify({
    protocol:parsed.protocol,host:parsed.host,hostname:parsed.hostname,port:parsed.port||null,
    pathname:parsed.pathname,search:parsed.search,hash:parsed.hash,origin:parsed.origin==="null"?null:parsed.origin,
    queryParameters:query,credentialsPresent:Boolean(parsed.username||parsed.password),
    usernamePresent:Boolean(parsed.username),passwordPresent:Boolean(parsed.password),
    networkRequestsMade:false,
    note:"The URL is parsed as text only. No navigation or network request is made; credential values are intentionally omitted from output."
  },null,2);
}
/** Parse a data: URI as bytes only. The payload is never rendered or executed. */
export function parseDataUri(input:string):string {
  guardText(input);
  const source=input.trim();
  if(!/^data:/i.test(source)) throw new Error("Enter a data URI beginning with data:.");
  const comma=source.indexOf(",");
  if(comma<0) throw new Error("Data URI must contain a comma between metadata and payload.");
  const metadata=source.slice(5,comma);
  const payload=source.slice(comma+1);
  const parts=metadata.split(";");
  const mediaType=parts[0]||"text/plain";
  if(mediaType&&!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(mediaType))
    throw new Error("Data URI media type must be a valid type/subtype token.");
  const base64=parts.slice(1).some(part=>part.toLowerCase()==="base64");
  const parameters=parts.slice(1).filter(part=>part&&part.toLowerCase()!=="base64");
  if(parameters.some(part=>!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+=[^;]*$/.test(part)))
    throw new Error("Data URI contains a malformed media-type parameter.");
  let bytes:Uint8Array;
  if(base64){
    // Data URLs commonly omit Base64 padding; accept valid unpadded lengths
    // while rejecting impossible one-character tails and misplaced padding.
    if(!/^[A-Za-z0-9+/]*={0,2}$/.test(payload)||payload.length%4===1||/=/.test(payload.slice(0,-2))||(payload.includes("=")&&payload.length%4!==0))
      throw new Error("Data URI contains invalid Base64 data or padding.");
    const unpadded=payload.replace(/=+$/,"");
    if(unpadded.length%4===1) throw new Error("Data URI contains invalid Base64 data or padding.");
    const normalized=unpadded+"=".repeat((4-unpadded.length%4)%4);
    let binary:string;
    try{binary=atob(normalized);}catch{throw new Error("Data URI contains invalid Base64 data.");}
    bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
  }else{
    const out:number[]=[];
    for(let i=0;i<payload.length;){
      if(payload[i]==="%"){
        const pair=payload.slice(i+1,i+3);
        if(!/^[0-9a-f]{2}$/i.test(pair))throw new Error("Data URI contains an invalid percent escape.");
        out.push(Number.parseInt(pair,16));i+=3;
      }else{
        const cp=payload.codePointAt(i)!;
        const character=String.fromCodePoint(cp);
        out.push(...new TextEncoder().encode(character));
        i+=character.length;
      }
      if(out.length>MAX_INSPECT_BYTES)throw new Error("Decoded data URI payload is limited to 2,000,000 bytes.");
    }
    bytes=Uint8Array.from(out);
  }
  if(bytes.length>MAX_INSPECT_BYTES)throw new Error("Decoded data URI payload is limited to 2,000,000 bytes.");
  let textPreview:string|null=null;
  try{textPreview=new TextDecoder("utf-8",{fatal:true}).decode(bytes).slice(0,4000);}catch{}
  return JSON.stringify({
    mediaType,parameters,base64Encoded:base64,byteLength:bytes.length,
    base64:typeof btoa==="function"?btoa(Array.from(bytes,(b)=>String.fromCharCode(b)).join("")):null,
    hexPreview:Array.from(bytes.slice(0,128),b=>b.toString(16).padStart(2,"0")).join(" "),
    textPreview,payloadTruncated:bytes.length>4000,executed:false,networkRequestsMade:false,
    note:"Parsed locally as data only. Payload is not rendered, executed, or fetched."
  },null,2);
}
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
  const ipv6=unique(collect(/(?<![0-9a-f:])(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}(?![0-9a-f:])/gi));
  const domains=unique(collect(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63})\b/gi));
  return JSON.stringify({urls,emails,ipv4Candidates:ipv4,ipv6Candidates:ipv6,domainCandidates:domains,validation:"Candidates are extracted by pattern only; they are not validated, resolved, or contacted."},null,2);
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
export function inspectByteRange(bytes:Uint8Array,offset=0,length=64):string {
 guardBytes(bytes);
 if(!Number.isInteger(offset)||offset<0||offset>bytes.length)throw new Error("Byte offset must be an integer between zero and the file length.");
 if(!Number.isInteger(length)||length<1||length>256)throw new Error("Byte range length must be an integer from 1 to 256.");
 const end=Math.min(bytes.length,offset+length),rows:{offset:number;hex:string;decimal:string;ascii:string}[]=[];
 for(let start=offset;start<end;start+=16){const slice=bytes.slice(start,Math.min(start+16,end));rows.push({offset:start,hex:Array.from(slice,b=>b.toString(16).padStart(2,"0")).join(" "),decimal:Array.from(slice).join(" "),ascii:Array.from(slice,b=>b>=32&&b<=126?String.fromCharCode(b):".").join("")});}
 return JSON.stringify({fileBytes:bytes.length,offset,lengthRequested:length,bytesReturned:end-offset,endOffsetExclusive:end,rows,offsetsAreZeroBased:true},null,2);
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
export function characterStatistics(input:string):string {
 guardText(input);
 const counts=new Map<string,number>();let whitespace=0;
 for(const character of Array.from(input)){counts.set(character,(counts.get(character)??0)+1);if(/\s/u.test(character))whitespace++;}
 const sorted=[...counts.entries()].sort((a,b)=>b[1]-a[1]||(a[0]?.codePointAt(0)??0)-(b[0]?.codePointAt(0)??0));
 const total=Array.from(input).length;
 return JSON.stringify({unit:"Unicode code points (not grapheme clusters)",totalCodePoints:total,uniqueCodePoints:counts.size,whitespaceCodePoints:whitespace,frequencies:sorted.slice(0,100).map(([character,count])=>({character,codePoint:"U+"+character.codePointAt(0)!.toString(16).toUpperCase().padStart(4,"0"),count,percent:total?Number((count*100/total).toFixed(2)):0})),truncated:sorted.length>100},null,2);
}
export function arithmetic(input:string,options:ExtendedOptions={}):string {
 const a=Number(options.a),b=Number(options.b);
 if(!options.a?.trim()||(input!=="not"&&!options.b?.trim())||!Number.isFinite(a)||(input!=="not"&&!Number.isFinite(b)))throw new Error(input==="not"?"Enter a finite integer in the A field.":"Enter two finite numbers in the A and B fields.");
 if(input==="modular"){let m:bigint,x:bigint,y:bigint;try{m=BigInt(options.modulus??"");x=BigInt(options.a??"");y=BigInt(options.b??"");}catch{throw new Error("Modular arithmetic requires integer operands and a positive integer modulus.");}if(m<=BigInt(0))throw new Error("Modulus must be a positive integer.");return JSON.stringify({sum:(((x+y)%m+m)%m).toString(),difference:(((x-y)%m+m)%m).toString(),product:(((x*y)%m+m)%m).toString(),modulus:m.toString()},null,2);}
 if(["and","or","xor","not"].includes(input)){
  const width=options.bits??32;if(![8,16,32,64].includes(width))throw new Error("Bitwise width must be 8, 16, 32, or 64 bits.");
  let x:bigint,y=BigInt(0);try{x=BigInt(options.a??"");if(input!=="not")y=BigInt(options.b??"");}catch{throw new Error("Bitwise operations require integer operands.");}
  const limit=BigInt(1)<<BigInt(width),mask=limit-BigInt(1),isSigned=options.signed===true;
  const min=isSigned?-(limit>>BigInt(1)):BigInt(0),max=isSigned?(limit>>BigInt(1))-BigInt(1):mask;
  if(x<min||x>max||(input!=="not"&&(y<min||y>max)))throw new Error("Bitwise operands must fit the selected "+(isSigned?"signed ":"unsigned ")+width+"-bit width.");
  const ux=x<0?x+limit:x,uy=y<0?y+limit:y;
  const raw=input==="and"?(ux&uy):input==="or"?(ux|uy):input==="xor"?(ux^uy):((~ux)&mask);
  const signedResult=isSigned&&(raw&(limit>>BigInt(1)))!==BigInt(0)?raw-limit:raw;
  const base={operation:input,width,decimal:signedResult.toString(),hexadecimal:"0x"+raw.toString(16).padStart(width/4,"0").toUpperCase(),binary:raw.toString(2).padStart(width,"0")};
  return JSON.stringify(isSigned?{...base,signed:true,unsignedDecimal:raw.toString()}:base,null,2);
 }
 if(input==="divide"&&b===0)throw new Error("Cannot divide by zero.");const result=input==="add"?a+b:input==="subtract"?a-b:input==="multiply"?a*b:a/b;if(!Number.isFinite(result))throw new Error("Result is outside the finite numeric range.");return String(result);
}
export async function compressBytes(bytes:Uint8Array,format:"gzip"|"deflate",action:"compress"|"decompress"="compress"):Promise<Uint8Array> {
 guardBytes(bytes);
 const Stream=action==="compress"?globalThis.CompressionStream:globalThis.DecompressionStream;
 if(!Stream)throw new Error("Browser compression streams are unavailable in this environment.");
 const stream=new Blob([bytes.slice().buffer as ArrayBuffer]).stream().pipeThrough(new Stream(format));
 const reader=stream.getReader(),chunks:Uint8Array[]=[];let total=0;
 try {
  while(true){
   const {done,value}=await reader.read();if(done)break;
   total+=value.byteLength;
   // Enforce the cap while streaming; do not buffer an unbounded decompression bomb
   // and only check its size after allocating the entire result.
   if(total>MAX_INSPECT_BYTES*4){await reader.cancel();throw new Error("Compressed/decompressed output exceeds the 8,000,000 byte safety limit.");}
   chunks.push(value);
  }
 } catch(error) {
  try{await reader.cancel();}catch{}
  throw error;
 } finally {reader.releaseLock();}
 const output=new Uint8Array(total);let offset=0;
 for(const chunk of chunks){output.set(chunk,offset);offset+=chunk.byteLength;}
 return output;
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
  const owner=tokens[0]??"",recordType=tokens[typeIndex]?.toUpperCase(),before=tokens.slice(1,typeIndex),ttlText=before.find(token=>/^\d+$/.test(token)),recordClass=before.find(token=>/^(IN|CH|HS)$/i.test(token))?.toUpperCase()??"IN",value=tokens.slice(typeIndex+1).join(" ");
  if(!owner||!recordType){skippedLines++;continue;}
  if(!value)throw new Error("DNS record on line "+(index+1)+" is missing its value.");
  records.push({owner,ttl:ttlText===undefined?null:Number(ttlText),class:recordClass,type:recordType,value,line:index+1});
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


/** Extracts bounded, non-executing metadata from a small set of common file headers. */
export function inspectFileMetadata(bytes: Uint8Array): string {
  guardBytes(bytes);
  const u16le=(offset:number)=>offset+2<=bytes.length?bytes[offset]|(bytes[offset+1]<<8):null;
  const u32le=(offset:number)=>offset+4<=bytes.length?(bytes[offset]|(bytes[offset+1]<<8)|(bytes[offset+2]<<16)|(bytes[offset+3]<<24))>>>0:null;
  const u32be=(offset:number)=>offset+4<=bytes.length?((bytes[offset]*0x1000000)+(bytes[offset+1]<<16)+(bytes[offset+2]<<8)+bytes[offset+3])>>>0:null;
  const ascii=(offset:number,length:number)=>Array.from(bytes.slice(offset,offset+length),b=>String.fromCharCode(b)).join("");
  const metadata:Record<string,unknown>={};
  const notes:string[]=[];
  if(ascii(0,8)==="\x89PNG\r\n\x1a\n" && bytes.length>=26){
    metadata.format="PNG";metadata.width=u32be(16);metadata.height=u32be(20);metadata.bitDepth=bytes[24];metadata.colorType=bytes[25];
  } else if(bytes.length>=4&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff){
    metadata.format="JPEG";let offset=2,found=false;
    const startOfFrame=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
    while(offset+3<bytes.length){
      if(bytes[offset]!==0xff){offset++;continue;}
      while(offset<bytes.length&&bytes[offset]===0xff)offset++;
      if(offset>=bytes.length)break;
      const marker=bytes[offset++];
      if(marker===0xd9||marker===0xda)break;
      if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
      if(offset+2>bytes.length)break;
      const segmentLength=(bytes[offset]<<8)|bytes[offset+1];
      if(segmentLength<2||offset+segmentLength>bytes.length){notes.push("A JPEG segment length is invalid or extends beyond the supplied bytes.");break;}
      if(startOfFrame.has(marker)&&segmentLength>=8){
        metadata.width=(bytes[offset+5]<<8)|bytes[offset+6];metadata.height=(bytes[offset+3]<<8)|bytes[offset+4];metadata.bitsPerSample=bytes[offset+2];metadata.components=bytes[offset+7];metadata.frameMarker="0x"+marker.toString(16).toUpperCase().padStart(2,"0");found=true;break;
      }
      offset+=segmentLength;
    }
    if(!found)notes.push("No complete supported JPEG start-of-frame segment was found in the supplied bytes.");
  } else if((ascii(0,6)==="GIF87a"||ascii(0,6)==="GIF89a")&&bytes.length>=10){
    metadata.format="GIF";metadata.width=u16le(6);metadata.height=u16le(8);metadata.version=ascii(0,6);
  } else if(ascii(0,2)==="BM"&&bytes.length>=30){
    const width=u32le(18)!,heightRaw=u32le(22)!;
    metadata.format="BMP";metadata.width=width>0x7fffffff?width-0x100000000:width;metadata.height=Math.abs(heightRaw>0x7fffffff?heightRaw-0x100000000:heightRaw);metadata.bitsPerPixel=u16le(28);
  } else if(ascii(0,4)==="RIFF"&&ascii(8,4)==="WEBP"&&ascii(12,4)==="VP8X"&&bytes.length>=30){
    metadata.format="WebP";metadata.width=1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16);metadata.height=1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16);
  } else if(ascii(0,4)==="RIFF"&&ascii(8,4)==="WAVE"&&bytes.length>=12){
    metadata.format="WAVE";let offset=12;let byteRate:number|null=null;let dataSize:number|null=null;
    while(offset+8<=bytes.length){
      const id=ascii(offset,4),size=u32le(offset+4)!;const body=offset+8;
      if(size>bytes.length-body){notes.push("A chunk length extends beyond the supplied file bytes.");break;}
      if(id==="fmt "&&size>=16){metadata.audioFormat=u16le(body);metadata.channels=u16le(body+2);metadata.sampleRate=u32le(body+4);byteRate=u32le(body+8);metadata.bitsPerSample=u16le(body+14);}
      if(id==="data")dataSize=size;
      if(id==="fmt "||id==="data"){if(dataSize!==null&&byteRate!==null&&byteRate>0){metadata.dataBytes=dataSize;metadata.durationSeconds=Number((dataSize/byteRate).toFixed(3));}}
      offset=body+size+(size%2);
    }
    if(dataSize!==null){metadata.dataBytes=dataSize;if(byteRate&&byteRate>0)metadata.durationSeconds=Number((dataSize/byteRate).toFixed(3));}
  } else if(ascii(0,5)==="%PDF-"&&bytes.length>=8){
    metadata.format="PDF";metadata.version=ascii(5,3);
    const text=ascii(0,bytes.length);
    const pageObjects=Array.from(text.matchAll(/\/Type\s*\/Page\b/g)).length;
    if(pageObjects)metadata.pageObjectCandidates=pageObjects;
    const declaredCounts=Array.from(text.matchAll(/\/Count\s+(\d{1,8})\b/g),m=>Number(m[1])).filter(n=>n>=0);
    if(declaredCounts.length)metadata.declaredPageCounts=declaredCounts.slice(0,50);
    notes.push("PDF page counts are lexical candidates only; compressed object streams and malformed files may hide or spoof counts.");
  } else if(bytes.length>=4&&bytes[0]===0x50&&bytes[1]===0x4b&&(bytes[2]===0x03||bytes[2]===0x05||bytes[2]===0x07)){
    metadata.format="ZIP archive";let eocd=-1;
    const lower=Math.max(0,bytes.length-65_557);
    for(let i=bytes.length-22;i>=lower;i--){if(bytes[i]===0x50&&bytes[i+1]===0x4b&&bytes[i+2]===0x05&&bytes[i+3]===0x06){const commentLength=u16le(i+20);if(commentLength!==null&&i+22+commentLength<=bytes.length){eocd=i;break;}}}
    if(eocd>=0){
      metadata.entriesOnThisDisk=u16le(eocd+8);metadata.totalEntries=u16le(eocd+10);metadata.centralDirectoryBytes=u32le(eocd+12);metadata.centralDirectoryOffset=u32le(eocd+16);
      if(metadata.totalEntries===65535||metadata.centralDirectoryBytes===0xffffffff||metadata.centralDirectoryOffset===0xffffffff)notes.push("ZIP64 metadata is present or likely; extended values are not decoded by this inspector.");
      if(u16le(eocd+4)!==0||u16le(eocd+6)!==0)notes.push("Multi-disk ZIP metadata is not fully interpreted.");
    }else notes.push("The ZIP end-of-central-directory record was not found within the supplied bytes; the archive may be truncated or use an unsupported layout.");
  } else if(ascii(0,3)==="ID3"&&bytes.length>=10){
    const sizeBytes=[bytes[6],bytes[7],bytes[8],bytes[9]];
    if(sizeBytes.every(b=>(b&0x80)===0)){
      metadata.format="MP3 with ID3 tag";metadata.id3Version="2."+bytes[3]+"."+bytes[4];metadata.id3TagBytes=(sizeBytes[0]<<21)|(sizeBytes[1]<<14)|(sizeBytes[2]<<7)|sizeBytes[3];metadata.id3Flags=bytes[5];
      if(10+(metadata.id3TagBytes as number)>bytes.length)notes.push("The declared ID3 tag extends beyond the supplied bytes.");
    } else notes.push("ID3 tag size uses invalid synchsafe bytes.");
  } else {
    metadata.format="No supported metadata parser matched";
    notes.push("The file may be unsupported, truncated, or contain a format variant not handled by this inspector.");
  }
  return JSON.stringify({inputBytes:bytes.length,metadata,notes,processing:"Local byte parsing only; no file execution, extraction, or network access.",caveat:"Metadata fields are best-effort indicators, not proof of file validity or safety."},null,2);
}


/** Inspect PEM labels or the outer DER container and fingerprint exact bytes. This does not validate certificate trust. */
export async function inspectCertificateContainer(input: string, bytes: Uint8Array): Promise<string> {
  guardText(input); guardBytes(bytes);
  let source=input;
  if(!source.includes("-----BEGIN ")&&bytes.length){
    try { const decoded=new TextDecoder("utf-8",{fatal:true}).decode(bytes); if(decoded.includes("-----BEGIN "))source=decoded; } catch {}
  }
  const blocks:Array<{label:string;bytes:Uint8Array}>=[];
  const pattern=/-----BEGIN ([A-Z0-9][A-Z0-9 -]{0,63})-----\s*([\s\S]*?)\s*-----END \1-----/g;
  for(const match of source.matchAll(pattern)){
    const encoded=match[2].replace(/\s/g,"");
    if(!encoded||!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)||encoded.length%4===1)throw new Error("PEM block contains invalid Base64 data.");
    const padded=encoded.replace(/=+$/,"")+"=".repeat((4-encoded.replace(/=+$/,"").length%4)%4);
    let binary:string;try{binary=atob(padded);}catch{throw new Error("PEM block contains invalid Base64 data.");}
    const der=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
    if(der.length>MAX_INSPECT_BYTES)throw new Error("Decoded PEM content is limited to 2,000,000 bytes.");
    blocks.push({label:match[1],bytes:der});
  }
  if(source.includes("-----BEGIN ")&&blocks.length===0)throw new Error("PEM block is malformed or has mismatched BEGIN/END labels.");
  const fingerprint=async(data:Uint8Array)=>{
    const copy=data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength) as ArrayBuffer;
    const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",copy));
    return Array.from(digest,b=>b.toString(16).padStart(2,"0").toUpperCase()).join(":");
  };
  if(blocks.length){
    const results=[];
    for(const block of blocks)results.push({pemLabel:block.label,derBytes:block.bytes.length,sha256Fingerprint:await fingerprint(block.bytes),derOuterSequence:block.bytes[0]===0x30});
    return JSON.stringify({container:"PEM",blocks:results,trustValidated:false,networkRequestsMade:false,note:"PEM labels and SHA-256 fingerprints are parsed locally. This does not parse all X.509 fields, verify signatures, validate a chain, or establish trust."},null,2);
  }
  if(bytes.length<2||bytes[0]!==0x30)throw new Error("Paste a PEM block or select a DER file with an ASN.1 SEQUENCE outer tag.");
  let headerLength=2,declaredLength:number;
  const first=bytes[1];
  if(first<0x80)declaredLength=first;
  else{
    const count=first&0x7f;
    if(count===0||count>4||2+count>bytes.length)throw new Error("DER uses an unsupported or malformed length encoding.");
    declaredLength=0;for(let i=0;i<count;i++)declaredLength=declaredLength*256+bytes[2+i];headerLength=2+count;
    if(declaredLength<128)throw new Error("DER length is not minimally encoded.");
  }
  if(headerLength+declaredLength>bytes.length)throw new Error("DER sequence length exceeds the supplied file bytes.");
  return JSON.stringify({container:"DER ASN.1 SEQUENCE",inputBytes:bytes.length,outerTag:"0x30",headerBytes:headerLength,declaredContentBytes:declaredLength,trailingBytes:bytes.length-headerLength-declaredLength,sha256Fingerprint:await fingerprint(bytes),trustValidated:false,networkRequestsMade:false,note:"This inspects the outer DER length and fingerprints exact bytes only. It does not identify a certificate or key reliably, parse all X.509 fields, verify signatures, or establish trust."},null,2);
}

export async function runExtendedOperation(operation:ExtendedOperation,input:string,bytes:Uint8Array,options:ExtendedOptions={}):Promise<string> {
 guardText(input);
 switch(operation){
 case "query-parse":return parseQueryString(input);
 case "data-uri":return parseDataUri(input);
 case "url-parse":return parseUrlComponents(input);
 case "query-build":return buildQueryString(input);
 case "key-value":return parseKeyValue(input);
 case "key-value-build":return buildKeyValue(input);
 case "number-base":return convertNumberBase(input,options.radix??10);
 case "numeric-view":return numericView(input,options.bits??32,options.signed??false,options.endian??"big");
 case "float-view":return floatView(input,options.bits??32,options.endian??"big");
 case "hexdump":return hexDump(bytes,options.width??16);
 case "byte-range":return inspectByteRange(bytes,options.offset??0,options.length??64);
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
 case "character-stats":return characterStatistics(input);
 case "arithmetic":return arithmetic(input,options);
 case "byte-compare":throw new Error("Choose two files in the workbench to compare bytes.");
 case "dns-records":return parseDnsRecords(input);
 case "http-message":return parseHttpMessage(input);
 case "file-signatures":return inspectFileSignatures(bytes);
 case "file-metadata":return inspectFileMetadata(bytes);
 case "certificate-container":return inspectCertificateContainer(input,bytes);
 case "compression":{const action=options.action??"compress";const format=options.format==="deflate"?"deflate":"gzip";const out=await compressBytes(bytes,format,action);let textPreview:string|null=null;try{textPreview=new TextDecoder("utf-8",{fatal:true}).decode(out);}catch{}return JSON.stringify({format,action,inputBytes:bytes.length,outputBytes:out.length,ratio:bytes.length?Number((out.length/bytes.length).toFixed(4)):null,base64:typeof btoa==="function"?btoa(Array.from(out,b=>String.fromCharCode(b)).join("")):"",textPreview:textPreview?.slice(0,20000)??null,hexPreview:Array.from(out.slice(0,128),b=>b.toString(16).padStart(2,"0")).join(" "),note:"Use the full base64 field as input to decompress or download the result as bytes."},null,2);}
 }
}
