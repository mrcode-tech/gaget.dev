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
it("runs the default typed workflow and shows final output",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));const output=screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement;await waitFor(()=>expect(output.value).toBe("Hello%20GaGet.dev!"));});
it("shows intermediate results after a successful run",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));await waitFor(()=>expect(screen.getByText(/Intermediate results/i)).toBeTruthy());});

it("cancels a running batch and discards partial results",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Batch by lines: off/i}));fireEvent.change(screen.getByRole("textbox",{name:"Workflow input"}),{target:{value:Array.from({length:100},(_,i)=>"line"+i).join("\n")}});fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));fireEvent.click(screen.getByRole("button",{name:/Cancel run/i}));expect((await screen.findByRole("alert")).textContent).toMatch(/Workflow cancelled/i);expect((screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement).value).toBe("");});
