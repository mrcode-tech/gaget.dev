import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { SampleDataGeneratorWorkbench } from "@/components/sample-data-generator-workbench";
export const metadata:Metadata={title:"Sample Data Generator",description:"Generate synthetic JSON records, random strings and integers, timestamps, and UUIDs locally in your browser.",alternates:{canonical:"/generators/sample-data"}};
export default function SampleDataGeneratorPage(){return <ToolLayout category="Generators" title="Sample Data Generator" description="Create bounded synthetic test data locally, without uploading source data."><SampleDataGeneratorWorkbench/></ToolLayout>;}
