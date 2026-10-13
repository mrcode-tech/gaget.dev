import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const colorStyles = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const planned = tool.status === "planned";
  return <Link href={planned ? "/#popular-tools" : tool.href} className="group surface flex min-h-[112px] gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colorStyles[tool.color])}><Icon className="h-5 w-5" /></span>
    <span className="min-w-0 flex-1">
      <span className="flex items-start justify-between gap-1"><span className="text-sm font-semibold">{tool.name}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{tool.description}</span>
      {planned && <Badge variant="secondary" className="mt-2 text-[10px]">Planned</Badge>}
    </span>
  </Link>;
}
