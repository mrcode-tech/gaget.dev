import { afterEach, describe, expect, it, vi } from "vitest";
import { executeWorkflowInWorker } from "@/lib/tools/workflow-worker-client";
class FakeWorker {
 static instances:FakeWorker[]=[];
 static response:unknown={output:"ok",steps:[]};
 static autoRespond=true;
 onmessage:((event:MessageEvent)=>void)|null=null;
 onerror:((event:ErrorEvent)=>void)|null=null;
 onmessageerror:((event:MessageEvent)=>void)|null=null;
 terminated=false;
 request:unknown;
 constructor(){FakeWorker.instances.push(this);}
 postMessage(request:unknown){this.request=request;if(FakeWorker.autoRespond)queueMicrotask(()=>this.onmessage?.({data:FakeWorker.response} as MessageEvent));}
 terminate(){this.terminated=true;}
}
const recipe={version:1 as const,inputType:"text" as const,steps:[{operation:"trim" as const}]};
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();FakeWorker.instances=[];FakeWorker.response={output:"ok",steps:[]};FakeWorker.autoRespond=true;});
describe("workflow worker client",()=>{
 it("executes the typed recipe in a worker and terminates after a valid response",async()=>{
  vi.stubGlobal("Worker",FakeWorker);
  await expect(executeWorkflowInWorker("  input  ",recipe,false)).resolves.toEqual({output:"ok",steps:[]});
  expect(FakeWorker.instances).toHaveLength(1);expect(FakeWorker.instances[0].request).toMatchObject({input:"  input  ",batch:false});expect(FakeWorker.instances[0].terminated).toBe(true);
 });
 it("rejects and terminates when cancellation is requested",async()=>{
  vi.stubGlobal("Worker",FakeWorker);FakeWorker.autoRespond=false;const controller=new AbortController();
  const promise=executeWorkflowInWorker("input",recipe,false,controller.signal);controller.abort();
  await expect(promise).rejects.toThrow(/cancelled/i);expect(FakeWorker.instances[0].terminated).toBe(true);
 });
 it("stops a worker when its deadline expires",async()=>{
  vi.useFakeTimers();vi.stubGlobal("Worker",FakeWorker);FakeWorker.autoRespond=false;
  const promise=executeWorkflowInWorker("input",recipe,false,undefined,50);const rejection=expect(promise).rejects.toThrow(/exceeded 50 ms/i);
  await vi.advanceTimersByTimeAsync(50);await rejection;expect(FakeWorker.instances[0].terminated).toBe(true);
 });
 it("rejects malformed worker responses and worker errors",async()=>{
  vi.stubGlobal("Worker",FakeWorker);FakeWorker.response={output:4,steps:[]};
  await expect(executeWorkflowInWorker("input",recipe,false)).rejects.toThrow(/invalid response/i);
  FakeWorker.response={error:"Recipe rejected"};
  await expect(executeWorkflowInWorker("input",recipe,false)).rejects.toThrow(/Recipe rejected/);
 });
 it("fails closed when Worker is unavailable",async()=>{
  vi.stubGlobal("Worker",undefined);
  await expect(executeWorkflowInWorker("input",recipe,false)).rejects.toThrow(/not supported/i);
 });
});
