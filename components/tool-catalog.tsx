"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";
import { developerToolCategories, developerTools } from "@/lib/tools/registry";

export function ToolCatalog() {
  const [query, setQuery] = useState("");
  const { t, locale } = useI18n();

  const categoryGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingTools = developerTools.filter((tool) => {
      if (!normalizedQuery) return true;
      const searchableText = [tool.name, tool.description, tool.category, ...tool.keywords]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    return developerToolCategories
      .map((category) => ({
        ...category,
        tools: matchingTools.filter((tool) => tool.category === category.name),
      }))
      .filter((category) => category.tools.length > 0);
  }, [query]);

  const visibleCount = categoryGroups.reduce((total, category) => total + category.tools.length, 0);
  const direction = localeDirections[locale];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-7">
        <p className="eyebrow">{t("nav.allTools")}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t("nav.devTools")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("catalog.description")}</p>

        <div className="relative mt-5 max-w-xl">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            dir={direction}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("catalog.search")}
            aria-label={t("catalog.search")}
            className={"pl-9 " + (direction === "rtl" ? "text-right" : "text-left")}
          />
        </div>
      </header>

      {visibleCount === 0 ? (
        <p className="surface p-8 text-center text-sm text-muted-foreground">{t("catalog.empty")}</p>
      ) : (
        <div className="space-y-9">
          {categoryGroups.map((category) => {
            const Icon = category.icon;
            const categoryLabel = category.name === "Video" ? t("category.video") : t(`category.${category.name}`);

            return (
              <section key={category.slug} aria-labelledby={`developer-category-${category.slug}`}>
                <header className="mb-3 flex items-center justify-between gap-3">
                  <h2 id={`developer-category-${category.slug}`} className="text-lg font-semibold">
                    <LocaleLink
                      href={category.href}
                      className="inline-flex items-center gap-2 rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                      {categoryLabel}
                    </LocaleLink>
                  </h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {category.tools.length} {t("category.tools")}
                  </span>
                </header>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {category.tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
