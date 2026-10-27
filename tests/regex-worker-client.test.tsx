import { afterEach, expect, it, vi } from "vitest";
import { runRegexInWorker } from "@/lib/tools/regex-worker-client";
const workers:Array<{terminated:boolean;onmessage:((event:MessageEvent<{output?:string;error?:string}>)=>void)|null}>=[];
class SilentWorker {
 onmessage:((event:MessageEvent<{output?:string;error?:string}>)=>void)|null=null;
 onerror:((event:ErrorEvent)=>void)|null=null;
 terminated=false;
 constructor(){workers.push(this);}
 postMessage(){}
 terminate(){this.terminated=true;}
}
afterEach(()=>{vi.unstubAllGlobals();workers.length=0;});
it("terminates an unresponsive regex worker at the time limit",async()=>{
 vi.stubGlobal("Worker",SilentWorker);
 await expect(runRegexInWorker({operation:"regex-test",input:"x",options:{pattern:"x"}},10)).rejects.toThrow(/exceeded 10 ms/i);
 expect(workers[0]?.terminated).toBe(true);
});
it("returns a worker result and terminates the worker",async()=>{
 class ResultWorker extends SilentWorker {
  postMessage(){queueMicrotask(()=>this.onmessage?.({data:{output:"ok"}} as MessageEvent<{output?:string;error?:string}>));}
 }
 vi.stubGlobal("Worker",ResultWorker);
 await expect(runRegexInWorker({operation:"regex-test",input:"x",options:{pattern:"x"}})).resolves.toBe("ok");
 expect(workers[0]?.terminated).toBe(true);
});
