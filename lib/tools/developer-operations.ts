export type DeveloperOperation = "regex" | "xml" | "sql" | "csv-json" | "html" | "curl" | "hash";
export const MAX_TEXT_LENGTH = 200_000;
const guard = (s:string) => { if (s.length > MAX_TEXT_LENGTH) throw new Error("Input exceeds the 200,000 character safety limit."); };
export function parseCsv(s:string, d=","):string[][] {
 guard(s); if(d.length!==1 || /["\r\n]/.test(d)) throw new Error("Delimiter must be one non-quote character.");
 const rows:string[][]=[]; let row:string[]=[], cell="", quoted=false;
 for(let i=0;i<s.length;i++){const c=s[i]; if(quoted){if(c==='"'&&s[i+1]==='"'){cell+='"';i++;}else if(c==='"')quoted=false;else cell+=c;}
 else if(c==='"'&&!cell)quoted=true;else if(c===d){row.push(cell);cell="";}
 else if(c==="\r"||c==="\n"){if(c==="\r"&&s[i+1]==="\n")i++;row.push(cell);rows.push(row);row=[];cell="";}else cell+=c;}
 if(quoted)throw new Error("CSV contains an unclosed quoted field.");
 if(cell||row.length||!s.length||! /[\r\n]$/.test(s)){row.push(cell);rows.push(row);}
 if(rows[0]?.[0]?.charCodeAt(0)===0xfeff)rows[0][0]=rows[0][0].slice(1); return rows;
}
function csvCell(v:unknown,d:string){let s=v==null?"":typeof v==="string"?v:JSON.stringify(v);if(typeof v==="string"&&/^[=+@\-\t\r]/.test(s))s="'"+s;return /["\r\n]/.test(s)||s.includes(d)?'"'+s.replace(/"/g,'""')+'"':s;}
export function csvToJson(s:string,d=","){
 const rows=parseCsv(s,d);if(!rows.length)return "[]";
 const headers=rows[0].map((h,i)=>h.trim()||"column_"+(i+1)), used=new Set<string>();
 const keys=headers.map(h=>{let k=h,n=2;while(used.has(k))k=h+"_"+n++;used.add(k);return k;});
 const data=rows.slice(1).filter(r=>!(r.length===1&&r[0]==="")).map((r,i)=>{if(r.length>keys.length)throw new Error("Row "+(i+2)+" has more cells than the header row.");return Object.fromEntries(keys.map((k,j)=>[k,r[j]??""]));});
 return JSON.stringify(data,null,2);
}
export function jsonToCsv(s:string,d=","){
 guard(s);const data:unknown=JSON.parse(s);if(!Array.isArray(data)||data.some(r=>!r||typeof r!=="object"||Array.isArray(r)))throw new Error("Provide a JSON array of objects to convert to CSV.");
 const headers=[...new Set(data.flatMap(r=>Object.keys(r as object)))];return [headers.map(v=>csvCell(v,d)).join(d),...data.map(r=>headers.map(k=>csvCell((r as Record<string,unknown>)[k],d)).join(d))].join("\n");
}
type XmlToken={kind:"text"|"comment"|"cdata"|"pi"|"doctype"|"start"|"end"|"empty";value:string;name?:string};
function tokenizeXml(source:string):XmlToken[]{
 const tokens:XmlToken[]=[];let i=0;
 while(i<source.length){
  if(source[i]!=="<"){const end=source.indexOf("<",i),stop=end<0?source.length:end,value=source.slice(i,stop);if(value.includes("]]>"))throw new Error("XML character data cannot contain ]]>.");tokens.push({kind:"text",value});i=stop;continue;}
  if(source.startsWith("<!--",i)){const end=source.indexOf("-->",i+4);if(end<0)throw new Error("Unclosed XML comment.");const value=source.slice(i,end+3);if(value.slice(4,-3).includes("--"))throw new Error("XML comments cannot contain --.");tokens.push({kind:"comment",value});i=end+3;continue;}
  if(source.startsWith("<![CDATA[",i)){const end=source.indexOf("]]>",i+9);if(end<0)throw new Error("Unclosed CDATA section.");tokens.push({kind:"cdata",value:source.slice(i,end+3)});i=end+3;continue;}
  if(source.startsWith("<?",i)){const end=source.indexOf("?>",i+2);if(end<0)throw new Error("Unclosed processing instruction.");tokens.push({kind:"pi",value:source.slice(i,end+2)});i=end+2;continue;}
  if(/^<!DOCTYPE\b/i.test(source.slice(i,i+10))){
   let quote="",brackets=0,end=-1;for(let j=i+9;j<source.length;j++){const ch=source[j];if(quote){if(ch===quote)quote="";continue;}if(ch==="'"||ch==='"'){quote=ch;continue;}if(ch==="[")brackets++;else if(ch==="]")brackets=Math.max(0,brackets-1);else if(ch===">"&&brackets===0){end=j;break;}}
   if(end<0)throw new Error("Unclosed DOCTYPE declaration.");tokens.push({kind:"doctype",value:source.slice(i,end+1)});i=end+1;continue;
  }
  let quote="",end=-1;for(let j=i+1;j<source.length;j++){const ch=source[j];if(quote){if(ch===quote)quote="";continue;}if(ch==="'"||ch==='"'){quote=ch;continue;}if(ch===">"){end=j;break;}if(ch==="<")throw new Error("Unexpected < inside an XML tag.");}
  if(end<0)throw new Error("Unclosed XML tag.");const value=source.slice(i,end+1);
  if(/^<\//.test(value)){const m=value.match(/^<\/([A-Za-z_:][\w:.-]*)\s*>$/);if(!m)throw new Error("Malformed XML closing tag: "+value);tokens.push({kind:"end",name:m[1],value});}
  else{
   const m=value.match(/^<([A-Za-z_:][\w:.-]*)([\s\S]*?)\s*(\/?)>$/);if(!m)throw new Error("Malformed XML start tag: "+value);
   const name=m[1];let rest=m[2],seen=new Set<string>();
   while(rest.trim()){const am=rest.match(/^\s+([A-Za-z_:][\w:.-]*)\s*=\s*("[^"]*"|'[^']*')/);if(!am)throw new Error("Malformed XML attribute in "+name+".");if(seen.has(am[1]))throw new Error("Duplicate XML attribute "+am[1]+" in "+name+".");seen.add(am[1]);rest=rest.slice(am[0].length);}
   tokens.push({kind:m[3]==="/"?"empty":"start",name,value});
  }
  i=end+1;
 }
 return tokens;
}
export function formatXml(s:string,minify=false){
 guard(s);const tokens=tokenizeXml(s);if(!tokens.some(t=>t.kind!=="text"||t.value.trim()))throw new Error("Enter an XML document.");
 const stack:string[]=[],lines:string[]=[];let depth=0,roots=0,doctypeSeen=false,rootClosed=false;
 for(const token of tokens){const {kind,value,name}=token;const v=value.trim();if(!v)continue;
  if(kind==="text"){if(stack.length===0)throw new Error("Text is not allowed outside the XML root element.");lines.push("  ".repeat(depth)+v);continue;}
  if(kind==="doctype"){if(doctypeSeen||roots>0||stack.length)throw new Error("DOCTYPE must appear at most once before the root element.");doctypeSeen=true;lines.push(v);continue;}
  if(kind==="comment"||kind==="pi"){lines.push("  ".repeat(depth)+v);continue;}
  if(kind==="cdata"){if(!stack.length)throw new Error("CDATA is only allowed inside the XML root element.");lines.push("  ".repeat(depth)+v);continue;}
  if(kind==="end"){if(stack.pop()!==name)throw new Error("Unexpected or mismatched closing tag: "+v);depth--;if(stack.length===0)rootClosed=true;lines.push("  ".repeat(depth)+v);continue;}
  if(stack.length===0){if(rootClosed||roots>0)throw new Error("XML must contain exactly one root element.");roots++;}
  lines.push("  ".repeat(depth)+v);
  if(kind==="start"){stack.push(name!);depth++;}else if(stack.length===0)rootClosed=true;
 }
 if(stack.length)throw new Error("Unclosed XML element: "+stack[stack.length-1]);
 if(roots!==1)throw new Error("XML must contain exactly one root element.");
 return minify?lines.join("").replace(/>\s*</g,"><"):lines.join("\n");
}
export function formatHtml(s:string,minify=false){
 guard(s);const tokens=s.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]+>|[^<]+/g)||[];
 if(minify)return tokens.map(t=>t.trim()).filter(Boolean).join("").replace(/>\s+</g,"><");
 const lines:string[]=[];let depth=0;const voids=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
 for(const t of tokens){const v=t.trim();if(!v)continue;if(/^<\/\s*[a-z0-9-]+/i.test(v))depth=Math.max(0,depth-1);lines.push("  ".repeat(depth)+v);const m=v.match(/^<([a-z][a-z0-9-]*)\b/i);if(m&&!/^<\//.test(v)&&!/^<!/.test(v)&&! /\/\s*>$/.test(v)&&!voids.has(m[1].toLowerCase()))depth++;}
 return lines.join("\n");
}
export function formatSql(s:string,minify=false){
 guard(s);const tokens=s.match(/'(?:''|\\.|[^'])*'|"(?:\\.|[^"])*"|\[(?:[^\]])*\]|--[^\n]*|\/\*[\s\S]*?\*\/|\b(?:SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|INSERT\s+INTO|VALUES|UPDATE|SET|DELETE\s+FROM|UNION\s+ALL|UNION|AS|CASE|WHEN|THEN|ELSE|END|WITH|DISTINCT|CREATE\s+TABLE|ALTER\s+TABLE)\b|[,();]|[^\s,();]+/gi)||[];
 if(minify)return tokens.join(" ").replace(/\s+([,;)])/g,"$1").replace(/([(])\s+/g,"$1").trim();
 const clauses=new Set(["SELECT","FROM","WHERE","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","UNION","UNION ALL","WITH"]);const out:string[]=[];let line="";
 const flush=()=>{if(line.trim())out.push(line.trim());line="";};
 for(const t of tokens){const u=t.toUpperCase().replace(/\s+/g," ");if(clauses.has(u)){flush();line=t.toUpperCase()+" ";}else if(t===","){flush();line="  ";}else if(t===";"){line=line.trimEnd()+";";flush();}else if(t==="(")line=line.trimEnd()+" (";else if(t===")")line=line.trimEnd()+")";else line+=t+" ";}
 flush();return out.join("\n").trim();
}
function shellWords(s:string){const out:string[]=[];let cur="",q="",esc=false;for(const c of s){if(esc){cur+=c;esc=false;continue;}if(c==="\\"&&q!=="'"){esc=true;continue;}if(q){if(c===q)q="";else cur+=c;continue;}if(c==="'"||c==='"'){q=c;continue;}if(/\s/.test(c)){if(cur){out.push(cur);cur="";}}else cur+=c;}if(esc||q)throw new Error("Unclosed quote or trailing escape in cURL command.");if(cur)out.push(cur);return out;}
export type CurlRequest={method:string;url:string;headers:string[][];body?:string;unsupported:string[]};
export function parseCurl(s:string):CurlRequest{
 guard(s);const w=s.trim().replace(/\\\r?\n/g," ");const a=shellWords(w);if(!a.length||!/^curl(?:\.exe)?$/i.test(a[0]))throw new Error("Start with curl and provide a URL.");
 const r:CurlRequest={method:"GET",url:"",headers:[],unsupported:[]};
 for(let i=1;i<a.length;i++){const k=a[i],take=()=>{if(i+1>=a.length)throw new Error("Missing value for "+k);return a[++i];};
 if(k==="-X"||k==="--request")r.method=take().toUpperCase();else if(k==="-u"||k==="--user"||k==="-b"||k==="--cookie"){take();r.unsupported.push(k+" (credential/cookie value redacted and not represented)");}else if(k==="-H"||k==="--header"){const h=take(),n=h.indexOf(":");if(n<1)throw new Error("Headers must use the Name: value form.");r.headers.push([h.slice(0,n).trim(),h.slice(n+1).trim()]);}
 else if(["-d","--data","--data-raw","--data-binary","--data-urlencode"].includes(k)){r.body=take();if(r.method==="GET")r.method="POST";}else if(k==="-I"||k==="--head")r.method="HEAD";else if(k==="--url")r.url=take();
 else if(["-s","-S","-sS","-L","--location","-k","--insecure","-i","--include","--compressed"].includes(k))r.unsupported.push(k+" (not represented in generated snippets)");else if(k.startsWith("-"))r.unsupported.push(k);else if(!r.url)r.url=k;else r.unsupported.push("additional positional argument: "+k);}
 if(!r.url)throw new Error("No request URL was found.");try{new URL(r.url);}catch{throw new Error("The request URL must be absolute (for example, https://example.com/api).");}return r;
}
export function transformDeveloperTool(op:DeveloperOperation,s:string,o:{mode?:string;pattern?:string;flags?:string;delimiter?:string}={}):string{
 guard(s);switch(op){case "regex":{if(!o.pattern)throw new Error("Enter a regular expression.");if(s.length>50000)throw new Error("Regex input is limited to 50,000 characters.");const flags=[...new Set((o.flags||"g").split(""))].join("");if(/[^dgimsuvy]/.test(flags)||(flags.includes("u")&&flags.includes("v")))throw new Error("One or more regular-expression flags are unsupported or incompatible.");const re=new RegExp(o.pattern,flags),matches:{match:string;index:number;groups:string[]}[]=[];let m:RegExpExecArray|null;while((m=re.exec(s))&&matches.length<500){matches.push({match:m[0],index:m.index,groups:m.slice(1)});if(!re.global&&!re.sticky)break;if(m[0]==="")re.lastIndex++;}return JSON.stringify({count:matches.length,truncated:matches.length===500,matches},null,2);}
 case "xml":return formatXml(s,o.mode==="minify");case "sql":return formatSql(s,o.mode==="minify");case "html":return formatHtml(s,o.mode==="minify");case "csv-json":return o.mode==="json-to-csv"?jsonToCsv(s,o.delimiter||","):csvToJson(s,o.delimiter||",");
 case "curl":{const r=parseCurl(s);const safeUrl=new URL(r.url);for(const key of [...safeUrl.searchParams.keys()])if(/token|secret|password|api[-_]?key|auth|signature/i.test(key))safeUrl.searchParams.set(key,"[REDACTED]");const url=safeUrl.toString();const headers:[string,string][]=r.headers.map(([k,v])=>[k,/authorization|cookie|token|secret|api[-_]?key/i.test(k)?"[REDACTED]":v]);const body=r.body&&/token|secret|password|api[-_]?key/i.test(r.body)?"[REDACTED]":r.body;const options={method:r.method,headers:Object.fromEntries(headers),...(body?{body}:{})};return JSON.stringify({request:{...r,url,headers,body},javascriptFetch:"fetch("+JSON.stringify(url)+", "+JSON.stringify(options,null,2)+");",note:"Generated text only. This tool never sends the request. Review redacted values and unsupported flags before use."},null,2);}
 case "hash":throw new Error("Use the browser cryptography API for hash generation.");}
}
