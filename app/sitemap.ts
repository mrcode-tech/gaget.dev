import type { MetadataRoute } from "next";
import { categories, tools } from "@/lib/tools/registry";
import { dateTimeToolEntries } from "@/lib/tools/date-time-tools";
import { createSitemapEntries } from "@/lib/seo/sitemap";
import { designStyles } from "@/design/data/styles";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaget.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const existingEntries = createSitemapEntries({
    baseUrl,
    categories,
    tools,
    dateTimeFeatureSlugs: dateTimeToolEntries.map(([slug]) => slug),
  });
  const designPaths = ["/design", ...designStyles.map((style) => `/design/${style.id}`)];
  const designEntries: MetadataRoute.Sitemap = designPaths.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    priority: path === "/design" ? 0.75 : 0.65,
    changeFrequency: "monthly",
  }));
  return [...existingEntries, ...designEntries];
}
