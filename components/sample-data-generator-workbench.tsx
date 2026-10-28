"use client";
import { useState } from "react";
import { Copy, Download, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSampleData, type SampleGeneratorOperation } from "@/lib/tools/sample-data-generator";
const operations:{value:SampleGeneratorOperation;label:string}[]=[{value:"random-string",label:"Random string"},{value:"random-integer",label:"Random integer"},{value:"timestamp",label:"Timestamp formats"},{value:"sample-json",label:"Synthetic JSON records"},{value:"uuid",label:"UUID v4 identifiers"}];
export function DataGeneratorWorkbench(){
 const [operation,setOperation]=useState<SampleGeneratorOperation>("sample-json"),[length,setLength]=useState("24"),[count,setCount]=useState("5"),[min,setMin]=useState("0"),[max,setMax]=useState("100"),[output,setOutput]=useState(""),[error,setError]=useState("");
 function run(){try{setOutput(generateSampleData(operation,{length:Number(length),count:Number(count),min:Number(min),max:Number(max)}));setError("");}catch(e){setOutput("");setError(e instanceof Error?e.message:"Unable to generate sample data.");}}
 async function copy(){try{await navigator.clipboard.writeText(output);}catch{setError("Clipboard access is unavailable. Select and copy the output manually.");}}
 function download(){const url=URL.createObjectURL(new Blob([output],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="gaget-data-"+operation+".txt";a.click();URL.revokeObjectURL(url);}
 return <section className="space-y-4" aria-label="Sample data generator"><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Generator<Select value={operation} onValueChange={v=>{setOperation(v as SampleGeneratorOperation);setOutput("");setError("");}}><SelectTrigger aria-label="Data generator operation"><SelectValue/></SelectTrigger><SelectContent>{operations.map(op=><SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}</SelectContent></Select></label>
 {operation==="random-string"&&<label className="space-y-1 text-sm font-medium">Length (1–4096)<Input type="number" min={1} max={4096} value={length} onChange={e=>setLength(e.target.value)} aria-label="Random string length"/></label>}
 {operation==="random-integer"&&<><label className="space-y-1 text-sm font-medium">Minimum<Input type="number" value={min} onChange={e=>setMin(e.target.value)} aria-label="Minimum random integer"/></label><label className="space-y-1 text-sm font-medium">Maximum<Input type="number" value={max} onChange={e=>setMax(e.target.value)} aria-label="Maximum random integer"/></label></>}
 {["sample-json","uuid"].includes(operation)&&<label className="space-y-1 text-sm font-medium">Count (1–100)<Input type="number" min={1} max={100} value={count} onChange={e=>setCount(e.target.value)} aria-label="Generated record count"/></label>}</div>
 <div className="flex flex-wrap gap-2"><Button type="button" onClick={run}><Play className="mr-1 h-4 w-4"/>Generate</Button><Button type="button" variant="outline" onClick={()=>{setOutput("");setError("");}}><Trash2 className="mr-1 h-4 w-4"/>Clear</Button><Button type="button" variant="outline" disabled={!output} onClick={copy}><Copy className="mr-1 h-4 w-4"/>Copy</Button><Button type="button" variant="outline" disabled={!output} onClick={download}><Download className="mr-1 h-4 w-4"/>Download</Button></div>
 <Card><CardHeader><CardTitle className="text-sm">Generated output</CardTitle></CardHeader><CardContent><Textarea readOnly value={output} aria-label="Generated sample output" className="min-h-64 font-mono text-xs leading-6" placeholder="Generate to see output." />{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</CardContent></Card>
 <p className="text-xs leading-5 text-muted-foreground">Values are synthetic and generated in this browser tab. Random strings, integers and UUIDs use the browser cryptographic random API when available; random data is not a password-strength recommendation. Timestamps reflect the device clock and are not trusted time. No data is uploaded or saved.</p></section>;
}
