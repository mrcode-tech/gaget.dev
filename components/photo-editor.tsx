"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { Download, Undo2, Redo2, RotateCcw, ShieldCheck, Type, ImagePlus, Crop, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [activePanel, setActivePanel] = useState("adjust");
  const [filterPreset, setFilterPreset] = useState("custom");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const nextTextId = useRef(1);

  const draw = useCallback((state: EditorState) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
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
    ctx.filter = "brightness(" + state.brightness + "%) contrast(" + state.contrast + "%) saturate(" + state.saturation + "%) grayscale(" + state.grayscale + "%) sepia(" + state.sepia + "%) blur(" + state.blur + "px)";
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
    ctx.filter = "none";
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
  }, []);

  useEffect(() => { if (hasImage) draw(doc); }, [doc, hasImage, draw]);
  useEffect(() => () => { if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current); }, []);

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
      const initial = defaults(image.naturalWidth, image.naturalHeight);
      historyRef.current = [];
      futureRef.current = [];
      setCanUndo(false); setCanRedo(false);
      setDoc(initial);
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
  function handleCanvasClick(event: MouseEvent<HTMLCanvasElement>) {
    if (activePanel === "text" && doc.selectedText !== null) {
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
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, clamp(doc.quality, 10, 100) / 100));
    if (!blob) { setError("Your browser could not export this format. Try PNG or JPEG."); return; }
    const extension = mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
    downloadBlob(blob, fileName + "-edited." + extension);
    setStatus("Exported " + canvas.width + " × " + canvas.height + " pixels (" + (blob.size / 1024).toFixed(1) + " KB). Processing stayed in your browser.");
  }
  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    void chooseFile(event.target.files?.[0]);
    event.target.value = "";
  }
  const selectedText = doc.texts.find((layer) => layer.id === doc.selectedText) ?? null;

  return <div className="space-y-5">
    <div className="flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-500/5 p-4">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      <div><p className="text-sm font-semibold">Private photo editing — right in your browser</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your photo is never uploaded to GaGet.dev. Editing happens on this device. Your original file remains unchanged; only the exported copy contains your edits.</p></div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => fileInputRef.current?.click()}><ImagePlus className="mr-2 h-4 w-4" /> {hasImage ? "Change photo" : "Open photo"}</Button>
        <Input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={onFileChange} className="hidden" />
        <Button variant="outline" onClick={undo} disabled={!canUndo} aria-label="Undo"><Undo2 className="mr-2 h-4 w-4" /> Undo</Button>
        <Button variant="outline" onClick={redo} disabled={!canRedo} aria-label="Redo"><Redo2 className="mr-2 h-4 w-4" /> Redo</Button>
        <Button variant="outline" onClick={resetEdits} disabled={!hasImage}><RotateCcw className="mr-2 h-4 w-4" /> Reset edits</Button>
      </div>
      <Button onClick={() => void exportImage()} disabled={!hasImage}><Download className="mr-2 h-4 w-4" /> Export photo</Button>
    </div>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="min-w-0">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">{hasImage ? fileName : "Your photo canvas"}</CardTitle>
          {hasImage && <span className="text-xs text-muted-foreground">{doc.width} × {doc.height} px</span>}
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40 p-3 sm:min-h-[460px]">
            {hasImage
              ? <canvas ref={canvasRef} onClick={handleCanvasClick} aria-label="Photo editing canvas. In text mode, click to position the selected text." className={"max-h-[72vh] max-w-full object-contain " + (activePanel === "text" && selectedText ? "cursor-crosshair" : "")} style={{ width: "auto", height: "auto" }} />
              : <div className="max-w-sm py-12 text-center"><ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-3 font-medium">Start with a photo</p><p className="mt-1 text-sm text-muted-foreground">Open an image to crop, adjust colors, add text, and export from one canvas.</p><Button className="mt-4" onClick={() => fileInputRef.current?.click()}>Choose image</Button></div>}
          </div>
          {hasImage && <p className="mt-2 text-xs text-muted-foreground">{activePanel === "text" && selectedText ? "Click the photo to move the selected text." : "One canvas, non-destructive controls, and undo/redo history."}</p>}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader><CardTitle className="text-sm">Edit photo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            <button className={"rounded-md px-2 py-2 text-xs " + (activePanel === "adjust" ? "bg-background font-semibold shadow-sm" : "text-muted-foreground")} onClick={() => setActivePanel("adjust")}><SlidersHorizontal className="mx-auto mb-1 h-4 w-4" />Adjust</button>
            <button className={"rounded-md px-2 py-2 text-xs " + (activePanel === "transform" ? "bg-background font-semibold shadow-sm" : "text-muted-foreground")} onClick={() => setActivePanel("transform")}><Crop className="mx-auto mb-1 h-4 w-4" />Size & rotate</button>
            <button className={"rounded-md px-2 py-2 text-xs " + (activePanel === "text" ? "bg-background font-semibold shadow-sm" : "text-muted-foreground")} onClick={() => setActivePanel("text")}><Type className="mx-auto mb-1 h-4 w-4" />Text</button>
          </div>

          {!hasImage && <p className="text-sm text-muted-foreground">Choose a photo to enable editing controls.</p>}

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
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">Width (px)<Input type="number" min="1" max="12000" value={doc.width} onChange={(e) => change({ width: clamp(Number(e.target.value) || 1, 1, 12000) })} /></label>
              <label className="space-y-1 text-sm">Height (px)<Input type="number" min="1" max="12000" value={doc.height} onChange={(e) => change({ height: clamp(Number(e.target.value) || 1, 1, 12000) })} /></label>
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

          {hasImage && <div className="border-t border-border pt-4">
            <p className="mb-2 text-sm font-medium">Export</p>
            <label className="block space-y-1 text-sm">Format<select className="h-10 w-full rounded-md border border-input bg-background px-3" value={doc.format} onChange={(e) => change({ format: e.target.value })}><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
            {doc.format !== "image/png" && <label className="mt-3 block space-y-1 text-sm">Quality <span className="float-right text-xs text-muted-foreground">{doc.quality}%</span><input className="w-full accent-primary" type="range" min="10" max="100" value={doc.quality} onChange={(e) => change({ quality: Number(e.target.value) })} /></label>}
            <Button className="mt-3 w-full" onClick={() => void exportImage()}><Download className="mr-2 h-4 w-4" /> Export photo</Button>
          </div>}
        </CardContent>
      </Card>
    </div>

    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
    {status && <div role="status" className="rounded-lg border border-emerald-600/20 bg-emerald-500/5 p-3 text-sm">{status}</div>}
  </div>;
}
