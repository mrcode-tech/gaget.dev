import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { DataGeneratorWorkbench } from "@/components/sample-data-generator-workbench";
export const metadata:Metadata={title:"Data Generator",description:"Generate synthetic JSON records, random strings and integers, timestamps, and UUIDs locally in your browser.",alternates:{canonical:"/generators/sample-data"}};
export default function SampleDataGeneratorPage(){return <ToolLayout category="Generators" title="Data Generator" description="Create bounded synthetic test data locally, without uploading source data."><SampleDataGeneratorWorkbench/></ToolLayout>;}
