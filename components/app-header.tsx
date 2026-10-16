"use client";

import { useState } from "react";
import { Search, Command, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocaleLink, localizeHref } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { Input } from "@/components/ui/input";
import { tools } from "@/lib/tools/registry";
import { localeDirections } from "@/lib/i18n/messages";

export function AppHeader({ sidebarCollapsed, standalone = false }: { sidebarCollapsed: boolean; standalone?: boolean }) {
  const [query, setQuery] = useState("");
  const { locale, t } = useI18n();
  const matches = query.trim()
    ? tools
        .filter((tool) =>
          `${tool.name} ${tool.description} ${tool.keywords.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];
  const direction = localeDirections[locale];

  return (
    <header
      data-testid={standalone ? "site-navbar" : undefined}
      className={`sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 ${standalone ? "" : direction === "ltr" ? (sidebarCollapsed ? "pl-16 sm:pl-16 lg:pl-[88px]" : "pl-16 sm:pl-16 lg:pl-[272px]") : (sidebarCollapsed ? "pr-16 sm:pr-16 lg:pr-[88px]" : "pr-16 sm:pr-16 lg:pr-[272px]")}`}
    >
      {standalone && <LocaleLink href="/" aria-label="GaGet.dev home" className="inline-flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">G</span><span className="hidden sm:inline">GaGet.dev</span></LocaleLink>}
      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          dir={direction}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("nav.search")}
          aria-label={t("nav.searchLabel")}
          className={`h-10 border-transparent bg-muted/70 pl-9 pr-14 focus-visible:border-input ${direction === "rtl" ? "text-right" : "text-left"}`}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
            if (event.key === "Enter" && matches[0]) {
              window.location.href = localizeHref(matches[0].href, locale);
            }
          }}
        />
        <span
          className={`pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground ${direction === "rtl" ? "hidden" : ""}`}
        >
          <Command className="h-3 w-3" /> K
        </span>
        {matches.length > 0 && (
          <div className="absolute top-12 z-50 w-full overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl">
            {matches.map((tool) => {
              const Icon = tool.icon;
              return (
                <LocaleLink
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-accent"
                >
                  <span className="rounded-lg bg-muted p-2">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{t(`toolName.${tool.name}`)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{tool.description}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </LocaleLink>
              );
            })}
          </div>
        )}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
