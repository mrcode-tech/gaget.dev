import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { WorkflowPipelineWorkbench } from "@/components/workflow-pipeline-workbench";
export const metadata: Metadata = { title: "Batch Workbench", description: "Build and run typed browser-local pipelines from compatible operations without arbitrary code execution.", alternates: { canonical: "/workflow/pipeline" } };
export default function WorkflowPipelinePage(){return <ToolLayout category="Web & API" title="Batch Workbench" description="Chain compatible text and encoding operations locally, inspect intermediate outputs, and export validated recipes."><WorkflowPipelineWorkbench/></ToolLayout>;}
