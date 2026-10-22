"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";

export function FeatureMenuSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { locale, t } = useI18n();
  return (
    <div className="relative px-1 pb-2 md:hidden" dir={localeDirections[locale]}>
      <Search aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label={t("featureSearch.label")}
        className="ps-9"
        dir={localeDirections[locale]}
        placeholder={t("featureSearch.placeholder")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function FeatureMenuNoResults() {
  const { t, locale } = useI18n();
  return <p role="status" aria-live="polite" dir={localeDirections[locale]} className="px-3 py-6 text-center text-sm text-muted-foreground">{t("featureSearch.noResults")}</p>;
}
