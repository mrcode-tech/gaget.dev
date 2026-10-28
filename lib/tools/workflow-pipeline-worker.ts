import { executeBatchAsync, executePipelineAsync, validatePipelineRecipe, type PipelineRecipe } from "./workflow-pipeline";
type Request={input:string;recipe:unknown;batch:boolean};
type Response={output?:string;steps?:unknown[];error?:string};
type WorkerScope={addEventListener(type:"message",listener:(event:MessageEvent<Request>)=>void):void;postMessage(message:Response):void};
const scope=self as unknown as WorkerScope;
scope.addEventListener("message",async event=>{
 try{
  const request=event.data;
  if(!request||typeof request.input!=="string"||typeof request.batch!=="boolean")throw new Error("Invalid workflow worker request.");
  const recipe:PipelineRecipe=validatePipelineRecipe(request.recipe);
  if(request.batch&&(recipe.inputType==="json"||recipe.inputType==="query"))throw new Error("Batch mode is available only for line-oriented text representations.");
  const result=request.batch?{output:await executeBatchAsync(request.input,recipe),steps:[]}:await executePipelineAsync(request.input,recipe);
  scope.postMessage({output:result.output,steps:result.steps});
 }catch(error){scope.postMessage({error:error instanceof Error?error.message:"Unable to execute workflow."});}
});
