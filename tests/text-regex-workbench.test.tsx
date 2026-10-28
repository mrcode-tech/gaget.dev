import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { transformText, type TextOperation, type TextOperationOptions } from "@/lib/tools/text-operations";
import { TextRegexWorkbench } from "@/components/text-regex-workbench";
type Request={operation:TextOperation;input:string;options:TextOperationOptions};
class MockWorker {
  onmessage:((event:MessageEvent<{output?:string;error?:string}>)=>void)|null=null;
  onerror:((event:ErrorEvent)=>void)|null=null;
  postMessage(request:Request){queueMicrotask(()=>{try{this.onmessage?.({data:{output:transformText(request.operation,request.input,request.options)}} as MessageEvent<{output?:string;error?:string}>);}catch(cause){this.onmessage?.({data:{error:cause instanceof Error?cause.message:"worker error"}} as MessageEvent<{output?:string;error?:string}>);}});}
  terminate(){}
}
beforeEach(()=>vi.stubGlobal("Worker",MockWorker));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it("shows actionable regex errors without changing the source text",async()=>{
  render(<TextRegexWorkbench />);
  const input=screen.getByRole("textbox",{name:"Text input"}) as HTMLTextAreaElement;
  fireEvent.change(screen.getByRole("textbox",{name:"Regular expression pattern"}),{target:{value:"["}});
  fireEvent.click(screen.getByRole("button",{name:"Process"}));
  await waitFor(()=>expect(screen.getByRole("alert").textContent).toMatch(/regular expression/i));
  expect(input.value).toContain("Hello world");
});
