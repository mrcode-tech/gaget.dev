import type { MetadataRoute } from "next";

export type SitemapCategory = {
  slug: string;
  href: string;
  name: string;
};

export type SitemapTool = {
  href: string;
  category: string;
  kind: "workspace" | "standalone";
  workspaceId?: string;
  status: "available" | "planned";
};

type SitemapOptions = {
  baseUrl: string;
  categories: SitemapCategory[];
  tools: SitemapTool[];
  dateTimeFeatureSlugs: string[];
};

const redirectedCategorySlugs = new Set(["images", "audio", "video", "date-time"]);

export function createSitemapEntries({
  baseUrl,
  categories,
  tools,
  dateTimeFeatureSlugs,
}: SitemapOptions): MetadataRoute.Sitemap {
  const origin = new URL(baseUrl);
  const routes: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
    { path: "/mcp", priority: 0.85, changeFrequency: "monthly" },
    { path: "/images/editor", priority: 0.8, changeFrequency: "monthly" },
    { path: "/audio/editor", priority: 0.8, changeFrequency: "monthly" },
    { path: "/video/editor", priority: 0.8, changeFrequency: "monthly" },
    { path: "/datetime/editor", priority: 0.8, changeFrequency: "monthly" },
  ];

  for (const category of categories) {
    const hasIndexableTools = tools.some(
      (tool) =>
        tool.status === "available" &&
        tool.category === category.name &&
        (tool.kind === "standalone" || tool.workspaceId === "json"),
    );
    if (!redirectedCategorySlugs.has(category.slug) && hasIndexableTools) {
      routes.push({ path: category.href, priority: 0.75, changeFrequency: "monthly" });
    }
  }

  for (const tool of tools) {
    if (
      tool.status === "available" &&
      (tool.kind === "standalone" || tool.workspaceId === "json")
    ) {
      routes.push({ path: tool.href, priority: 0.7, changeFrequency: "monthly" });
    }
  }

  for (const slug of dateTimeFeatureSlugs) {
    const url = new URL("/datetime/editor", origin);
    url.searchParams.set("feature", slug);
    routes.push({
      path: url.pathname + url.search,
      priority: 0.65,
      changeFrequency: "monthly",
    });
  }

  const seen = new Set<string>();
  return routes.flatMap(({ path, priority, changeFrequency }) => {
    const url = new URL(path, origin).toString();
    if (seen.has(url)) return [];
    seen.add(url);
    return [{ url, priority, changeFrequency }];
  });
}
