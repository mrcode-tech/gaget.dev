import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { ExtendedWorkbench } from "@/components/extended-workbench";
export const metadata: Metadata = { title: "Data, Binary & Math Workbench", description: "Parse query strings, inspect bytes, convert number bases, calculate statistics, and compress text or files locally.", alternates: { canonical: "/data/binary-math" } };
export default function BinaryMathPage(){return <ToolLayout category="Data Formats" title="Data, Binary & Math Workbench" description="Convert common representations, inspect byte streams, and perform bounded numeric operations in your browser."><ExtendedWorkbench group="data"/></ToolLayout>;}
