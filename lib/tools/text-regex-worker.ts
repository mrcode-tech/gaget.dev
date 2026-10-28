import { transformText, type TextOperation, type TextOperationOptions } from "./text-operations";
type RegexWorkerRequest={operation:TextOperation;input:string;options:TextOperationOptions};
type WorkerScope={addEventListener(type:"message",listener:(event:MessageEvent<RegexWorkerRequest>)=>void):void;postMessage(message:{output?:string;error?:string}):void};
const scope=self as unknown as WorkerScope;
scope.addEventListener("message",event=>{
 const {operation,input,options}=event.data;
 if(!["regex-test","regex-replace","find-replace"].includes(operation)){scope.postMessage({error:"Unsupported isolated regex operation."});return;}
 try{scope.postMessage({output:transformText(operation,input,options)});}
 catch(cause){scope.postMessage({error:cause instanceof Error?cause.message:"Unable to process the regular expression."});}
});
