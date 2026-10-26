"use client";

import { ToolCard } from "@/components/tool-card";
import { useI18n } from "@/components/i18n-provider";
import { tools } from "@/lib/tools/registry";

export function CategoryLanding({ category }: { category: string }) {
  const { t } = useI18n();
  const categoryTools = tools.filter((tool) => tool.category === category);
  const categoryLabel = category === "Video" ? t("category.video") : t(`category.${category}`);

  return (
    <main className="mx-auto w-full max-w-[1600px] px-3 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 text-xs text-muted-foreground">
        {t("nav.categories")} / {categoryLabel}
      </nav>

      <h1 className="text-3xl font-bold tracking-tight">
        {categoryLabel}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {t("catalog.description")}
      </p>

      <h2 className="mb-3 mt-7 text-lg font-semibold">
        {categoryTools.length} {t("category.tools")}
      </h2>

      {categoryTools.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="surface mt-4 p-8 text-sm text-muted-foreground">
          {t("category.empty")}
        </p>
      )}
    </main>
  );
}
