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
function csvCell(v:unknown,d:string){let s=v==null?"":typeof v==="string"?v:JSON.stringify(v);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return /["\r\n]/.test(s)||s.includes(d)?'"'+s.replace(/"/g,'""')+'"':s;}
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
export function formatXml(s:string,minify=false){
 guard(s);const tokens=s.replace(/>\s*</g,"><").match(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<[^>]+>|[^<]+/gi)||[];
 if(!tokens.join("").trim())throw new Error("Enter an XML document.");const stack:string[]=[],lines:string[]=[];let depth=0;
 for(const t of tokens){const v=t.trim();if(!v)continue;if(/^<\//.test(v)){const n=v.match(/^<\/\s*([^\s>]+)/)?.[1];if(!n||stack.pop()!==n)throw new Error("Unexpected or mismatched closing tag: "+v);depth=Math.max(0,depth-1);}
 lines.push("  ".repeat(depth)+v);if(/^<[^!?/][^>]*>$/.test(v)&&! /\/\s*>$/.test(v)){const n=v.match(/^<([^\s/>]+)/)?.[1];if(!n)throw new Error("Malformed XML element.");stack.push(n);depth++;}}
 if(stack.length)throw new Error("Unclosed XML element: "+stack[stack.length-1]);return minify?lines.join("").replace(/>\s*</g,"><"):lines.join("\n");
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
 if(k==="-X"||k==="--request")r.method=take().toUpperCase();else if(k==="-H"||k==="--header"){const h=take(),n=h.indexOf(":");if(n<1)throw new Error("Headers must use the Name: value form.");r.headers.push([h.slice(0,n).trim(),h.slice(n+1).trim()]);}
 else if(["-d","--data","--data-raw","--data-binary","--data-urlencode"].includes(k)){r.body=take();if(r.method==="GET")r.method="POST";}else if(k==="-I"||k==="--head")r.method="HEAD";else if(k==="--url")r.url=take();
 else if(["-s","-S","-sS","-L","--location","-k","--insecure","-i","--include","--compressed"].includes(k))r.unsupported.push(k+" (not represented in generated snippets)");else if(k.startsWith("-"))r.unsupported.push(k);else if(!r.url)r.url=k;else r.unsupported.push("additional positional argument: "+k);}
 if(!r.url)throw new Error("No request URL was found.");try{new URL(r.url);}catch{throw new Error("The request URL must be absolute (for example, https://example.com/api).");}return r;
}
export function transformDeveloperTool(op:DeveloperOperation,s:string,o:{mode?:string;pattern?:string;flags?:string;delimiter?:string}={}):string{
 guard(s);switch(op){case "regex":{if(!o.pattern)throw new Error("Enter a regular expression.");if(s.length>50000)throw new Error("Regex input is limited to 50,000 characters.");const flags=[...new Set((o.flags||"g").split(""))].join("");if(/[^dgimsuvy]/.test(flags)||(flags.includes("u")&&flags.includes("v")))throw new Error("One or more regular-expression flags are unsupported or incompatible.");const re=new RegExp(o.pattern,flags),matches:{match:string;index:number;groups:string[]}[]=[];let m:RegExpExecArray|null;while((m=re.exec(s))&&matches.length<500){matches.push({match:m[0],index:m.index,groups:m.slice(1)});if(!re.global&&!re.sticky)break;if(m[0]==="")re.lastIndex++;}return JSON.stringify({count:matches.length,truncated:matches.length===500,matches},null,2);}
 case "xml":return formatXml(s,o.mode==="minify");case "sql":return formatSql(s,o.mode==="minify");case "html":return formatHtml(s,o.mode==="minify");case "csv-json":return o.mode==="json-to-csv"?jsonToCsv(s,o.delimiter||","):csvToJson(s,o.delimiter||",");
 case "curl":{const r=parseCurl(s),headers=r.headers.map(([k,v])=>[k,/authorization|cookie|token|secret|api[-_]?key/i.test(k)?"[REDACTED]":v]);const body=r.body&&/token|secret|password|api[-_]?key/i.test(r.body)?"[REDACTED]":r.body;const options={method:r.method,headers:Object.fromEntries(headers),...(body?{body}:{})};return JSON.stringify({request:{...r,headers,body},javascriptFetch:"fetch("+JSON.stringify(r.url)+", "+JSON.stringify(options,null,2)+");",note:"Generated text only. This tool never sends the request. Review redacted values and unsupported flags before use."},null,2);}
 case "hash":throw new Error("Use the browser cryptography API for hash generation.");}
}
