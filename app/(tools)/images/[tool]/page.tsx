import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PhotoEditor } from "@/components/photo-editor";
import { imageToolMeta, imageToolSlugs } from "@/lib/tools/image-tools";

export function generateStaticParams() {
  return imageToolSlugs.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool: slug } = await params;
  if (!imageToolSlugs.includes(slug as (typeof imageToolSlugs)[number])) return { title: "Image Tools | GaGet.dev" };
  const info = imageToolMeta.editor;
  return {
    title: "Photo Editor Online — Private Browser Tool | GaGet.dev",
    description: info.description,
    alternates: { canonical: "/images/editor" },
    openGraph: { title: info.title, description: info.description, url: "/images/editor", type: "website" },
  };
}

export default async function ImageToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  if (!imageToolSlugs.includes(slug as (typeof imageToolSlugs)[number])) notFound();
  if (slug !== "editor") permanentRedirect("/images/editor");
  return <PhotoEditor />;
}
