import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WorkflowPipelineWorkbench } from "@/components/workflow-pipeline-workbench";
afterEach(cleanup);
it("runs the default typed workflow and shows final output",()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));const output=screen.getByRole("textbox",{name:"Workflow final output"}) as HTMLTextAreaElement;expect(output.value).toBe("Hello%20GaGet.dev!");});
it("shows intermediate results after a successful run",()=>{render(<WorkflowPipelineWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Run workflow/i}));expect(screen.getByText(/Intermediate results/i)).toBeTruthy();});
