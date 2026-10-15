import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout";
import { ImageWorkbench } from "@/components/image-workbench";
import { PhotoEditor } from "@/components/photo-editor";
import { imageToolMeta, imageToolSlugs } from "@/lib/tools/image-tools";

export function generateStaticParams() {
  return imageToolSlugs.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = imageToolSlugs.includes(slug as (typeof imageToolSlugs)[number]) ? slug : null;
  if (!tool) return { title: "Image Tools | GaGet.dev" };
  const info = imageToolMeta[tool as keyof typeof imageToolMeta];
  return {
    title: `${info.title} Online — Private Browser Tool | GaGet.dev`,
    description: info.description,
    alternates: { canonical: `/images/${tool}` },
    openGraph: { title: info.title, description: info.description, url: `/images/${tool}`, type: "website" },
  };
}

export default async function ImageToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const legacyEditorSlugs = ["crop", "resize", "compress", "convert", "rotate-flip", "add-text", "watermark", "annotate", "borders", "grayscale", "blur", "pixelate", "privacy-check"];
  if (legacyEditorSlugs.includes(slug)) permanentRedirect("/images/editor");
  if (!imageToolSlugs.includes(slug as (typeof imageToolSlugs)[number])) notFound();
  const info = imageToolMeta[slug as keyof typeof imageToolMeta];
  return <ToolLayout category="Images" title={info.title} description={info.description}>{slug === "editor" ? <PhotoEditor /> : <ImageWorkbench slug={slug} />}</ToolLayout>;
}
