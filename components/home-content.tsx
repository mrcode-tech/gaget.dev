"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Command, Search, ShieldCheck, Sparkles, Zap, Braces, Link2, Binary, KeyRound, Fingerprint, Hash, Regex, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/tools/registry";

const featuredIcons = [Braces, Link2, Binary, KeyRound, Fingerprint, Hash, Regex, Database];
const benefits = [
  { icon: Zap, title: "Fast by design", detail: "Instant browser-side tools" },
  { icon: ShieldCheck, title: "Privacy first", detail: "No account required" },
  { icon: Check, title: "Made for developers", detail: "Focused, practical utilities" },
  { icon: Sparkles, title: "One consistent UI", detail: "A familiar workflow everywhere" },
];

export function HomeContent() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => !q || `${tool.name} ${tool.description} ${tool.category} ${tool.keywords.join(" ")}`.toLowerCase().includes(q));
  }, [query]);
  const featured = filtered.filter((t) => ["JSON Formatter", "URL Encoder / Decoder", "Base64 Encoder / Decoder", "JWT Decoder", "UUID Generator", "Hash Generator", "Regex Tester", "SQL Formatter"].includes(t.name));
  return <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-9 sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[18%] top-24 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"><Sparkles className="h-3.5 w-3.5" /> Your all-in-one developer toolbox</div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">Essential developer tools, <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">all in one place.</span></h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Simple, fast utilities to format, decode, validate, compare, and generate the things you work with every day.</p>
        <div className="relative mt-7 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a tool — JSON formatter, JWT decoder, Base64…" className="h-14 rounded-xl bg-background pl-12 pr-24 text-sm shadow-soft" aria-label="Search all developer tools" />
          <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground sm:flex"><Command className="h-3 w-3" /> Search</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Popular:</span>{["JSON", "JWT", "URL encode", "Base64"].map((tag) => <button key={tag} onClick={() => setQuery(tag)} className="rounded-full border border-border px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground">{tag}</button>)}</div>
      </div>
    </section>

    <section className="grid grid-cols-2 gap-3 py-6 lg:grid-cols-4">
      {benefits.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3.5 sm:p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span><span><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span></span></div>)}
    </section>

    <section id="popular-tools" className="scroll-mt-24 pt-4">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div><p className="eyebrow">Start here</p><h2 className="mt-1 text-2xl font-bold tracking-tight">{query ? "Search results" : "Popular tools"}</h2><p className="mt-1 text-sm text-muted-foreground">{query ? `${filtered.length} matching tools` : "Handy utilities for your everyday workflow."}</p></div>
        {!query && <Button variant="ghost" size="sm" asChild><Link href="#all-tools">Explore all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}
      </div>
      {featured.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{(query ? filtered : featured).map((tool) => <ToolCard key={tool.href} tool={tool} />)}</div> : <div className="surface p-8 text-center"><p className="font-semibold">No tools found</p><p className="mt-1 text-sm text-muted-foreground">Try another search term.</p><Button variant="outline" className="mt-4" onClick={() => setQuery("")}>Clear search</Button></div>}
    </section>

    <section id="all-tools" className="scroll-mt-24 pt-12">
      <div className="mb-5"><p className="eyebrow">Browse the collection</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Explore all tools</h2><p className="mt-1 text-sm text-muted-foreground">More utilities are planned and will be added over time.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{tools.filter((tool) => !featured.some((f) => f.href === tool.href) || tool.status === "planned").map((tool) => <ToolCard key={tool.href} tool={tool} />)}</div>
    </section>
    <footer className="mt-14 flex flex-col gap-2 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} GaGet.dev. Tools for everyday development.</p><p>Built for speed, clarity, and privacy.</p></footer>
  </main>;
}
