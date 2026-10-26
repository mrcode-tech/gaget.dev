"use client";

import { ChevronRight, Home } from "lucide-react";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";

export function ToolLayout({
  category,
  title,
  description,
  children,
  workspace = false,
}: {
  category: string;
  title: string;
  description: string;
  children: React.ReactNode;
  workspace?: boolean;
}) {
  const { t } = useI18n();
  const categoryLabel = t(`category.${category}`);
  const translatedTitle = t(`toolTitle.${title}`);
  const heading = translatedTitle === `toolTitle.${title}` ? title : translatedTitle;
  const translatedDescription = t(`toolDescription.${title}`);
  const shortDescription =
    translatedDescription === `toolDescription.${title}` ? description : translatedDescription;

  return (
    <main className={workspace ? "w-full min-w-0 px-0 py-0" : "mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8"}>
      {!workspace && <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <LocaleLink href="/" className="inline-flex items-center gap-1 hover:text-foreground">
          <Home className="h-3.5 w-3.5" />
          {t("tool.home")}
        </LocaleLink>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span>{categoryLabel}</span>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span aria-current="page" className="truncate font-medium text-foreground">{heading}</span>
      </nav>}

      {!workspace && <header className="mb-4 border-b border-border pb-4">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{categoryLabel}</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-5 text-muted-foreground line-clamp-2">
          {shortDescription}
        </p>
      </header>}

      {children}
    </main>
  );
}
