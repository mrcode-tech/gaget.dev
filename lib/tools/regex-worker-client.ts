import type { TextOperation, TextOperationOptions } from "./text-operations";
export type RegexWorkerRequest={operation:Extract<TextOperation,"regex-test"|"regex-replace"|"find-replace">;input:string;options:TextOperationOptions};
type RegexWorkerResponse={output?:string;error?:string};
export const REGEX_WORKER_TIMEOUT_MS=1_000;
export function runRegexInWorker(request:RegexWorkerRequest,timeoutMs=REGEX_WORKER_TIMEOUT_MS):Promise<string>{
 if(typeof Worker==="undefined")return Promise.reject(new Error("Isolated regex processing is not supported in this browser."));
 return new Promise((resolve,reject)=>{
  let worker:Worker;
  try{worker=new Worker(new URL("./text-regex-worker.ts",import.meta.url),{type:"module"});}
  catch{return reject(new Error("Unable to start the isolated regex worker."));}
  let settled=false;
  const finish=(error?:Error,output?:string)=>{
   if(settled)return;settled=true;clearTimeout(timer);worker.terminate();
   if(error)reject(error);else resolve(output??"");
  };
  const timer=setTimeout(()=>finish(new Error("Regex processing exceeded "+timeoutMs+" ms and was stopped. Simplify the pattern or shorten the input.")),timeoutMs);
  worker.onmessage=(event:MessageEvent<RegexWorkerResponse>)=>{
   if(event.data?.error)finish(new Error(event.data.error));
   else if(typeof event.data?.output==="string")finish(undefined,event.data.output);
   else finish(new Error("Regex worker returned an invalid response."));
  };
  worker.onerror=()=>finish(new Error("Regex worker failed; simplify the pattern or shorten the input."));
  try{worker.postMessage(request);}catch{finish(new Error("Unable to send input to the regex worker."));}
 });
}
