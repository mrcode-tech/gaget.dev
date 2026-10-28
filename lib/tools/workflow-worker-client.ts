import type { PipelineRecipe, PipelineStepResult } from "./workflow-pipeline";
export type WorkflowWorkerResult={output:string;steps:PipelineStepResult[]};
type WorkflowWorkerResponse={output?:unknown;steps?:unknown;error?:unknown};
export const WORKFLOW_WORKER_TIMEOUT_MS=15_000;
export function executeWorkflowInWorker(input:string,recipe:PipelineRecipe,batch:boolean,signal?:AbortSignal,timeoutMs=WORKFLOW_WORKER_TIMEOUT_MS):Promise<WorkflowWorkerResult>{
 if(signal?.aborted)return Promise.reject(new Error("Workflow cancelled."));
 if(typeof Worker==="undefined")return Promise.reject(new Error("Isolated workflow processing is not supported in this browser."));
 return new Promise((resolve,reject)=>{
  let worker:Worker;
  try{worker=new Worker(new URL("./workflow-pipeline-worker.ts",import.meta.url),{type:"module"});}
  catch{return reject(new Error("Unable to start the isolated workflow worker."));}
  let settled=false;
  const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener("abort",onAbort);worker.terminate();};
  const finish=(error?:Error,result?:WorkflowWorkerResult)=>{
   if(settled)return;settled=true;cleanup();
   if(error)reject(error);else if(result)resolve(result);else reject(new Error("Workflow worker returned an empty result."));
  };
  const onAbort=()=>finish(new Error("Workflow cancelled."));
  const timer=setTimeout(()=>finish(new Error("Workflow exceeded "+timeoutMs+" ms and was stopped. Reduce input size or the number of steps.")),timeoutMs);
  signal?.addEventListener("abort",onAbort,{once:true});
  worker.onmessage=(event:MessageEvent<WorkflowWorkerResponse>)=>{
   const data=event.data;
   if(data&&typeof data.error==="string"){finish(new Error(data.error));return;}
   if(data&&typeof data.output==="string"&&Array.isArray(data.steps)){finish(undefined,{output:data.output,steps:data.steps as PipelineStepResult[]});return;}
   finish(new Error("Workflow worker returned an invalid response."));
  };
  worker.onerror=()=>finish(new Error("Workflow worker failed; simplify the input or recipe and try again."));
  worker.onmessageerror=()=>finish(new Error("Workflow worker returned data that could not be read."));
  if(signal?.aborted){onAbort();return;}
  try{worker.postMessage({input,recipe,batch});}catch{finish(new Error("Unable to send input to the workflow worker."));}
 });
}
