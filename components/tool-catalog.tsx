"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";
import { tools } from "@/lib/tools/registry";

export function ToolCatalog() {
  const [query, setQuery] = useState("");
  const { t, locale } = useI18n();

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      if (!normalizedQuery) return true;

      const searchableText = [
        tool.name,
        tool.description,
        tool.category,
        ...tool.keywords,
      ].join(" ").toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query]);

  const available = visible.filter((tool) => tool.status !== "planned");
  const planned = visible.filter((tool) => tool.status === "planned");
  const direction = localeDirections[locale];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-7">
        <p className="eyebrow">{t("nav.allTools")}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t("catalog.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("catalog.description")}
        </p>

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

      {visible.length === 0 ? (
        <p className="surface p-8 text-center text-sm text-muted-foreground">
          {t("catalog.empty")}
        </p>
      ) : (
        <>
          <section className="mb-9">
            <h2 className="mb-3 text-lg font-semibold">
              {t("catalog.available")} ({available.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {available.map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </section>

          {planned.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                {t("catalog.planned")} ({planned.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {planned.map((tool) => (
                  <ToolCard key={tool.href} tool={tool} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
