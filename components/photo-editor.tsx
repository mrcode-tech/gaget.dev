"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Download, Undo2, Redo2, ShieldCheck, Type, ImagePlus, ZoomIn, ZoomOut, Maximize2, Check, X, Home } from "lucide-react";
import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type TextLayer = {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  font: string;
  bold: boolean;
  italic: boolean;
  rotation: number;
  opacity: number;
};
type EditorState = {
  width: number;
  height: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  quality: number;
  format: string;
  fit: string;
  texts: TextLayer[];
  selectedText: number | null;
};
const defaults = (width = 1200, height = 800): EditorState => ({
  width, height, cropX: 0, cropY: 0, cropWidth: width, cropHeight: height, brightness: 100, contrast: 100, saturation: 100, blur: 0,
  grayscale: 0, sepia: 0, rotation: 0, flipX: false, flipY: false,
  quality: 90, format: "image/jpeg", fit: "cover", texts: [], selectedText: null,
});
const maxBytes = 25 * 1024 * 1024;
const maxPixels = 50_000_000;
const fonts = ["Arial", "Georgia", "Impact", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana", "Courier New"];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This image could not be decoded by your browser."));
    image.src = src;
  });
}
function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply photo adjustments to actual canvas pixels instead of CanvasRenderingContext2D.filter.
 * The latter is not consistently implemented across Safari/WebKit versions.
 */
function applyCanvasAdjustments(canvas: HTMLCanvasElement, state: EditorState) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Your browser could not create a 2D canvas context.");

  // A bounded-memory blur approximation that works without ctx.filter.
  if (state.blur > 0) {
    const divisor = clamp(Math.round(state.blur * 1.5), 2, 18);
    const tiny = document.createElement("canvas");
    tiny.width = Math.max(1, Math.ceil(canvas.width / divisor));
    tiny.height = Math.max(1, Math.ceil(canvas.height / divisor));
    const tinyContext = tiny.getContext("2d");
    if (!tinyContext) throw new Error("Your browser could not prepare the blur effect.");
    tinyContext.imageSmoothingEnabled = true;
    tinyContext.imageSmoothingQuality = "high";
    tinyContext.drawImage(canvas, 0, 0, tiny.width, tiny.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(tiny, 0, 0, canvas.width, canvas.height);
  }

  const brightness = state.brightness / 100;
  const contrast = state.contrast / 100;
  const saturation = state.saturation / 100;
  const grayscale = state.grayscale / 100;
  const sepia = state.sepia / 100;
  const stripHeight = 128;

  for (let y = 0; y < canvas.height; y += stripHeight) {
    const height = Math.min(stripHeight, canvas.height - y);
    const imageData = ctx.getImageData(0, y, canvas.width, height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      let r = clamp(((pixels[i] - 128) * contrast + 128) * brightness, 0, 255);
      let g = clamp(((pixels[i + 1] - 128) * contrast + 128) * brightness, 0, 255);
      let b = clamp(((pixels[i + 2] - 128) * contrast + 128) * brightness, 0, 255);

      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = luminance + (r - luminance) * saturation;
      g = luminance + (g - luminance) * saturation;
      b = luminance + (b - luminance) * saturation;

      if (grayscale > 0) {
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r += (gray - r) * grayscale;
        g += (gray - g) * grayscale;
        b += (gray - b) * grayscale;
      }

      if (sepia > 0) {
        const sr = clamp(0.393 * r + 0.769 * g + 0.189 * b, 0, 255);
        const sg = clamp(0.349 * r + 0.686 * g + 0.168 * b, 0, 255);
        const sb = clamp(0.272 * r + 0.534 * g + 0.131 * b, 0, 255);
        r += (sr - r) * sepia;
        g += (sg - g) * sepia;
        b += (sb - b) * sepia;
      }

      pixels[i] = clamp(r, 0, 255);
      pixels[i + 1] = clamp(g, 0, 255);
      pixels[i + 2] = clamp(b, 0, 255);
      // Preserve the original alpha channel.
    }
    ctx.putImageData(imageData, 0, y);
  }
}

export function PhotoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const sourceUrlRef = useRef("");
  const historyRef = useRef<EditorState[]>([]);
  const futureRef = useRef<EditorState[]>([]);
  const [fileName, setFileName] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [doc, setDoc] = useState<EditorState>(defaults());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activePanel, setActivePanel] = useState("none");
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState(90);
  const [printDpi, setPrintDpi] = useState(300);
  const [paletteColors, setPaletteColors] = useState<string[]>([]);
  const [base64Output, setBase64Output] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [svgOutput, setSvgOutput] = useState("");
  const [collageFiles, setCollageFiles] = useState<File[]>([]);
  const svgInputRef = useRef<HTMLInputElement>(null);
  const collageInputRef = useRef<HTMLInputElement>(null);
  const sourceFileRef = useRef<File | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const cropDragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; originW: number; originH: number; sourceW: number; sourceH: number; mode: "new" | "move" | "resize"; left: boolean; right: boolean; top: boolean; bottom: boolean } | null>(null);
  const [filterPreset, setFilterPreset] = useState("custom");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const nextTextId = useRef(1);

  const draw = useCallback((state: EditorState) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    if (cropMode) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const cropContext = canvas.getContext("2d", { willReadFrequently: true });
      if (!cropContext) return;
      cropContext.clearRect(0, 0, canvas.width, canvas.height);
      cropContext.drawImage(image, 0, 0);
      applyCanvasAdjustments(canvas, state);
      const x = clamp(Math.round(state.cropX), 0, image.naturalWidth - 1);
      const y = clamp(Math.round(state.cropY), 0, image.naturalHeight - 1);
      const w = clamp(Math.round(state.cropWidth), 1, image.naturalWidth - x);
      const h = clamp(Math.round(state.cropHeight), 1, image.naturalHeight - y);
      cropContext.fillStyle = "rgba(7, 12, 24, .58)";
      cropContext.fillRect(0, 0, canvas.width, y);
      cropContext.fillRect(0, y + h, canvas.width, canvas.height - y - h);
      cropContext.fillRect(0, y, x, h);
      cropContext.fillRect(x + w, y, canvas.width - x - w, h);
      cropContext.strokeStyle = "#ffffff"; cropContext.lineWidth = Math.max(2, canvas.width / 900);
      cropContext.strokeRect(x, y, w, h);
      cropContext.strokeStyle = "#38bdf8"; cropContext.lineWidth = Math.max(1, canvas.width / 1800);
      cropContext.beginPath(); cropContext.moveTo(x + w / 3, y); cropContext.lineTo(x + w / 3, y + h); cropContext.moveTo(x + 2 * w / 3, y); cropContext.lineTo(x + 2 * w / 3, y + h); cropContext.moveTo(x, y + h / 3); cropContext.lineTo(x + w, y + h / 3); cropContext.moveTo(x, y + 2 * h / 3); cropContext.lineTo(x + w, y + 2 * h / 3); cropContext.stroke();
      const handle = Math.max(6, canvas.width / 140);
      cropContext.fillStyle = "#ffffff";
      [[x,y],[x+w/2,y],[x+w,y],[x,y+h/2],[x+w,y+h/2],[x,y+h],[x+w/2,y+h],[x+w,y+h]].forEach(([hx,hy]) => cropContext.fillRect(hx-handle/2, hy-handle/2, handle, handle));
      return;
    }
    const rotated = Math.abs(state.rotation % 180) === 90;
    const width = clamp(Math.round(Number(state.width) || image.naturalWidth), 1, 12000);
    const height = clamp(Math.round(Number(state.height) || image.naturalHeight), 1, 12000);
    const outW = rotated ? height : width;
    const outH = rotated ? width : height;
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, outW, outH);
    ctx.save();
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate(state.rotation * Math.PI / 180);
    ctx.scale(state.flipX ? -1 : 1, state.flipY ? -1 : 1);
    // Do not use ctx.filter here: some Safari/WebKit versions ignore it.
    const targetW = rotated ? outH : outW;
    const targetH = rotated ? outW : outH;
    const sx = clamp(Math.round(state.cropX), 0, image.naturalWidth - 1);
    const sy = clamp(Math.round(state.cropY), 0, image.naturalHeight - 1);
    const sw = clamp(Math.round(state.cropWidth), 1, image.naturalWidth - sx);
    const sh = clamp(Math.round(state.cropHeight), 1, image.naturalHeight - sy);
    const scale = state.fit === "contain"
      ? Math.min(targetW / sw, targetH / sh)
      : Math.max(targetW / sw, targetH / sh);
    const drawW = sw * scale;
    const drawH = sh * scale;
    ctx.drawImage(image, sx, sy, sw, sh, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
    // Adjust image pixels explicitly for consistent Safari, Chrome iOS, Android,
    // and desktop behavior. Apply before text so overlays remain crisp.
    applyCanvasAdjustments(canvas, state);
    state.texts.forEach((layer) => {
      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.translate(layer.x * outW, layer.y * outH);
      ctx.rotate(layer.rotation * Math.PI / 180);
      const weight = layer.bold ? "700 " : "400 ";
      const style = layer.italic ? "italic " : "";
      ctx.font = style + weight + layer.size + "px " + JSON.stringify(layer.font);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(0,0,0,.45)";
      ctx.lineWidth = Math.max(1, layer.size / 16);
      ctx.strokeText(layer.text, 0, 0, outW * 0.9);
      ctx.fillStyle = layer.color;
      ctx.fillText(layer.text, 0, 0, outW * 0.9);
      ctx.restore();
    });
  }, [cropMode]);

  useEffect(() => { if (hasImage) draw(doc); }, [doc, hasImage, draw]);
  useEffect(() => () => { if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current); }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuBarRef.current?.contains(event.target)) setMenuOpen(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const change = useCallback((patch: Partial<EditorState>) => {
    historyRef.current = [...historyRef.current.slice(-49), doc];
    futureRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
    setDoc({ ...doc, ...patch });
  }, [doc]);

  async function chooseFile(file?: File) {
    if (!file) return;
    setError(""); setStatus("");
    if (file.size > maxBytes) { setError("Choose an image smaller than 25 MB."); return; }
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setError("Choose a raster image such as PNG, JPEG, WebP, GIF, or AVIF.");
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url);
      if (image.naturalWidth * image.naturalHeight > maxPixels) {
        URL.revokeObjectURL(url);
        setError("This image exceeds 50 megapixels. Choose a smaller image to protect browser memory.");
        return;
      }
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = url;
      imageRef.current = image;
      sourceFileRef.current = file;
      const initial = defaults(image.naturalWidth, image.naturalHeight);
      historyRef.current = [];
      futureRef.current = [];
      setCanUndo(false); setCanRedo(false);
      setDoc(initial);
      setFilterPreset("custom");
      setFileName(file.name.replace(/\.[^.]+$/, "") || "gaget-photo");
      setHasImage(true);
      setStatus("Photo loaded locally. Your original file has not been changed or uploaded.");
    } catch (e) {
      URL.revokeObjectURL(url);
      setError(e instanceof Error ? e.message : "Could not open this image.");
    }
  }

  function undo() {
    const previous = historyRef.current.pop();
    if (!previous) return;
    futureRef.current = [...futureRef.current, doc];
    setDoc(previous);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  }
  function redo() {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current = [...historyRef.current, doc];
    setDoc(next);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  }
  function resetEdits() {
    const image = imageRef.current;
    if (!image) return;
    change(defaults(image.naturalWidth, image.naturalHeight));
    setStatus("Edits reset. The original photo is still available.");
  }
  function updateText(id: number, patch: Partial<TextLayer>) {
    change({ texts: doc.texts.map((layer) => layer.id === id ? { ...layer, ...patch } : layer) });
  }
  function addText(event?: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = event && rect ? clamp((event.clientX - rect.left) / rect.width, 0.05, 0.95) : 0.5;
    const y = event && rect ? clamp((event.clientY - rect.top) / rect.height, 0.05, 0.95) : 0.5;
    const layer: TextLayer = {
      id: nextTextId.current++, text: "Your text", x, y, size: Math.max(18, Math.round((doc.width || 800) / 18)),
      color: "#FFFFFF", font: "Arial", bold: true, italic: false, rotation: 0, opacity: 100,
    };
    change({ texts: [...doc.texts, layer], selectedText: layer.id });
    setActivePanel("text");
  }
  function handleCropPointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!cropMode || !imageRef.current) return;
    const canvas = event.currentTarget; const rect = canvas.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width * canvas.width, 0, canvas.width);
    const y = clamp((event.clientY - rect.top) / rect.height * canvas.height, 0, canvas.height);
    const edge = Math.max(18, canvas.width / rect.width * 20);
    const left = Math.abs(x - doc.cropX) <= edge; const right = Math.abs(x - (doc.cropX + doc.cropWidth)) <= edge;
    const top = Math.abs(y - doc.cropY) <= edge; const bottom = Math.abs(y - (doc.cropY + doc.cropHeight)) <= edge;
    const inside = x >= doc.cropX && x <= doc.cropX + doc.cropWidth && y >= doc.cropY && y <= doc.cropY + doc.cropHeight;
    const mode = (left || right || top || bottom) ? "resize" : !inside ? "new" : "move";
    cropDragRef.current = { startX: x, startY: y, originX: doc.cropX, originY: doc.cropY, originW: doc.cropWidth, originH: doc.cropHeight, sourceW: canvas.width, sourceH: canvas.height, mode, left: mode === "resize" && left && !right, right: mode === "resize" && right && !left, top: mode === "resize" && top && !bottom, bottom: mode === "resize" && bottom && !top };
    historyRef.current = [...historyRef.current.slice(-49), doc]; futureRef.current = []; setCanUndo(true); setCanRedo(false);
    canvas.setPointerCapture(event.pointerId); event.preventDefault();
  }
  function handleCropPointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = cropDragRef.current;
    if (!cropMode || !imageRef.current) return;
    if (!drag) {
      const rect = event.currentTarget.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width * event.currentTarget.width, 0, event.currentTarget.width);
      const py = clamp((event.clientY - rect.top) / rect.height * event.currentTarget.height, 0, event.currentTarget.height);
      const hit = Math.max(18, event.currentTarget.width / rect.width * 20);
      const left = Math.abs(px - doc.cropX) <= hit;
      const right = Math.abs(px - (doc.cropX + doc.cropWidth)) <= hit;
      const top = Math.abs(py - doc.cropY) <= hit;
      const bottom = Math.abs(py - (doc.cropY + doc.cropHeight)) <= hit;
      const inside = px >= doc.cropX && px <= doc.cropX + doc.cropWidth && py >= doc.cropY && py <= doc.cropY + doc.cropHeight;
      event.currentTarget.style.cursor = (left || right) && (top || bottom) ? ((left === top) ? "nwse-resize" : "nesw-resize") : left || right ? "ew-resize" : top || bottom ? "ns-resize" : inside ? "move" : "crosshair";
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width * event.currentTarget.width, 0, drag.sourceW);
    const y = clamp((event.clientY - rect.top) / rect.height * event.currentTarget.height, 0, drag.sourceH);
    const dx = x - drag.startX, dy = y - drag.startY; let cropX = drag.originX, cropY = drag.originY, cropWidth = drag.originW, cropHeight = drag.originH;
    if (drag.mode === "new") { cropX = Math.min(drag.startX, x); cropY = Math.min(drag.startY, y); cropWidth = Math.abs(dx); cropHeight = Math.abs(dy); }
    else if (drag.mode === "move") { cropX = clamp(drag.originX + dx, 0, drag.sourceW - drag.originW); cropY = clamp(drag.originY + dy, 0, drag.sourceH - drag.originH); }
    else {
      if (drag.left) { cropX = clamp(drag.originX + dx, 0, drag.originX + drag.originW - 1); cropWidth = drag.originW + drag.originX - cropX; }
      if (drag.right) cropWidth = clamp(drag.originW + dx, 1, drag.sourceW - drag.originX);
      if (drag.top) { cropY = clamp(drag.originY + dy, 0, drag.originY + drag.originH - 1); cropHeight = drag.originH + drag.originY - cropY; }
      if (drag.bottom) cropHeight = clamp(drag.originH + dy, 1, drag.sourceH - drag.originY);
    }
    setDoc({ ...doc, cropX: Math.round(cropX), cropY: Math.round(cropY), cropWidth: Math.max(1, Math.round(cropWidth)), cropHeight: Math.max(1, Math.round(cropHeight)) });
  }
  function handleCropPointerUp() { cropDragRef.current = null; }

  function handleCanvasClick(event: MouseEvent<HTMLCanvasElement>) {
    if (activePanel === "color") {
      const canvas = event.currentTarget; const rect = canvas.getBoundingClientRect();
      const x = clamp(Math.floor((event.clientX - rect.left) / rect.width * canvas.width), 0, canvas.width - 1);
      const y = clamp(Math.floor((event.clientY - rect.top) / rect.height * canvas.height), 0, canvas.height - 1);
      const pixel = canvas.getContext("2d")?.getImageData(x, y, 1, 1).data;
      if (pixel) setStatus("Picked color: #" + [pixel[0], pixel[1], pixel[2]].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase());
    } else if (activePanel === "text" && doc.selectedText !== null) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0.02, 0.98);
      const y = clamp((event.clientY - rect.top) / rect.height, 0.02, 0.98);
      updateText(doc.selectedText, { x, y });
    }
  }
  async function exportImage() {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    setError(""); setStatus("");
    if (canvas.width * canvas.height > maxPixels) {
      setError("Export dimensions exceed 50 megapixels. Reduce the output dimensions first.");
      return;
    }
    const mime = doc.format;
    let exportCanvas = canvas;
    if (mime === "image/jpeg") {
      exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportContext = exportCanvas.getContext("2d");
      if (!exportContext) { setError("Could not prepare the JPEG export."); return; }
      exportContext.fillStyle = "#FFFFFF";
      exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      exportContext.drawImage(canvas, 0, 0);
    }
    const blob = await new Promise<Blob | null>((resolve) => exportCanvas.toBlob(resolve, mime, clamp(doc.quality, 10, 100) / 100));
    if (!blob) { setError("Your browser could not export this format. Try PNG or JPEG."); return; }
    const extension = mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
    downloadBlob(blob, fileName + "-edited." + extension);
    setStatus("Exported " + canvas.width + " × " + canvas.height + " pixels (" + (blob.size / 1024).toFixed(1) + " KB). Processing stayed in your browser.");
  }
  function generatePalette() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const sample = document.createElement("canvas"); sample.width = 64; sample.height = 64;
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleCtx) return;
    sampleCtx.drawImage(canvas, 0, 0, 64, 64);
    const data = sampleCtx.getImageData(0, 0, 64, 64).data;
    const counts = new Map<string, number>();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 32) continue;
      const rgb = [data[i], data[i + 1], data[i + 2]].map(v => clamp(Math.round(v / 32) * 32, 0, 255));
      const hex = "#" + rgb.map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
      counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }
    setPaletteColors([...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([hex]) => hex));
    setStatus("Generated a six-color palette from a downsampled canvas preview.");
  }
  async function createBase64() {
    const file = sourceFileRef.current;
    if (!file) { setError("Open a photo before converting it to Base64."); return; }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    setBase64Output("data:" + (file.type || "application/octet-stream") + ";base64," + window.btoa(binary));
    setStatus("Base64 data URL generated locally.");
  }
  function decodeBase64Image() {
    const value = base64Input.trim();
    const match = value.match(/^data:(image\/(?:png|jpeg|webp|gif|avif));base64,([A-Za-z0-9+/=\s]+)$/i);
    if (!match) { setError("Enter a valid image data URL (PNG, JPEG, WebP, GIF, or AVIF)."); return; }
    try {
      const binary = window.atob(match[2].replace(/\s/g, ""));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      downloadBlob(new Blob([bytes], { type: match[1] }), "gaget-decoded-image." + match[1].split("/")[1].replace("jpeg", "jpg"));
      setError(""); setStatus("Decoded and downloaded the image data URL locally.");
    } catch {
      setError("The Base64 image data is invalid or incomplete.");
    }
  }
  function exportFavicon(size: number) {
    const source = canvasRef.current;
    if (!source) return;
    const output = document.createElement("canvas"); output.width = size; output.height = size;
    const ctx = output.getContext("2d");
    if (!ctx) { setError("Could not create the favicon canvas."); return; }
    const scale = Math.min(size / source.width, size / source.height);
    const width = source.width * scale, height = source.height * scale;
    ctx.drawImage(source, (size - width) / 2, (size - height) / 2, width, height);
    output.toBlob(blob => { if (blob) { downloadBlob(blob, fileName + "-favicon-" + size + ".png"); setStatus("Exported " + size + " × " + size + " favicon PNG."); } else setError("Could not export this favicon size."); }, "image/png");
  }
  async function onSvgChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (file.size > maxBytes || !(file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg"))) { setError("Choose an SVG file smaller than 25 MB."); return; }
    const source = await file.text();
    if (!/<svg\b/i.test(source)) { setError("The selected file does not contain an SVG root element."); return; }
    const optimized = source.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/[\t\r\n]+/g, " ").replace(/ {2,}/g, " ").trim();
    setSvgOutput(optimized); setError(""); setStatus("SVG whitespace and comments optimized locally. Review the result before using it.");
  }
  async function createCollage() {
    if (collageFiles.length < 2) { setError("Choose at least two images to create a collage."); return; }\n    if (collageFiles.length > 9) { setError("Choose no more than nine images for a collage."); return; }
    try {
      const images = await Promise.all(collageFiles.slice(0, 9).map(async file => {
        if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new Error("Choose raster images for a collage.");
        if (file.size > maxBytes) throw new Error("Each collage image must be smaller than 25 MB.");
        const url = URL.createObjectURL(file);
        try { return await loadImage(url); } finally { URL.revokeObjectURL(url); }
      }));
      const cell = 480, columns = Math.ceil(Math.sqrt(images.length)), rows = Math.ceil(images.length / columns);
      const collage = document.createElement("canvas"); collage.width = columns * cell; collage.height = rows * cell;
      const ctx = collage.getContext("2d");
      if (!ctx) throw new Error("Could not create the collage canvas.");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, collage.width, collage.height);
      images.forEach((image, index) => {
        const x = (index % columns) * cell, y = Math.floor(index / columns) * cell;
        const scale = Math.max(cell / image.naturalWidth, cell / image.naturalHeight);
        const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
        ctx.save(); ctx.beginPath(); ctx.rect(x, y, cell, cell); ctx.clip();
        ctx.drawImage(image, x + (cell - width) / 2, y + (cell - height) / 2, width, height); ctx.restore();
      });
      collage.toBlob(blob => { if (blob) downloadBlob(blob, "gaget-collage.png"); else setError("Could not export the collage."); }, "image/png");
      setStatus("Created a " + columns + " × " + rows + " collage from " + images.length + " images.");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create collage."); }
  }
  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    void chooseFile(event.target.files?.[0]);
    event.target.value = "";
  }
  const selectedText = doc.texts.find((layer) => layer.id === doc.selectedText) ?? null;

  return <div className="flex h-[100dvh] min-h-[560px] flex-col overflow-hidden bg-background text-foreground">
    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={onFileChange} className="hidden" />
    <input ref={svgInputRef} type="file" accept="image/svg+xml,.svg" onChange={(event) => void onSvgChange(event)} className="hidden" />
    <input ref={collageInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple onChange={(event) => setCollageFiles(Array.from(event.target.files ?? []))} className="hidden" />
    <div ref={menuBarRef} className="flex h-10 shrink-0 items-center gap-1 border-b border-border bg-card px-2 text-sm">
      <LocaleLink href="/" aria-label="Back to GaGet.dev home" title="Back to GaGet.dev home" className="mr-1 inline-flex h-8 shrink-0 items-center gap-2 rounded-md px-2 font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Home className="h-4 w-4" /><span className="hidden sm:inline">GaGet.dev</span></LocaleLink>
      <span className="mr-1 hidden h-5 border-l border-border md:block" />
      
      <span className="mr-2 hidden font-medium text-muted-foreground sm:inline">Photo Editor</span>
      {(["File", "Edit", "Image", "Adjust", "Tools", "Help"] as const).map((menu) => <div key={menu} className="relative"><button type="button" className={"rounded-md px-3 py-1.5 hover:bg-accent " + (menuOpen === menu ? "bg-accent" : "")} onClick={() => setMenuOpen(menuOpen === menu ? null : menu)}>{menu}</button>{menuOpen === menu && <div className="absolute left-0 top-9 z-50 min-w-48 rounded-lg border border-border bg-popover p-1.5 shadow-xl">
        {menu === "File" && <><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { fileInputRef.current?.click(); setMenuOpen(null); }}>Open photo…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" disabled={!hasImage || cropMode} onClick={() => { void exportImage(); setMenuOpen(null); }}>Export image…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" onClick={() => { resetEdits(); setMenuOpen(null); }}>Reset edits</button><div className="my-1 border-t border-border" /><p className="px-3 py-2 text-xs text-muted-foreground">Images stay on this device while you edit.</p></>}
        {menu === "Edit" && <><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" disabled={!canUndo} onClick={() => { undo(); setMenuOpen(null); }}>Undo</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" disabled={!canRedo} onClick={() => { redo(); setMenuOpen(null); }}>Redo</button></>}
        {menu === "Image" && <><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" onClick={() => { setCropMode(true); setActivePanel("transform"); setMenuOpen(null); }}>Crop…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" onClick={() => { setCropMode(false); setActivePanel("transform"); setMenuOpen(null); }}>Resize & rotate…</button></>}
        {menu === "Adjust" && <><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" onClick={() => { setActivePanel("adjust"); setCropMode(false); setMenuOpen(null); }}>Color & filters…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent disabled:opacity-40" onClick={() => { setActivePanel("color"); setCropMode(false); setMenuOpen(null); }}>Color picker…</button></>}
        {menu === "Tools" && <><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("text"); setCropMode(false); setMenuOpen(null); }}>Text & watermark…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("metadata"); setCropMode(false); setMenuOpen(null); }}>Image information…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("convert"); setCropMode(false); setMenuOpen(null); }}>Export & format…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("print"); setCropMode(false); setMenuOpen(null); }}>Print size & DPI…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("base64"); setCropMode(false); setMenuOpen(null); }}>Image to Base64…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("base64decode"); setCropMode(false); setMenuOpen(null); }}>Base64 to image…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("favicon"); setCropMode(false); setMenuOpen(null); }}>Favicon generator…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("collage"); setCropMode(false); setMenuOpen(null); }}>Collage maker…</button><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setActivePanel("svg"); setCropMode(false); setMenuOpen(null); }}>SVG optimizer…</button></>}
        {menu === "Help" && <><p className="px-3 py-2 text-sm font-medium">GaGet Photo Editor</p><p className="max-w-64 px-3 pb-2 text-xs leading-5 text-muted-foreground">A lightweight editor. Adjustments are rendered locally in your browser; export creates a new file and never overwrites your original.</p><button className="block w-full rounded-md px-3 py-2 text-left hover:bg-accent" onClick={() => { setMenuOpen(null); setStatus("Tip: select Crop, drag any edge or corner to refine the selection, then choose Apply crop."); }}>Crop & editing tips</button></>}
      </div>}</div>)}
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-emerald-500" /><span className="hidden sm:inline">Private · processed in your browser</span></div>
    </div>

    <div className="flex min-h-10 shrink-0 flex-wrap items-center gap-1 border-b border-border bg-background px-3 py-1.5">
      <span className="max-w-48 truncate text-xs text-muted-foreground" title={fileName}>{hasImage ? `${fileName} · ${doc.width} × ${doc.height} px` : "No image open"}</span>
      <div className="mx-1 hidden h-6 border-l border-border sm:block" />
      <Button size="icon" variant="outline" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo"><Undo2 className="h-4 w-4" /></Button>
      <Button size="icon" variant="outline" onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo"><Redo2 className="h-4 w-4" /></Button>
      
      <div className="ml-auto flex items-center gap-1">
        <span className="mr-2 hidden max-w-40 truncate text-xs text-muted-foreground md:inline">{hasImage ? `${fileName} · ${doc.width} × ${doc.height}` : "No image open"}</span>
        <Button size="icon" variant="ghost" aria-label="Zoom out" title="Zoom out" disabled={zoom <= 25} onClick={() => setZoom((value) => Math.max(25, value - 25))}><ZoomOut className="h-4 w-4" /></Button>
        <button className="min-w-12 rounded-md px-1 py-2 text-xs tabular-nums hover:bg-accent" onClick={() => setZoom(90)} aria-label="Reset zoom" title="Reset zoom">{zoom}%</button>
        <Button size="icon" variant="ghost" aria-label="Zoom in" title="Zoom in" disabled={zoom >= 200} onClick={() => setZoom((value) => Math.min(200, value + 25))}><ZoomIn className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" aria-label="Fit canvas" title="Fit canvas" onClick={() => setZoom(90)}><Maximize2 className="h-4 w-4" /></Button>
        
      </div>
    </div>

    <div className="relative flex min-h-0 flex-1 overflow-hidden">

      <Card className="flex min-h-0 min-w-0 flex-1 flex-col rounded-none border-0 shadow-none">
        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <div data-testid="canvas-scroll-area" className={"flex min-h-0 flex-1 overflow-auto bg-[#1e1e1e] p-3 sm:p-5 " + (zoom > 100 ? "items-start justify-start" : "items-center justify-center")}>
            {hasImage
              ? <canvas ref={canvasRef} onClick={handleCanvasClick} onPointerDown={handleCropPointerDown} onPointerMove={handleCropPointerMove} onPointerUp={handleCropPointerUp} onPointerCancel={handleCropPointerUp} aria-label={cropMode ? "Crop selection. Drag inside to move, or drag a side or corner to resize." : "Photo editing canvas. In text mode, click to position the selected text."} className={"shrink-0 object-contain shadow-[0_2px_12px_rgba(0,0,0,0.28)] " + (cropMode ? "cursor-crosshair touch-none" : activePanel === "text" && selectedText ? "cursor-crosshair" : activePanel === "color" ? "cursor-crosshair" : "")} style={{ width: `${zoom}%`, height: "auto", maxWidth: "none", maxHeight: "none" }} />
              : <div className="max-w-sm py-12 text-center text-white"><ImagePlus className="mx-auto h-12 w-12 text-slate-400" /><p className="mt-3 font-medium">Your canvas is ready</p><p className="mt-1 text-sm text-slate-400">Open a photo to crop, adjust color, rotate, add text, and export from one workspace.</p><Button className="mt-4" onClick={() => fileInputRef.current?.click()}>Choose image</Button><p className="mt-3 text-xs text-slate-500">PNG · JPEG · WebP · GIF · AVIF</p></div>}
          </div>
          {hasImage && <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2 text-[11px] text-slate-400"><span>{cropMode ? "Drag inside the crop to move it; drag edges or corners to resize." : activePanel === "text" && selectedText ? "Click the photo to position the selected text." : "Edits remain reversible until you export."}</span><span>{imageRef.current?.naturalWidth} × {imageRef.current?.naturalHeight} px</span></div>}
        </CardContent>
      </Card>

      <div className={(activePanel === "none" ? "hidden " : "absolute inset-0 z-20 flex ") + "bg-background/95 backdrop-blur-sm md:inset-y-0 md:left-auto md:right-0 md:w-[360px] md:border-l md:border-border"} data-testid="feature-panel" aria-label="Editing feature panel">
        <div className="flex min-h-0 w-full flex-col overflow-hidden bg-card shadow-xl">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4"><div className="min-w-0"><p className="text-sm font-semibold">{({adjust:"Color & filters",transform:"Crop & transform",text:"Text & watermark",color:"Color picker & palette",metadata:"Image information",convert:"Export & format",print:"Print size & DPI",base64:"Image to Base64",base64decode:"Base64 to image",favicon:"Favicon generator",collage:"Collage maker",svg:"SVG optimizer"} as Record<string,string>)[activePanel] ?? "Editing tool"}</p><p className="text-[11px] text-muted-foreground">Changes are previewed on the canvas</p></div><button type="button" aria-label="Close feature panel" className="rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => { setActivePanel("none"); setCropMode(false); }}>×</button></div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {!hasImage && !["svg", "collage"].includes(activePanel) && <p className="text-sm text-muted-foreground">Choose a photo to enable editing controls.</p>}

          {hasImage && activePanel === "adjust" && <div className="space-y-4">
            <label className="block space-y-2 text-sm">Filter preset
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={filterPreset} onChange={(e) => {
                setFilterPreset(e.target.value);
                const presets: Record<string, Partial<EditorState>> = {
                  original: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
                  vivid: { brightness: 105, contrast: 112, saturation: 145, grayscale: 0, sepia: 0, blur: 0 },
                  warm: { brightness: 103, contrast: 105, saturation: 112, grayscale: 0, sepia: 22, blur: 0 },
                  vintage: { brightness: 98, contrast: 92, saturation: 72, grayscale: 0, sepia: 35, blur: 0 },
                  mono: { brightness: 100, contrast: 110, saturation: 100, grayscale: 100, sepia: 0, blur: 0 },
                  dramatic: { brightness: 92, contrast: 140, saturation: 85, grayscale: 0, sepia: 0, blur: 0 },
                };
                if (presets[e.target.value]) change(presets[e.target.value]);
              }}>
                <option value="custom">Choose a preset…</option><option value="original">Original</option><option value="vivid">Vivid</option><option value="warm">Warm</option><option value="vintage">Vintage</option><option value="mono">Black & white</option><option value="dramatic">Dramatic</option>
              </select>
            </label>
            {([
              ["Brightness", "brightness", 0, 200, "%"],
              ["Contrast", "contrast", 0, 200, "%"],
              ["Saturation", "saturation", 0, 200, "%"],
              ["Grayscale", "grayscale", 0, 100, "%"],
              ["Sepia", "sepia", 0, 100, "%"],
              ["Blur", "blur", 0, 12, "px"],
            ] as const).map(([label, key, min, max, unit]) => <label key={key} className="block space-y-1.5 text-sm">{label}<span className="float-right text-xs text-muted-foreground">{doc[key]}{unit}</span><input aria-label={label} className="w-full accent-primary" type="range" min={min} max={max} value={doc[key]} onChange={(e) => { setFilterPreset("custom"); change({ [key]: Number(e.target.value) } as Partial<EditorState>); }} /></label>)}
          </div>}

          {hasImage && activePanel === "transform" && <div className="space-y-4">
            {cropMode && <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3"><p className="text-sm font-medium">Interactive crop</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Drag inside the selection to move it. Drag any edge or corner to resize the crop. The export will contain only the selected area.</p><Button className="mt-3 w-full" onClick={() => { change({ width: doc.cropWidth, height: doc.cropHeight }); setCropMode(false); setStatus(`Crop applied: ${doc.cropWidth} × ${doc.cropHeight} pixels. Export when ready.`); }}><Check className="h-4 w-4" />Apply crop</Button><Button variant="ghost" className="mt-1 w-full" onClick={() => { const image = imageRef.current; if (image) change({ cropX: 0, cropY: 0, cropWidth: image.naturalWidth, cropHeight: image.naturalHeight }); }}><X className="h-4 w-4" />Reset crop selection</Button></div>}
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">Width (px)<Input type="number" min="1" max={Math.min(12000, Math.floor(maxPixels / doc.height))} value={doc.width} onChange={(e) => change({ width: clamp(Number(e.target.value) || 1, 1, Math.min(12000, Math.floor(maxPixels / doc.height))) })} /></label>
              <label className="space-y-1 text-sm">Height (px)<Input type="number" min="1" max={Math.min(12000, Math.floor(maxPixels / doc.width))} value={doc.height} onChange={(e) => change({ height: clamp(Number(e.target.value) || 1, 1, Math.min(12000, Math.floor(maxPixels / doc.width))) })} /></label>
            </div>
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-sm font-medium">Crop rectangle (source pixels)</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm">X<Input type="number" min="0" max={imageRef.current?.naturalWidth ?? 12000} value={doc.cropX} onChange={(e) => change({ cropX: clamp(Number(e.target.value) || 0, 0, (imageRef.current?.naturalWidth ?? 12000) - 1) })} /></label>
                <label className="space-y-1 text-sm">Y<Input type="number" min="0" max={imageRef.current?.naturalHeight ?? 12000} value={doc.cropY} onChange={(e) => change({ cropY: clamp(Number(e.target.value) || 0, 0, (imageRef.current?.naturalHeight ?? 12000) - 1) })} /></label>
                <label className="space-y-1 text-sm">Crop width<Input type="number" min="1" max={imageRef.current?.naturalWidth ?? 12000} value={doc.cropWidth} onChange={(e) => change({ cropWidth: clamp(Number(e.target.value) || 1, 1, imageRef.current?.naturalWidth ?? 12000) })} /></label>
                <label className="space-y-1 text-sm">Crop height<Input type="number" min="1" max={imageRef.current?.naturalHeight ?? 12000} value={doc.cropHeight} onChange={(e) => change({ cropHeight: clamp(Number(e.target.value) || 1, 1, imageRef.current?.naturalHeight ?? 12000) })} /></label>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={doc.fit === "contain"} onChange={(e) => change({ fit: e.target.checked ? "contain" : "cover" })} /> Fit whole photo inside output (contain)</label>
            <div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => change({ rotation: (doc.rotation + 270) % 360 })}>Rotate left 90°</Button><Button variant="outline" onClick={() => change({ rotation: (doc.rotation + 90) % 360 })}>Rotate right 90°</Button><Button variant="outline" onClick={() => change({ flipX: !doc.flipX })}>Flip horizontal</Button><Button variant="outline" onClick={() => change({ flipY: !doc.flipY })}>Flip vertical</Button></div>
            <p className="text-xs leading-5 text-muted-foreground">Dimensions are exact output dimensions. With “cover”, the photo fills the canvas and may be cropped; “contain” keeps the full photo visible.</p>
          </div>}

          {hasImage && activePanel === "text" && <div className="space-y-3">
            <Button className="w-full" onClick={() => addText()}><Type className="mr-2 h-4 w-4" /> Add text layer</Button>
            {doc.texts.length > 0 && <label className="block space-y-1 text-sm">Text layer<select className="h-10 w-full rounded-md border border-input bg-background px-3" value={doc.selectedText ?? ""} onChange={(e) => change({ selectedText: e.target.value ? Number(e.target.value) : null })}>{doc.texts.map((layer) => <option key={layer.id} value={layer.id}>{layer.text || "Untitled text"}</option>)}</select></label>}
            {selectedText && <>
              <label className="block space-y-1 text-sm">Text<Input value={selectedText.text} onChange={(e) => updateText(selectedText.id, { text: e.target.value })} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm">Font<select className="h-10 w-full rounded-md border border-input bg-background px-2" value={selectedText.font} onChange={(e) => updateText(selectedText.id, { font: e.target.value })}>{fonts.map((font) => <option key={font}>{font}</option>)}</select></label>
                <label className="space-y-1 text-sm">Color<Input type="color" value={selectedText.color} onChange={(e) => updateText(selectedText.id, { color: e.target.value })} className="h-10 p-1" /></label>
              </div>
              <label className="block space-y-1 text-sm">Font size <span className="float-right text-xs text-muted-foreground">{selectedText.size}px</span><input className="w-full accent-primary" type="range" min="8" max={Math.max(120, Math.min(500, doc.width / 2))} value={selectedText.size} onChange={(e) => updateText(selectedText.id, { size: Number(e.target.value) })} /></label>
              <div className="grid grid-cols-2 gap-2"><Button variant={selectedText.bold ? "default" : "outline"} onClick={() => updateText(selectedText.id, { bold: !selectedText.bold })}>Bold</Button><Button variant={selectedText.italic ? "default" : "outline"} onClick={() => updateText(selectedText.id, { italic: !selectedText.italic })}>Italic</Button></div>
              <label className="block space-y-1 text-sm">Rotation <span className="float-right text-xs text-muted-foreground">{selectedText.rotation}°</span><input className="w-full accent-primary" type="range" min="-180" max="180" value={selectedText.rotation} onChange={(e) => updateText(selectedText.id, { rotation: Number(e.target.value) })} /></label>
              <label className="block space-y-1 text-sm">Opacity <span className="float-right text-xs text-muted-foreground">{selectedText.opacity}%</span><input className="w-full accent-primary" type="range" min="10" max="100" value={selectedText.opacity} onChange={(e) => updateText(selectedText.id, { opacity: Number(e.target.value) })} /></label>
              <Button variant="outline" className="w-full" onClick={() => change({ texts: doc.texts.filter((layer) => layer.id !== selectedText.id), selectedText: null })}>Remove selected text</Button>
              <p className="text-xs leading-5 text-muted-foreground">Click anywhere on the photo to position the selected text. Use multiple text layers for captions, labels, or watermarks.</p>
            </>}
          </div>}

          {hasImage && activePanel === "color" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Click a pixel on the canvas to sample its HEX color, or generate a six-color palette.</p><Button variant="outline" className="w-full" onClick={generatePalette}>Generate color palette</Button>{paletteColors.length > 0 && <div className="grid grid-cols-2 gap-2">{paletteColors.map(color => <div key={color} className="flex items-center gap-2 rounded-md border border-border p-2 text-xs"><span className="h-6 w-6 rounded border" style={{backgroundColor:color}} />{color}</div>)}</div>}</div>}
          {activePanel === "base64" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Convert the currently opened source file into a Base64 data URL locally.</p><Button className="w-full" disabled={!sourceFileRef.current} onClick={() => void createBase64()}>Generate Base64 data URL</Button><textarea aria-label="Base64 output" readOnly value={base64Output} rows={8} className="w-full resize-y rounded-md border border-input bg-background p-2 font-mono text-xs" placeholder="Base64 output will appear here" /></div>}
          {activePanel === "base64decode" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Paste a complete Base64 image data URL to decode and download it locally.</p><textarea aria-label="Base64 image input" value={base64Input} onChange={(e) => setBase64Input(e.target.value)} rows={8} className="w-full resize-y rounded-md border border-input bg-background p-2 font-mono text-xs" placeholder="data:image/png;base64,..." /><Button className="w-full" disabled={!base64Input.trim()} onClick={decodeBase64Image}>Decode and download image</Button></div>}
          {activePanel === "favicon" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Create a square PNG favicon from the current edited image.</p><div className="grid grid-cols-3 gap-2">{[16,32,48].map(size => <Button key={size} variant="outline" disabled={!hasImage} onClick={() => exportFavicon(size)}>{size} × {size}</Button>)}</div><p className="text-xs text-muted-foreground">Exports PNG files; ICO packaging is not included.</p></div>}
          {activePanel === "collage" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Select 2–9 images. The editor builds a square-cropped grid and downloads a PNG collage.</p><Button variant="outline" className="w-full" onClick={() => collageInputRef.current?.click()}>Choose collage images…</Button><p className="text-sm">{collageFiles.length} image(s) selected</p><Button className="w-full" disabled={collageFiles.length < 2} onClick={() => void createCollage()}>Create collage</Button></div>}
          {activePanel === "svg" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Remove comments and redundant whitespace from an SVG file. The SVG is never rendered or uploaded.</p><Button variant="outline" className="w-full" onClick={() => svgInputRef.current?.click()}>Choose SVG…</Button>{svgOutput && <><p className="text-xs text-muted-foreground">Optimized output: {svgOutput.length.toLocaleString()} characters</p><textarea aria-label="Optimized SVG" readOnly value={svgOutput} rows={8} className="w-full resize-y rounded-md border border-input bg-background p-2 font-mono text-xs" /><Button className="w-full" onClick={() => downloadBlob(new Blob([svgOutput], {type:"image/svg+xml"}), "optimized.svg")}>Download optimized SVG</Button></>}</div>}
          {hasImage && activePanel === "metadata" && <div className="space-y-3 text-sm"><div className="flex justify-between gap-3"><span className="text-muted-foreground">File</span><span className="max-w-48 truncate">{fileName}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Source type</span><span>{sourceFileRef.current?.type || "Unknown"}</span></div><div className="flex justify-between"><span className="text-muted-foreground">File size</span><span>{((sourceFileRef.current?.size ?? 0) / 1024).toFixed(1)} KB</span></div><div className="flex justify-between"><span className="text-muted-foreground">Source dimensions</span><span>{imageRef.current?.naturalWidth} × {imageRef.current?.naturalHeight} px</span></div><div className="flex justify-between"><span className="text-muted-foreground">Output dimensions</span><span>{doc.width} × {doc.height} px</span></div><div className="flex justify-between"><span className="text-muted-foreground">Aspect ratio</span><span>{(doc.width / Math.max(1, doc.height)).toFixed(3)} : 1</span></div><div className="flex justify-between"><span className="text-muted-foreground">Pixel count</span><span>{(doc.width * doc.height).toLocaleString()}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Export format</span><span>{doc.format.replace("image/","").toUpperCase()}</span></div><p className="text-xs text-muted-foreground">Exporting a canvas-rendered copy strips the original file's embedded metadata.</p><Button className="w-full" onClick={() => void exportImage()} disabled={cropMode}>Export metadata-free copy</Button></div>}
          {hasImage && activePanel === "convert" && <div className="space-y-3"><label className="block space-y-1 text-sm">Output format<select aria-label="Output format" className="h-10 w-full rounded-md border border-input bg-background px-3" value={doc.format} onChange={(e) => change({ format: e.target.value })}><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>{doc.format !== "image/png" && <label className="block space-y-1 text-sm">Quality <span className="float-right text-xs text-muted-foreground">{doc.quality}%</span><input aria-label="Export quality" className="w-full accent-primary" type="range" min="10" max="100" value={doc.quality} onChange={(e) => change({ quality: Number(e.target.value) })} /></label>}<Button className="w-full" disabled={cropMode} onClick={() => void exportImage()}><Download className="mr-2 h-4 w-4" />Export photo</Button></div>}
          {hasImage && activePanel === "print" && <div className="space-y-3"><p className="text-sm text-muted-foreground">Print size is estimated from output pixels and the selected DPI.</p><label className="block space-y-1 text-sm">Resolution (DPI)<select aria-label="Print resolution" className="h-10 w-full rounded-md border border-input bg-background px-3" value={printDpi} onChange={(e) => setPrintDpi(Number(e.target.value))}><option value="72">72 DPI · screen</option><option value="150">150 DPI · draft print</option><option value="300">300 DPI · print</option><option value="600">600 DPI · high detail</option></select></label><div className="rounded-lg border border-border p-3"><p className="text-sm font-medium">Estimated print size</p><p className="mt-1 text-lg tabular-nums">{(doc.width/printDpi).toFixed(2)} × {(doc.height/printDpi).toFixed(2)} inches</p><p className="text-xs text-muted-foreground">{(doc.width/printDpi*2.54).toFixed(1)} × {(doc.height/printDpi*2.54).toFixed(1)} cm</p></div></div>}
        </div>
        <div className="shrink-0 border-t border-border p-3"><Button variant="outline" className="w-full" onClick={() => { setActivePanel("none"); setCropMode(false); }}>Done</Button></div>
      </div>

    </div>

    {(error || status) && <div className="shrink-0 border-t border-border bg-card px-4 py-2 text-xs"><div className="mx-auto flex max-w-screen-2xl items-center gap-2">{error ? <span role="alert" className="text-destructive">{error}</span> : <span role="status" className="text-emerald-600 dark:text-emerald-400">{status}</span>}</div></div>}
  </div>;
}
