import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WorkflowPipelineWorkbench } from "@/components/workflow-pipeline-workbench";
vi.mock("@/lib/tools/workflow-worker-client",async()=>{
 const pipeline=await import("@/lib/tools/workflow-pipeline");
 return {executeWorkflowInWorker:async(input:string,recipe:import("@/lib/tools/workflow-pipeline").PipelineRecipe,batch:boolean,signal?:AbortSignal)=>{
  if(batch)return {output:await pipeline.executeBatchAsync(input,recipe,signal),steps:[]};
  return pipeline.executePipelineAsync(input,recipe,signal);
 }};
});
const originalElementScrollIntoView=Element.prototype.scrollIntoView;
const originalHtmlScrollIntoView=HTMLElement.prototype.scrollIntoView;
beforeEach(()=>{Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});Object.defineProperty(HTMLElement.prototype,"scrollIntoView",{configurable:true,value:vi.fn()});});
afterEach(()=>{cleanup();vi.unstubAllGlobals();if(originalElementScrollIntoView)Object.defineProperty(Element.prototype,"scrollIntoView",{configurable:true,value:originalElementScrollIntoView});else delete (Element.prototype as unknown as {scrollIntoView?:()=>void}).scrollIntoView;if(originalHtmlScrollIntoView)Object.defineProperty(HTMLElement.prototype,"scrollIntoView",{configurable:true,value:originalHtmlScrollIntoView});else delete (HTMLElement.prototype as unknown as {scrollIntoView?:()=>void}).scrollIntoView;});
async function selectOption(name:RegExp){const option=await screen.findByRole("option",{name});fireEvent.pointerDown(option,{button:0,pointerType:"mouse",ctrlKey:false});fireEvent.pointerUp(option,{button:0,pointerType:"mouse",ctrlKey:false});}
it("runs the default typed workflow and shows final output",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));const output=screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement;await waitFor(()=>expect(output.value).toBe("Hello%20GaGet.dev!"));});
it("shows intermediate results after a successful run",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));await waitFor(()=>expect(screen.getByText(/Intermediate results/i)).toBeTruthy());});

it("cancels a running batch and discards partial results",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Batch by lines: off/i}));fireEvent.change(screen.getByRole("textbox",{name:"Workflow input"}),{target:{value:Array.from({length:100},(_,i)=>"line"+i).join("\n")}});fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));fireEvent.click(screen.getByRole("button",{name:/Cancel run/i}));expect((await screen.findByRole("alert")).textContent).toMatch(/Workflow cancelled/i);expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("");});

it("loads a local binary file as raw hex and converts bytes without UTF-8 decoding",async()=>{
 render(<WorkflowPipelineWorkbench/>);
 fireEvent.click(screen.getByRole("combobox",{name:"Workflow input type"}));
 await selectOption(/Raw bytes \(hex; byte-preserving\)/i);
 const file=new File([new Uint8Array([0,255,1])],"binary.bin");
 Object.defineProperty(file,"arrayBuffer",{value:async()=>Uint8Array.from([0,255,1]).buffer});
 fireEvent.change(screen.getByLabelText("Choose a workflow input file"),{target:{files:[file]}});
 const input=screen.getByRole("textbox",{name:"Workflow input"}) as HTMLTextAreaElement;
 await waitFor(()=>expect(input.value).toBe("00ff01"));
 expect(screen.getByText(/Loaded binary\.bin as raw bytes \(3 bytes\)/i)).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:/Add step/i}));
 fireEvent.click(screen.getByRole("combobox",{name:"Step 1 operation"}));
 await selectOption(/Raw bytes → Base64/i);
 fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));
 await waitFor(()=>expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("AP8B"));
 fireEvent.click(screen.getByRole("button",{name:/Add step/i}));
 fireEvent.click(screen.getByRole("combobox",{name:"Step 2 operation"}));
 await selectOption(/Base64 → raw bytes \(hex\)/i);
 fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));
 await waitFor(()=>expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("00ff01"));
 expect(screen.getByRole("button",{name:/Download raw bytes/i})).toBeTruthy();
});
