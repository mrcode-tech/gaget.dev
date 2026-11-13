import type { MetadataRoute } from "next";
import { categories, tools } from "@/lib/tools/registry";
import { dateTimeToolEntries } from "@/lib/tools/date-time-tools";
import { createSitemapEntries } from "@/lib/seo/sitemap";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaget.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemapEntries({
    baseUrl,
    categories,
    tools,
    dateTimeFeatureSlugs: dateTimeToolEntries.map(([slug]) => slug),
  });
}
