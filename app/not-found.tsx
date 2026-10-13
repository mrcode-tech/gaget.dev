import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
    <div className="rounded-2xl bg-primary/10 p-4 text-primary"><Search className="h-8 w-8" /></div>
    <p className="mt-6 text-sm font-semibold text-primary">404 · Not found</p>
    <h1 className="mt-2 text-3xl font-bold tracking-tight">This tool went missing.</h1>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">The page may have moved, or the URL may be incorrect. Head back to the toolbox to find what you need.</p>
    <Button asChild className="mt-6"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to GaGet.dev</Link></Button>
  </main>;
}
