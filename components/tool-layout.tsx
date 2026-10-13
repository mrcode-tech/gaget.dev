import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ToolLayout({ category, title, description, children }: { category: string; title: string; description: string; children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-10">
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
      <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground"><Home className="h-3.5 w-3.5" /> Home</Link><ChevronRight className="h-3 w-3" /><span>{category}</span><ChevronRight className="h-3 w-3" /><span className="font-medium text-foreground">{title}</span>
    </nav>
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div><Badge variant="secondary">{category}</Badge><h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>
      <Badge variant="outline" className="w-fit shrink-0">Runs in your browser</Badge>
    </div>
    {children}
    <section className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
      <h2 className="text-sm font-semibold">About this tool</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description} GaGet.dev is designed to keep everyday developer tasks simple. Do not paste secrets or production credentials into tools unless you understand how the data is handled.</p>
    </section>
  </main>;
}
