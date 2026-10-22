"use client";

import { useI18n } from "@/components/i18n-provider";
import { FeatureMenuNoResults, FeatureMenuSearch } from "@/components/feature-menu-search";
import { useFeatureMenuSearch } from "@/lib/feature-menu-search";

export function FeatureSearchThresholdHarness({ count }: { count: number }) {
  const { locale } = useI18n();
  const search = useFeatureMenuSearch(true, count, "threshold-harness", locale);
  const features = Array.from({ length: count }, (_, index) => "Feature " + (index + 1));
  const filtered = features.filter((feature) => search.matches([feature]));
  return (
    <main data-testid="feature-search-threshold-harness" className="min-h-screen bg-background p-4 text-foreground">
      <h1 className="mb-4 text-lg font-semibold">Feature search threshold verification</h1>
      <section data-testid="threshold-feature-menu" aria-label="Features menu" className="w-72 max-w-full rounded-lg border border-border bg-popover p-1.5 shadow-xl">
        {search.canSearch && <FeatureMenuSearch value={search.query} onChange={search.setQuery} />}
        {search.canSearch && search.query.trim() && filtered.length === 0 ? <FeatureMenuNoResults /> : null}
        {filtered.map((feature) => (
          <button key={feature} type="button" data-testid="threshold-feature" className="flex min-h-10 w-full items-center rounded-md px-3 py-2.5 text-left hover:bg-accent">
            {feature}
          </button>
        ))}
      </section>
    </main>
  );
}
