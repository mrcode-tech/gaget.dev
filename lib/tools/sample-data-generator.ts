export type SampleGeneratorOperation="random-string"|"random-integer"|"timestamp"|"sample-json"|"uuid";
export type SampleGeneratorOptions={length?:number;count?:number;min?:number;max?:number};
function cryptoApi():Crypto{if(!globalThis.crypto?.getRandomValues)throw new Error("Browser cryptographic randomness is unavailable.");return globalThis.crypto;}
function randomInteger(min:number,max:number):number{
 if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max)||max<min||max-min>1_000_000_000)throw new Error("Integer range must be valid and no wider than 1,000,000,000.");
 const range=max-min+1,limit=Math.floor(0x1_0000_0000/range)*range,crypto=cryptoApi();let n=0;
 do{const value=new Uint32Array(1);crypto.getRandomValues(value);n=value[0];}while(n>=limit);
 return min+(n%range);
}
function uuidV4():string{
 const crypto=cryptoApi();if(typeof crypto.randomUUID==="function")return crypto.randomUUID();
 const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
 return hex.slice(0,8)+"-"+hex.slice(8,12)+"-"+hex.slice(12,16)+"-"+hex.slice(16,20)+"-"+hex.slice(20);
}
function randomText(length:number):string{
 if(!Number.isInteger(length)||length<1||length>4096)throw new Error("Random string length must be between 1 and 4,096 characters.");
 const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",limit=256-(256%alphabet.length),out:string[]=[],crypto=cryptoApi();
 while(out.length<length){const bytes=crypto.getRandomValues(new Uint8Array(Math.min(1024,Math.max(32,(length-out.length)*2))));for(const byte of bytes){if(byte>=limit)continue;out.push(alphabet[byte%alphabet.length]);if(out.length===length)break;}}
 return out.join("");
}
export function generateSampleData(operation:SampleGeneratorOperation,options:SampleGeneratorOptions={}):string{
 const count=options.count??5;if(!Number.isInteger(count)||count<1||count>100)throw new Error("Generate between 1 and 100 records or identifiers.");
 switch(operation){
  case "random-string":return randomText(options.length??24);
  case "random-integer":return String(randomInteger(options.min??0,options.max??100));
  case "timestamp":{const now=new Date();return JSON.stringify({iso:now.toISOString(),unixSeconds:Math.floor(now.getTime()/1000),unixMilliseconds:now.getTime(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone||"unknown",note:"Timestamp reflects the device clock; it is not a trusted time source."},null,2);}
  case "sample-json":return JSON.stringify(Array.from({length:count},(_,i)=>({id:uuidV4(),name:"Sample User "+(i+1),email:"user"+(i+1)+"@example.test",active:randomInteger(0,1)===1,createdAt:new Date(Date.now()-i*60_000).toISOString()})),null,2);
  case "uuid":return Array.from({length:count},()=>uuidV4()).join("\n");
 }
}
