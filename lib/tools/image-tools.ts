export const imageToolSlugs = ["editor", "collage", "metadata", "palette", "color-picker", "base64", "base64-to-image", "favicon", "svg-optimizer", "dimensions", "print-size"] as const;

export const imageToolMeta = {
  editor: { title: "Photo Editor", description: "Edit photos in one private browser-based editor with filters, color adjustments, resizing, rotation, text overlays, watermarks, and export controls." },
  collage: { title: "Photo Collage Maker", description: "Combine two to four local images into a simple downloadable photo collage." },
  metadata: { title: "Image Metadata & Privacy", description: "Review image dimensions and file properties, then export a copy stripped of embedded metadata." },
  palette: { title: "Dominant Color Palette", description: "Extract representative HEX colors from an image directly in your browser." },
  "color-picker": { title: "Image Color Picker", description: "Sample exact pixel colors from an image and copy HEX values, privately in your browser." },
  base64: { title: "Image to Base64", description: "Convert a local image to a Base64 data URL entirely in your browser." },
  "base64-to-image": { title: "Base64 to Image", description: "Decode a Base64 image data URL locally and download the decoded image." },
  favicon: { title: "Image to Favicon", description: "Create a 32 by 32 PNG favicon from a local image without uploading it." },
  "svg-optimizer": { title: "SVG Optimizer", description: "Optimize SVG source whitespace and comments in your browser before downloading." },
  dimensions: { title: "Image Dimensions Checker", description: "Check image dimensions, aspect ratio, file type, and file size locally." },
  "print-size": { title: "DPI & Print Size Calculator", description: "Calculate approximate print dimensions from image pixel dimensions and DPI." },
} as const;
