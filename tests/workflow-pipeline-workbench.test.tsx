import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WorkflowPipelineWorkbench } from "@/components/workflow-pipeline-workbench";
afterEach(cleanup);
it("runs the default typed workflow and shows final output",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));const output=screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement;await waitFor(()=>expect(output.value).toBe("Hello%20GaGet.dev!"));});
it("shows intermediate results after a successful run",async()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));await waitFor(()=>expect(screen.getByText(/Intermediate results/i)).toBeTruthy());});
