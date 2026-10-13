import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaget.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/json/formatter",
    "/encoding/url",
    "/encoding/base64",
    "/security/jwt-decoder",
    "/generators/uuid"
  ];
  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8
  }));
}
