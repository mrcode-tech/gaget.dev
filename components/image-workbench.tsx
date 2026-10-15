"use client";
/* eslint-disable @next/next/no-img-element -- Image previews use browser-created blob URLs; Next.js image optimization does not apply. */

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { Download, RotateCcw, ShieldCheck, Copy, Palette, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const maxBytes = 25 * 1024 * 1024;
const maxPixels = 50_000_000;
const outputTypes = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
];
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The image could not be decoded by this browser."));
    image.src = src;
  });
}
function applyPixelFilters(canvas: HTMLCanvasElement, brightness: number, contrast: number, saturation: number) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas pixel processing is unavailable in this browser.");
  // Process in strips to avoid allocating one huge ImageData buffer on mobile Safari.
  const stripHeight = 128;
  const contrastFactor = contrast / 100;
  const brightnessFactor = brightness / 100;
  for (let y = 0; y < canvas.height; y += stripHeight) {
    const height = Math.min(stripHeight, canvas.height - y);
    const imageData = ctx.getImageData(0, y, canvas.width, height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      const nr = Math.max(0, Math.min(255, ((r - 128) * contrastFactor + 128) * brightnessFactor));
      const ng = Math.max(0, Math.min(255, ((g - 128) * contrastFactor + 128) * brightnessFactor));
      const nb = Math.max(0, Math.min(255, ((b - 128) * contrastFactor + 128) * brightnessFactor));
      const luminance = 0.2126 * nr + 0.7152 * ng + 0.0722 * nb;
      pixels[i] = Math.max(0, Math.min(255, luminance + (nr - luminance) * saturation / 100));
      pixels[i + 1] = Math.max(0, Math.min(255, luminance + (ng - luminance) * saturation / 100));
      pixels[i + 2] = Math.max(0, Math.min(255, luminance + (nb - luminance) * saturation / 100));
    }
    ctx.putImageData(imageData, 0, y);
  }
}

function approximateBlur(canvas: HTMLCanvasElement, radius: number) {
  if (radius <= 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas blur processing is unavailable in this browser.");
  // Bounded-memory blur fallback for browsers without CanvasRenderingContext2D.filter.
  const divisor = Math.max(2, Math.min(32, Math.round(radius * 2)));
  const tiny = document.createElement("canvas");
  tiny.width = Math.max(1, Math.ceil(canvas.width / divisor));
  tiny.height = Math.max(1, Math.ceil(canvas.height / divisor));
  const tinyContext = tiny.getContext("2d");
  if (!tinyContext) throw new Error("Canvas blur processing is unavailable in this browser.");
  tinyContext.drawImage(canvas, 0, 0, tiny.width, tiny.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(tiny, 0, 0, canvas.width, canvas.height);
}
function hex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function ImageWorkbench({ slug }: { slug: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("800");
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropW, setCropW] = useState("800");
  const [cropH, setCropH] = useState("600");
  const [quality, setQuality] = useState("82");
  const [format, setFormat] = useState("image/webp");
  const [rotation, setRotation] = useState("90");
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [brightness, setBrightness] = useState("100");
  const [contrast, setContrast] = useState("100");
  const [saturation, setSaturation] = useState("100");
  const [blur, setBlur] = useState("0");
  const [pixelSize, setPixelSize] = useState("12");
  const [overlayText, setOverlayText] = useState("Your text");
  const [overlayColor, setOverlayColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState("48");
  const [borderSize, setBorderSize] = useState("24");
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [radius, setRadius] = useState("24");
  const [sampleColor, setSampleColor] = useState("");
  const [palette, setPalette] = useState<string[]>([]);
  const [base64Text, setBase64Text] = useState("");
  const [dpi, setDpi] = useState("300");
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; ratio: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);

  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); }, [sourceUrl]);
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  async function acceptFile(next: File | undefined) {
    if (!next) return;
    setError(""); setStatus(""); setResultBlob(null); setResultUrl(""); setPalette([]); setSampleColor("");
    if (next.size > maxBytes) { setError("This file is larger than 25 MB. Choose a smaller image for reliable browser-side processing."); return; }
    if (slug === "svg-optimizer" && (next.type === "image/svg+xml" || next.name.toLowerCase().endsWith(".svg"))) {
      setFile(next); setSourceUrl(""); setImageInfo(null); setBase64Text(await next.text()); return;
    }
    if (next.type === "image/svg+xml" || !next.type.startsWith("image/")) {
      setError("Choose a supported image file. SVG source is supported by the SVG Optimizer."); return;
    }
    const url = URL.createObjectURL(next);
    try {
      const image = await loadImage(url);
      if (image.naturalWidth * image.naturalHeight > maxPixels) { URL.revokeObjectURL(url); setError("This image has more than 50 megapixels. Choose a smaller image to avoid exhausting browser memory."); return; }
      setFile(next); setSourceUrl(url); setWidth(String(image.naturalWidth)); setHeight(String(image.naturalHeight));
      setCropW(String(image.naturalWidth)); setCropH(String(image.naturalHeight));
      setImageInfo({ width: image.naturalWidth, height: image.naturalHeight, ratio: (image.naturalWidth / image.naturalHeight).toFixed(4) });
      setBase64Text("");
    } catch (e) { URL.revokeObjectURL(url); setError(e instanceof Error ? e.message : "Unable to read this image."); }
  }

  async function processImage() {
    setError(""); setStatus("");
    if (slug === "svg-optimizer") {
      if (!base64Text.trim()) { setError("Select an SVG file or paste SVG source first."); return; }
      const optimized = base64Text.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
      setBase64Text(optimized); setStatus(`SVG source optimized locally (${optimized.length.toLocaleString()} characters).`);
      downloadBlob(new Blob([optimized], { type: "image/svg+xml;charset=utf-8" }), "optimized.svg"); return;
    }
    if (slug === "base64-to-image") {
      try {
        const raw = base64Text.trim();
        if (!raw) throw new Error("Paste an image data URL or Base64 string first.");
        if (raw.length > 36 * 1024 * 1024) throw new Error("This Base64 input is too large. Keep it under 36 MB for browser-side decoding.");
        const dataUrl = raw.startsWith("data:") ? raw : `data:image/png;base64,${raw.replace(/\s/g, "")}`;
        const image = await loadImage(dataUrl);
        const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        canvas.getContext("2d")!.drawImage(image, 0, 0);
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Could not create image output.")), "image/png"));
        const url = URL.createObjectURL(blob); setResultUrl(url); setResultBlob(blob); setStatus(`Decoded locally: ${image.naturalWidth} × ${image.naturalHeight} pixels.`); return;
      } catch (e) { setError(e instanceof Error ? e.message : "Invalid image Base64."); return; }
    }
    if (!sourceUrl || !file) { setError("Choose an image to get started."); return; }
    try {
      const image = await loadImage(sourceUrl);
      if (slug === "base64") {
        const reader = new FileReader();
        reader.onload = () => { const value = String(reader.result ?? ""); setBase64Text(value); setStatus("Image converted locally. Nothing was uploaded."); };
        reader.onerror = () => setError("Unable to read this image as Base64.");
        reader.readAsDataURL(file); return;
      }
      if (slug === "palette") {
        const canvas = document.createElement("canvas"); canvas.width = 80; canvas.height = 80;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!; ctx.drawImage(image, 0, 0, 80, 80);
        const pixels = ctx.getImageData(0, 0, 80, 80).data; const counts = new Map<string, number>();
        for (let i = 0; i < pixels.length; i += 16) { if (pixels[i + 3] < 128) continue; const color = hex(pixels[i], pixels[i + 1], pixels[i + 2]); counts.set(color, (counts.get(color) ?? 0) + 1); }
        setPalette([...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([color]) => color)); setStatus("Representative colors sampled locally from a reduced preview."); return;
      }
      const crop = slug === "crop";
      const resizing = slug === "resize";
      const rotate = slug === "rotate-flip";
      const usePixelate = slug === "pixelate";
      const useFavicon = slug === "favicon";
      const useBorder = slug === "borders";
      const sourceW = image.naturalWidth, sourceH = image.naturalHeight;
      let sx = 0, sy = 0, sw = sourceW, sh = sourceH;
      if (crop) {
        sx = Math.max(0, Math.min(sourceW - 1, Number(cropX) || 0)); sy = Math.max(0, Math.min(sourceH - 1, Number(cropY) || 0));
        sw = Math.max(1, Math.min(sourceW - sx, Number(cropW) || sourceW)); sh = Math.max(1, Math.min(sourceH - sy, Number(cropH) || sourceH));
      }
      let outW = resizing ? Math.max(1, Math.min(12000, Number(width) || sourceW)) : crop ? sw : sourceW;
      let outH = resizing ? Math.max(1, Math.min(12000, Number(height) || sourceH)) : crop ? sh : sourceH;
      if (useFavicon) { outW = 32; outH = 32; }
      if (outW * outH > maxPixels) throw new Error("Output exceeds 50 megapixels. Choose smaller dimensions to protect browser memory.");
      const turn = rotate ? ((Number(rotation) || 0) % 360 + 360) % 360 : 0;
      const swap = turn === 90 || turn === 270;
      if (swap) [outW, outH] = [outH, outW];
      const border = useBorder ? Math.max(0, Math.min(200, Number(borderSize) || 0)) : 0;
      const canvas = document.createElement("canvas");
      canvas.width = outW + border * 2; canvas.height = outH + border * 2;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas is unavailable in this browser.");
      if (border) { ctx.fillStyle = borderColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.save(); ctx.translate(border + canvas.width / 2 - border, border + canvas.height / 2 - border);
      if (turn) ctx.rotate(turn * Math.PI / 180);
      ctx.scale((flipX ? -1 : 1), (flipY ? -1 : 1));
      const drawW = swap ? outH : outW, drawH = swap ? outW : outH;
      const requestedSaturation = slug === "grayscale" ? 0 : Number(saturation);
      const blurAmount = Math.max(0, Math.min(20, slug === "blur" || slug === "editor" ? Number(blur) || 0 : 0));
      // Use the same pixel-based adjustment path on every browser. Some mobile
      // browsers accept CanvasRenderingContext2D.filter assignments but do not
      // reliably apply them, so feature detection is not enough here.
      ctx.filter = "none";
      if (usePixelate) {
        const tiny = document.createElement("canvas"); tiny.width = Math.max(1, Math.round(drawW / Math.max(2, Number(pixelSize) || 12))); tiny.height = Math.max(1, Math.round(drawH / Math.max(2, Number(pixelSize) || 12)));
        tiny.getContext("2d")!.drawImage(image, sx, sy, sw, sh, 0, 0, tiny.width, tiny.height);
        ctx.imageSmoothingEnabled = false; ctx.drawImage(tiny, -drawW / 2, -drawH / 2, drawW, drawH);
      } else if (turn) {
        ctx.drawImage(image, sx, sy, sw, sh, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        ctx.drawImage(image, sx, sy, sw, sh, -drawW / 2, -drawH / 2, drawW, drawH);
      }
      ctx.restore(); ctx.filter = "none";
      // Avoid relying on CSS or Canvas filter implementations for the exported
      // image. These operations run directly on the canvas pixels on iOS Safari,
      // iOS Chrome, and desktop browsers alike.
      if (blurAmount > 0) approximateBlur(canvas, blurAmount);
      applyPixelFilters(
        canvas,
        Number(brightness) || 100,
        Number(contrast) || 100,
        Number.isFinite(requestedSaturation) ? requestedSaturation : 100,
      );
      if (useBorder && Number(radius) > 0) {
        const r = Math.min(Number(radius), canvas.width / 2, canvas.height / 2);
        ctx.globalCompositeOperation = "destination-in"; ctx.beginPath(); ctx.roundRect(0, 0, canvas.width, canvas.height, r); ctx.fill(); ctx.globalCompositeOperation = "source-over";
      }
      if (["add-text", "watermark", "annotate"].includes(slug)) {
        ctx.fillStyle = overlayColor; ctx.font = `600 ${Math.max(8, Math.min(240, Number(fontSize) || 48))}px system-ui, sans-serif`;
        ctx.textBaseline = "bottom"; ctx.shadowColor = "rgba(0,0,0,.65)"; ctx.shadowBlur = 4;
        const lines = overlayText.split("\n").slice(0, 8); lines.forEach((line, i) => ctx.fillText(line, 24, canvas.height - 24 - (lines.length - 1 - i) * (Number(fontSize) || 48) * 1.25, canvas.width - 48));
        ctx.shadowBlur = 0;
      }
      const mime = slug === "compress" || slug === "convert" ? format : "image/png";
      const q = Math.max(0.1, Math.min(1, (Number(quality) || 82) / 100));
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("The browser could not export this image format.")), mime, q));
      const url = URL.createObjectURL(blob); setResultUrl(url); setResultBlob(blob);
      setStatus(`Ready: ${canvas.width} × ${canvas.height} pixels · ${formatBytes(blob.size)}. The original file is unchanged.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Image processing failed."); }
  }

  async function sampleAt(event: MouseEvent<HTMLImageElement>) {
    if (!sourceUrl || slug !== "color-picker") return;
    const img = event.currentTarget; const rect = img.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / rect.width * img.naturalWidth);
    const y = Math.floor((event.clientY - rect.top) / rect.height * img.naturalHeight);
    const canvas = document.createElement("canvas"); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const loaded = await loadImage(sourceUrl); ctx.drawImage(loaded, 0, 0);
    const pixel = ctx.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    setSampleColor(hex(pixel[0], pixel[1], pixel[2]));
  }

  async function createCollage() {
    setError(""); setStatus("");
    if (extraFiles.length < 2) { setError("Choose at least two images for a collage."); return; }
    try {
      const images = await Promise.all(extraFiles.slice(0, 4).map(async (f) => {
        if (f.size > maxBytes) throw new Error(`${f.name} exceeds the 25 MB file limit.`);
        const url = URL.createObjectURL(f);
        try { const img = await loadImage(url); if (img.naturalWidth * img.naturalHeight > maxPixels) throw new Error(`${f.name} exceeds the 50 megapixel safety limit.`); return img; }
        finally { URL.revokeObjectURL(url); }
      }));
      const cellW = 360, cellH = 260, gap = 16, columns = 2, rows = Math.ceil(images.length / columns);
      const canvas = document.createElement("canvas"); canvas.width = columns * cellW + (columns + 1) * gap; canvas.height = rows * cellH + (rows + 1) * gap;
      const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#f1f5f9"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      images.forEach((img, i) => { const x = gap + (i % columns) * (cellW + gap), y = gap + Math.floor(i / columns) * (cellH + gap); const scale = Math.min(cellW / img.naturalWidth, cellH / img.naturalHeight); const w = img.naturalWidth * scale, h = img.naturalHeight * scale; ctx.drawImage(img, x + (cellW - w) / 2, y + (cellH - h) / 2, w, h); });
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Could not export collage.")), "image/png"));
      setResultBlob(blob); setResultUrl(URL.createObjectURL(blob)); setStatus(`Collage ready from ${images.length} images. All work stayed in this browser.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create collage."); }
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]; void acceptFile(selected); event.target.value = "";
  }
  function reset() {
    setFile(null); setSourceUrl(""); setResultUrl(""); setResultBlob(null); setImageInfo(null); setError(""); setStatus(""); setPalette([]); setSampleColor(""); setBase64Text(""); setExtraFiles([]);
  }
  const needsOverlay = ["add-text", "watermark", "annotate"].includes(slug);
  const needsFilters = ["editor", "grayscale", "blur", "pixelate"].includes(slug);
  const needsOutputFormat = ["compress", "convert"].includes(slug);
  const needsCrop = slug === "crop";
  const needsResize = slug === "resize";
  const needsRotate = slug === "rotate-flip";
  const needsBorders = slug === "borders";
  const needsImageFile = slug !== "base64-to-image" && slug !== "collage";
  const isInfo = ["metadata", "privacy-check", "dimensions", "print-size"].includes(slug);
  const showProcessButton = !["collage", "svg-optimizer", "base64-to-image", "color-picker", "dimensions", "print-size"].includes(slug);

  return <div className="space-y-5">
    <div className="flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-500/5 p-4">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      <div><p className="text-sm font-semibold">Private by design — processed on your device</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your image is read by this page and processed with browser APIs. GaGet.dev has no image-upload endpoint for these tools. Nothing is sent to an image-processing service. Avoid browser extensions you do not trust, which may have their own access to page content.</p></div>
    </div>

    {slug === "collage" ? <Card><CardHeader><CardTitle className="text-sm">Choose 2–4 images</CardTitle></CardHeader><CardContent><Input type="file" accept="image/*" multiple onChange={(e) => setExtraFiles(Array.from(e.target.files ?? []).slice(0, 4))} /><p className="mt-2 text-xs text-muted-foreground">{extraFiles.length} selected · max 25 MB per image</p><Button className="mt-3" onClick={() => void createCollage()}><WandSparkles className="h-4 w-4" /> Create collage</Button></CardContent></Card> : null}

    {needsImageFile && <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Your image</CardTitle><Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button></CardHeader><CardContent><div className="flex flex-wrap items-center gap-3"><Input ref={inputRef} type="file" accept={slug === "svg-optimizer" ? "image/svg+xml,.svg" : "image/png,image/jpeg,image/webp,image/gif,image/avif"} onChange={onPick} className="max-w-xl" /><span className="text-xs text-muted-foreground">Up to 25 MB · file stays on this device</span></div>{file && <p className="mt-2 text-xs text-muted-foreground">{file.name} · {formatBytes(file.size)}{imageInfo ? ` · ${imageInfo.width} × ${imageInfo.height}` : ""}</p>}</CardContent></Card>}

    {needsCrop && <Card><CardHeader><CardTitle className="text-sm">Crop rectangle (source pixels)</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-4">{[["X",cropX,setCropX],["Y",cropY,setCropY],["Width",cropW,setCropW],["Height",cropH,setCropH]].map(([label,value,setter]) => <label key={String(label)} className="space-y-1 text-xs text-muted-foreground">{String(label)}<Input type="number" min="0" value={String(value)} onChange={(e) => (setter as (v:string)=>void)(e.target.value)} /></label>)}</CardContent></Card>}
    {needsResize && <Card><CardHeader><CardTitle className="text-sm">Output dimensions</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs text-muted-foreground">Width (px)<Input type="number" min="1" max="12000" value={width} onChange={(e) => setWidth(e.target.value)} /></label><label className="space-y-1 text-xs text-muted-foreground">Height (px)<Input type="number" min="1" max="12000" value={height} onChange={(e) => setHeight(e.target.value)} /></label><p className="sm:col-span-2 text-xs text-muted-foreground">For best quality, avoid enlarging small images. Dimensions are capped at 12,000 px per side.</p></CardContent></Card>}
    {needsRotate && <Card><CardHeader><CardTitle className="text-sm">Transform</CardTitle></CardHeader><CardContent className="flex flex-wrap items-center gap-4"><label className="text-sm">Rotation <select value={rotation} onChange={(e) => setRotation(e.target.value)} className="ml-2 h-10 rounded-lg border border-input bg-background px-3"><option value="0">0°</option><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270°</option></select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flipX} onChange={(e) => setFlipX(e.target.checked)} /> Flip horizontal</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={flipY} onChange={(e) => setFlipY(e.target.checked)} /> Flip vertical</label></CardContent></Card>}
    {needsFilters && <Card><CardHeader><CardTitle className="text-sm">Adjust image</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm">Brightness: {brightness}%<input type="range" min="20" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full" /></label><label className="space-y-2 text-sm">Contrast: {contrast}%<input type="range" min="20" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full" /></label><label className="space-y-2 text-sm">Saturation: {saturation}%<input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full" /></label>{(slug === "blur" || slug === "editor") && <label className="space-y-2 text-sm">Blur: {blur}px<input type="range" min="0" max="20" step="0.5" value={blur} onChange={(e) => setBlur(e.target.value)} className="w-full" /></label>}{slug === "pixelate" && <label className="space-y-2 text-sm">Pixel block size: {pixelSize}<input type="range" min="2" max="40" value={pixelSize} onChange={(e) => setPixelSize(e.target.value)} className="w-full" /></label>}</CardContent></Card>}
    {needsOverlay && <Card><CardHeader><CardTitle className="text-sm">Text overlay</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs text-muted-foreground sm:col-span-2">Text / annotation<Textarea value={overlayText} onChange={(e) => setOverlayText(e.target.value)} className="min-h-20" /></label><label className="space-y-1 text-xs text-muted-foreground">Text color<Input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} /></label><label className="space-y-1 text-xs text-muted-foreground">Font size (px)<Input type="number" min="8" max="240" value={fontSize} onChange={(e) => setFontSize(e.target.value)} /></label><p className="sm:col-span-2 text-xs text-muted-foreground">Text is placed near the lower-left corner. For watermarks, choose a subtle color and smaller font size.</p></CardContent></Card>}
    {needsBorders && <Card><CardHeader><CardTitle className="text-sm">Border and corners</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><label className="space-y-1 text-xs text-muted-foreground">Border thickness<Input type="number" min="0" max="200" value={borderSize} onChange={(e) => setBorderSize(e.target.value)} /></label><label className="space-y-1 text-xs text-muted-foreground">Border color<Input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} /></label><label className="space-y-1 text-xs text-muted-foreground">Corner radius<Input type="number" min="0" max="400" value={radius} onChange={(e) => setRadius(e.target.value)} /></label></CardContent></Card>}
    {needsOutputFormat && <Card><CardHeader><CardTitle className="text-sm">Export settings</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs text-muted-foreground">Output format<select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">{outputTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label><label className="space-y-1 text-xs text-muted-foreground">Quality: {quality}%<input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(e.target.value)} className="mt-3 w-full" /></label><p className="sm:col-span-2 text-xs text-muted-foreground">Quality mainly affects JPEG and WebP. PNG export is lossless and may not become smaller.</p></CardContent></Card>}
    {(slug === "base64" || slug === "base64-to-image" || slug === "svg-optimizer") && <Card><CardHeader><CardTitle className="text-sm">{slug === "base64" ? "Image data URL" : slug === "svg-optimizer" ? "SVG source" : "Paste image Base64"}</CardTitle></CardHeader><CardContent><Textarea value={base64Text} onChange={(e) => setBase64Text(e.target.value)} spellCheck={false} className="min-h-36 font-mono text-xs" placeholder={slug === "base64-to-image" ? "data:image/png;base64,..." : slug === "svg-optimizer" ? "Select an SVG file or paste SVG markup…" : "Choose an image above, then convert to populate this field…"} /><div className="mt-3 flex flex-wrap gap-2">{slug !== "base64" && <Button onClick={() => void processImage()}><WandSparkles className="h-4 w-4" /> {slug === "svg-optimizer" ? "Optimize & download" : "Decode image"}</Button>}<Button variant="outline" disabled={!base64Text} onClick={() => void navigator.clipboard?.writeText(base64Text)}><Copy className="h-4 w-4" /> Copy text</Button><Button variant="outline" disabled={!base64Text} onClick={() => downloadBlob(new Blob([base64Text], { type: "text/plain;charset=utf-8" }), slug === "svg-optimizer" ? "optimized.svg" : "image-data.txt")}><Download className="h-4 w-4" /> Download text</Button></div></CardContent></Card>}
    {isInfo && imageInfo && file && <Card><CardHeader><CardTitle className="text-sm">Image details</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Info label="Dimensions" value={`${imageInfo.width} × ${imageInfo.height} px`} /><Info label="Aspect ratio" value={imageInfo.ratio} /><Info label="File size" value={formatBytes(file.size)} /><Info label="MIME type" value={file.type || "Unknown"} /><Info label="Metadata privacy" value="Re-export to strip embedded metadata" />{slug === "print-size" && <Info label={`Print at ${dpi} DPI`} value={`${(imageInfo.width / Number(dpi)).toFixed(2)} × ${(imageInfo.height / Number(dpi)).toFixed(2)} inches`} />}</CardContent>{slug === "print-size" && <CardContent><label className="block max-w-xs space-y-1 text-xs text-muted-foreground">DPI<select value={dpi} onChange={(e) => setDpi(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="72">72 DPI (screen)</option><option value="150">150 DPI</option><option value="300">300 DPI (print)</option><option value="600">600 DPI (high quality)</option></select></label></CardContent>}</Card>}
    {slug === "color-picker" && sourceUrl && <p className="text-sm text-muted-foreground">Click the image to sample a pixel. {sampleColor && <span className="inline-flex items-center gap-2 font-mono font-semibold text-foreground"><span className="h-4 w-4 rounded border" style={{ backgroundColor: sampleColor }} />{sampleColor}<Button size="sm" variant="outline" onClick={() => void navigator.clipboard?.writeText(sampleColor)}><Copy className="h-3 w-3" /> Copy</Button></span>}</p>}
    {slug === "palette" && palette.length > 0 && <Card><CardHeader><CardTitle className="text-sm">Sampled palette</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">{palette.map((color) => <button key={color} onClick={() => void navigator.clipboard?.writeText(color)} className="overflow-hidden rounded-lg border border-border text-left"><span className="block h-16" style={{ backgroundColor: color }} /><span className="flex items-center justify-between p-2 font-mono text-xs">{color}<Copy className="h-3 w-3" /></span></button>)}</CardContent></Card>}

    {sourceUrl && <Card><CardHeader><CardTitle className="text-sm">{slug === "color-picker" ? "Click to sample a color" : "Original preview"}</CardTitle></CardHeader><CardContent><img ref={previewRef} src={sourceUrl} alt="Locally loaded image preview" onClick={(e) => void sampleAt(e)} style={slug === "editor" || slug === "grayscale" || slug === "blur" ? { filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${slug === "grayscale" ? 0 : saturation}%) blur(${slug === "blur" ? blur : slug === "editor" ? blur : 0}px)` } : undefined} className={`max-h-[520px] w-full rounded-lg border border-border object-contain ${slug === "color-picker" ? "cursor-crosshair" : ""}`} /></CardContent></Card>}
    {showProcessButton && <div className="flex flex-wrap gap-2"><Button onClick={() => void processImage()} disabled={!sourceUrl}><WandSparkles className="h-4 w-4" /> {slug === "palette" ? "Extract colors" : slug === "base64" ? "Convert to Base64" : slug === "metadata" || slug === "privacy-check" ? "Create metadata-free copy" : slug === "favicon" ? "Create 32×32 favicon" : "Apply & preview"}</Button><Button variant="outline" disabled={!resultBlob} onClick={() => resultBlob && downloadBlob(resultBlob, `${(file?.name ?? "image").replace(/\.[^.]+$/, "")}-gaget.${resultBlob.type === "image/jpeg" ? "jpg" : resultBlob.type === "image/webp" ? "webp" : "png"}`)}><Download className="h-4 w-4" /> Download result</Button></div>}
    {resultUrl && <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-sm">Processed result</CardTitle><Button size="sm" variant="outline" onClick={() => resultBlob && downloadBlob(resultBlob, "gaget-image.png")}><Download className="mr-2 h-4 w-4" /> Download</Button></CardHeader><CardContent><img src={resultUrl} alt="Processed image result" className="max-h-[520px] w-full rounded-lg border border-border object-contain" /></CardContent></Card>}
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
    {status && <div role="status" className="rounded-lg border border-emerald-600/20 bg-emerald-500/5 p-3 text-sm text-foreground">{status}</div>}
    {slug === "metadata" && <p className="text-xs leading-5 text-muted-foreground">Browser security intentionally limits access to some original-file metadata. This viewer reports browser-readable properties; the re-encoded output removes embedded EXIF/IPTC metadata rather than attempting to preserve it.</p>}
    {slug === "privacy-check" && <p className="text-xs leading-5 text-muted-foreground">A fresh canvas export contains rendered pixels, not the source file&apos;s original EXIF metadata. Animated formats and uncommon image formats may be flattened to a single PNG frame.</p>}
    {slug === "editor" && <p className="text-xs text-muted-foreground"><Palette className="mr-1 inline h-3.5 w-3.5" />Changes are non-destructive until you download the result. Adjust controls and apply again to export a new version.</p>}
    <p className="text-xs text-muted-foreground">Local processing only. The selected image is not uploaded to GaGet.dev. Files remain in this page&apos;s browser memory and are not stored by the service.</p>
  </div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-medium">{value}</p></div>;
}
