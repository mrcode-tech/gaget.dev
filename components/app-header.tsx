"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Command, ArrowUpRight, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocaleLink, localizeHref } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tools } from "@/lib/tools/registry";
import { localeDirections } from "@/lib/i18n/messages";

export function AppHeader({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const isPhotoEditor = /(?:^|\/)images\/editor\/?$/.test(pathname);
  const isAudioEditor = /(?:^|\/)audio\/editor\/?$/.test(pathname);
  const isVideoEditor = /(?:^|\/)video\/editor\/?$/.test(pathname);
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
      className={`fixed inset-x-0 top-0 z-[80] flex h-[68px] items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-md sm:px-6 ${direction === "ltr" ? (sidebarCollapsed ? "lg:left-16" : "lg:left-[248px]") : (sidebarCollapsed ? "lg:right-16" : "lg:right-[248px]")}`}
    >
      <Button variant="outline" size="icon" aria-label="Open navigation" className="h-9 w-9 shrink-0 lg:hidden" onClick={() => window.dispatchEvent(new Event("gaget:open-navigation"))}>
        <Menu className="h-4 w-4" />
      </Button>
      <div className={`relative min-w-0 w-full max-w-xl lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[min(34vw,32rem)] lg:-translate-x-1/2 lg:-translate-y-1/2 ${isPhotoEditor || isAudioEditor || isVideoEditor ? "hidden md:block" : ""}`}>
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
      <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
