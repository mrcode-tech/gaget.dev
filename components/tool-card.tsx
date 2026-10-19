"use client";
import { ArrowUpRight, Star } from "lucide-react";
import type { Tool } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { useFavorites } from "@/lib/tools/use-favorites";
const colors = { blue:"bg-blue-500/10 text-blue-600 dark:text-blue-400", green:"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", violet:"bg-violet-500/10 text-violet-600 dark:text-violet-400", rose:"bg-rose-500/10 text-rose-600 dark:text-rose-400", orange:"bg-orange-500/10 text-orange-600 dark:text-orange-400", cyan:"bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" };
export function ToolCard({tool}:{tool:Tool}) {
  const Icon=tool.icon; const planned=tool.status==="planned"; const {t}=useI18n();
  const {favorites,toggleFavorite}=useFavorites(); const isFavorite=favorites.includes(tool.href);
  const descriptionKey=`toolDescription.${tool.name}`; const translatedDescription=t(descriptionKey);
  const description=translatedDescription===descriptionKey?tool.description:translatedDescription;
  const cls="group surface flex min-h-[112px] gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const content=<><span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",colors[tool.color])}><Icon className="h-5 w-5"/></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-1 pr-7"><span className="text-sm font-semibold">{t(`toolName.${tool.name}`)}</span>{!planned&&<ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"/>}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>{planned&&<Badge variant="secondary" className="mt-2 text-[10px]">{t("catalog.planned")}</Badge>}</span></>;
  return <div className="relative">{planned?<div aria-disabled="true" className={cn(cls,"cursor-default opacity-80 hover:translate-y-0 hover:shadow-none")}>{content}</div>:<LocaleLink href={tool.href} className={cls}>{content}</LocaleLink>}{!planned&&<button type="button" aria-label={isFavorite?`Remove ${tool.name} from favorites`:`Add ${tool.name} to favorites`} aria-pressed={isFavorite} title={isFavorite?"Remove from favorites":"Add to favorites"} onClick={()=>toggleFavorite(tool.href)} className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Star className={cn("h-4 w-4",isFavorite&&"fill-current text-amber-500")}/></button>}</div>;
}
