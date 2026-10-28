import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WorkflowPipelineWorkbench } from "@/components/workflow-pipeline-workbench";
vi.mock("@/lib/tools/workflow-worker-client",async()=>{
 const pipeline=await import("@/lib/tools/workflow-pipeline");
 return {executeWorkflowInWorker:async(input:string,recipe:import("@/lib/tools/workflow-pipeline").PipelineRecipe,batch:boolean,signal?:AbortSignal)=>{
  if(batch)return {output:await pipeline.executeBatchAsync(input,recipe,signal),steps:[]};
  return pipeline.executePipelineAsync(input,recipe,signal);
 }};
});
afterEach(cleanup);
async function selectOption(name:RegExp){const option=await screen.findByRole("option",{name});fireEvent.pointerDown(option,{button:0,pointerType:"mouse",ctrlKey:false});fireEvent.pointerUp(option,{button:0,pointerType:"mouse",ctrlKey:false});}
it("runs the default typed workflow and shows final output",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));const output=screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement;await waitFor(()=>expect(output.value).toBe("Hello%20GaGet.dev!"));});
it("shows intermediate results after a successful run",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));await waitFor(()=>expect(screen.getByText(/Intermediate results/i)).toBeTruthy());});

it("cancels a running batch and discards partial results",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Batch by lines: off/i}));fireEvent.change(screen.getByRole("textbox",{name:"Workflow input"}),{target:{value:Array.from({length:100},(_,i)=>"line"+i).join("\n")}});fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));fireEvent.click(screen.getByRole("button",{name:/Cancel run/i}));expect((await screen.findByRole("alert")).textContent).toMatch(/Workflow cancelled/i);expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("");});

it("loads a local binary file as raw hex, preserves bytes, and offers a binary download",async()=>{
 render(<WorkflowPipelineWorkbench/>);
 const encodeRecipe=new File([JSON.stringify({version:1,inputType:"raw-hex",steps:[{operation:"bytes-base64-encode"}]})],"encode.json",{type:"application/json"}); Object.defineProperty(encodeRecipe,"text",{value:async()=>JSON.stringify({version:1,inputType:"raw-hex",steps:[{operation:"bytes-base64-encode"}]})});
 fireEvent.change(screen.getByLabelText("Import workflow recipe"),{target:{files:[encodeRecipe]}});
 await waitFor(()=>expect(screen.getByLabelText("Choose a workflow input file")).toBeTruthy());
 const file=new File([new Uint8Array([0,255,1])],"binary.bin");
 Object.defineProperty(file,"arrayBuffer",{value:async()=>Uint8Array.from([0,255,1]).buffer});
 fireEvent.change(screen.getByLabelText("Choose a workflow input file"),{target:{files:[file]}});
 const input=screen.getByRole("textbox",{name:"Workflow input"}) as HTMLTextAreaElement;
 await waitFor(()=>expect(input.value).toBe("00ff01"));
 expect(screen.getByText(/Loaded binary\.bin as raw bytes \(3 bytes\)/i)).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));
 await waitFor(()=>expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("AP8B"));
 const decodeRecipe=new File([JSON.stringify({version:1,inputType:"base64",steps:[{operation:"base64-bytes-decode"}]})],"decode.json",{type:"application/json"}); Object.defineProperty(decodeRecipe,"text",{value:async()=>JSON.stringify({version:1,inputType:"base64",steps:[{operation:"base64-bytes-decode"}]})});
 fireEvent.change(screen.getByLabelText("Import workflow recipe"),{target:{files:[decodeRecipe]}});
 await waitFor(()=>expect(screen.getByRole("combobox",{name:"Workflow input type"}).textContent).toMatch(/Base64/i));
 fireEvent.change(input,{target:{value:"AP8B"}});
 fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));
 await waitFor(()=>expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("00ff01"));
 expect(screen.getByRole("button",{name:/Download raw bytes/i})).toBeTruthy();
});
