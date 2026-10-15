import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout";
import { ImageWorkbench, imageToolSlugs } from "@/components/image-workbench";

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

const imageToolMeta = {
  crop: { title: "Image Cropper", description: "Crop photos precisely in your browser. Private, free image cropping with no upload." },
  resize: { title: "Image Resizer", description: "Resize photos by pixel dimensions locally in your browser. Your images stay on your device." },
  compress: { title: "Image Compressor", description: "Compress images with adjustable output quality in your browser, without uploading your files." },
  convert: { title: "Image Format Converter", description: "Convert images between PNG, JPEG, and WebP locally for privacy-friendly image conversion." },
  "rotate-flip": { title: "Rotate & Flip Image", description: "Rotate and flip images in your browser without uploading or storing your photo." },
  editor: { title: "Photo Editor & Filters", description: "Edit photos with brightness, contrast, saturation, grayscale, and blur controls in your browser." },
  "add-text": { title: "Add Text to Image", description: "Add captions and text overlays to images privately in your browser." },
  watermark: { title: "Image Watermark Tool", description: "Add a text watermark to your photo locally and download a new copy." },
  annotate: { title: "Image Annotator", description: "Add text annotations to an image in your browser, with no image upload." },
  collage: { title: "Photo Collage Maker", description: "Combine two to four local images into a simple downloadable photo collage." },
  borders: { title: "Image Borders & Corners", description: "Add a border and rounded corners to photos using local browser processing." },
  grayscale: { title: "Grayscale Image", description: "Convert images to grayscale without uploading your photo." },
  blur: { title: "Image Blur Tool", description: "Apply a blur effect to an image locally in your browser." },
  pixelate: { title: "Pixelate Image", description: "Pixelate or mosaic an image locally and export the result." },
  metadata: { title: "Image Metadata Viewer & Remover", description: "Inspect image dimensions and file properties, then export a copy stripped of embedded metadata." },
  "privacy-check": { title: "Image Privacy Checker", description: "Review basic image properties and create a metadata-free image copy without uploads." },
  palette: { title: "Dominant Color Palette", description: "Extract representative HEX colors from an image directly in your browser." },
  "color-picker": { title: "Image Color Picker", description: "Sample exact pixel colors from an image and copy HEX values, privately in your browser." },
  base64: { title: "Image to Base64", description: "Convert a local image to a Base64 data URL entirely in your browser." },
  "base64-to-image": { title: "Base64 to Image", description: "Decode a Base64 image data URL locally and download the decoded image." },
  favicon: { title: "Image to Favicon", description: "Create a 32 by 32 PNG favicon from a local image without uploading it." },
  "svg-optimizer": { title: "SVG Optimizer", description: "Optimize SVG source whitespace and comments in your browser before downloading." },
  dimensions: { title: "Image Dimensions Checker", description: "Check image dimensions, aspect ratio, file type, and file size locally." },
  "print-size": { title: "DPI & Print Size Calculator", description: "Calculate approximate print dimensions from image pixel dimensions and DPI." },
} as const;

export default async function ImageToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  if (!imageToolSlugs.includes(slug as (typeof imageToolSlugs)[number])) notFound();
  const info = imageToolMeta[slug as keyof typeof imageToolMeta];
  return <ToolLayout category="Images" title={info.title} description={info.description}><ImageWorkbench slug={slug} /></ToolLayout>;
}
