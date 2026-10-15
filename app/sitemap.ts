import type {MetadataRoute} from "next";
import {categories,tools} from "@/lib/tools/registry";
const base=process.env.NEXT_PUBLIC_SITE_URL||"https://gaget.dev";
export default function sitemap():MetadataRoute.Sitemap{const paths=["","/tools",...categories.map(c=>c.href),...tools.filter(t=>t.status!=="planned").map(t=>t.href)];return paths.map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:path==="/tools"?0.9:0.8}))}
