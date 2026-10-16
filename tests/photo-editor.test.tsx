import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PhotoEditor } from "@/components/photo-editor";

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

const featureGroups: Record<string, string> = {
  "Crop & resize": "Edit", "Text & watermark": "Edit",
  "Color & filters": "Image", "Color picker": "Image", "Image details": "Image",
  "Export & convert": "Image", "Print size": "Image", "Image to Base64": "Image",
  "Base64 to image": "Image", Favicon: "Create", Collage: "Create", "SVG optimize": "Create",
};
function openFeature(label: string) {
  fireEvent.click(screen.getByRole("button", { name: featureGroups[label] }));
  fireEvent.click(screen.getByRole("button", { name: label }));
}

beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn((file: File) => `blob:preview/${file.name}`),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  if (originalCreateObjectURL) Object.defineProperty(URL, "createObjectURL", { configurable: true, writable: true, value: originalCreateObjectURL });
  else Reflect.deleteProperty(URL, "createObjectURL");
  if (originalRevokeObjectURL) Object.defineProperty(URL, "revokeObjectURL", { configurable: true, writable: true, value: originalRevokeObjectURL });
  else Reflect.deleteProperty(URL, "revokeObjectURL");
  vi.restoreAllMocks();
});

describe("PhotoEditor workspace UX acceptance", () => {
  it("renders categorized editor menus and a theme-aware empty canvas", () => {
    render(<PhotoEditor />);

    expect(screen.getAllByRole("button", { name: "File" }).length).toBeGreaterThan(0);
    for (const label of ["Edit", "Image", "Create", "History", "Help"]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
    expect(screen.getByTestId("editor-menubar").className).not.toContain("overflow-x-auto");
    expect(screen.queryByRole("button", { name: "Open application menu" })).toBeNull();

    const menuChecks = [
      ["Edit", ["Crop & resize", "Text & watermark"]],
      ["Image", ["Color & filters", "Color picker", "Image details", "Export & convert", "Print size", "Image to Base64", "Base64 to image"]],
      ["Create", ["Favicon", "Collage", "SVG optimize"]],
    ] as const;
    for (const [group, labels] of menuChecks) {
      fireEvent.click(screen.getByRole("button", { name: group }));
      for (const label of labels) expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }

    expect(screen.queryByRole("button", { name: "Adjust" })).toBeNull();
    expect(screen.queryByText("PROPERTIES")).toBeNull();
    const workspace = screen.getByTestId("canvas-scroll-area");
    expect(workspace.className).toContain("bg-muted/25");
    expect(workspace.className).toContain("p-6");
    expect(workspace.className).not.toContain("bg-[#1e1e1e]");
    expect(screen.getByTestId("empty-canvas-state").className).toContain("bg-background/80");
    expect(screen.getByText("Drop your photo here")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Choose image" })).toBeTruthy();
  });

  it("keeps site navigation outside the editor workspace and uses the shared shell", () => {
    render(<PhotoEditor />);
    expect(screen.queryByRole("complementary", { name: "GaGet.dev navigation" })).toBeNull();
    expect(screen.queryByTestId("site-navigation-panel")).toBeNull();
    expect(screen.getByTestId("editor-menubar")).toBeTruthy();
    expect(screen.getByRole("button", { name: "File" })).toBeTruthy();
  });

  it("opens a contextual feature panel without a Done footer and closes it with the mobile X", () => {
    render(<PhotoEditor />);

    openFeature("Color & filters");
    expect(screen.getByTestId("feature-panel")).toBeTruthy();
    expect(screen.getByText("Changes are previewed on the canvas")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close feature panel" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Done" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Close feature panel" }));
    expect(screen.getByTestId("feature-panel").className).toContain("translate-y-full");
    expect(screen.getByTestId("feature-panel").className).toContain("pointer-events-none");
  });

  it("keeps the desktop inspector open when the user interacts with the canvas workspace", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1280 });
    render(<PhotoEditor />);

    openFeature("Color & filters");
    const panel = screen.getByTestId("feature-panel");
    expect(within(panel).getByText("Color & filters")).toBeTruthy();
    expect(panel.className).toContain("md:w-[320px]");
    expect(panel.className).toContain("md:border-l");

    fireEvent.click(screen.getByTestId("canvas-scroll-area"));
    expect(screen.getByTestId("feature-panel")).toBe(panel);
    expect(panel.className).toContain("md:flex");
    expect(panel.className).not.toContain("md:hidden");
  });

  it("supports expanding and collapsing the mobile editing bottom sheet", () => {
    render(<PhotoEditor />);
    openFeature("Crop & resize");

    const panel = screen.getByTestId("feature-panel");
    expect(panel.className).toContain("h-[min(44dvh,360px)]");
    fireEvent.click(screen.getByRole("button", { name: "Expand editing panel" }));
    expect(panel.className).toContain("h-[min(68dvh,560px)]");
    expect(screen.getByRole("button", { name: "Collapse editing panel" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Collapse editing panel" }));
    expect(panel.className).toContain("h-[min(44dvh,360px)]");
  });

  it("keeps all feature panels in the current editing workspace and closes menus after selection", () => {
    render(<PhotoEditor />);
    const featureCases = [
      ["Crop & resize", "Crop & resize"],
      ["Color & filters", "Color & filters"],
      ["Color picker", "Color picker & palette"],
      ["Text & watermark", "Text & watermark"],
      ["Image details", "Image details"],
      ["Export & convert", "Export & convert"],
      ["Print size", "Print size"],
      ["Image to Base64", "Image to Base64"],
      ["Base64 to image", "Base64 to image"],
      ["Favicon", "Favicon generator"],
      ["Collage", "Collage maker"],
      ["SVG optimize", "SVG optimizer"],
    ] as const;

    for (const [menuLabel, panelTitle] of featureCases) {
      openFeature(menuLabel);
      expect(within(screen.getByTestId("feature-panel")).getByText(panelTitle)).toBeTruthy();
      expect(screen.getByTestId("canvas-scroll-area")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Done" })).toBeNull();
    }
  });

  it("keeps canvas status and dimensions in one work toolbar instead of a third static row", () => {
    render(<PhotoEditor />);

    expect(screen.getByText("Drop a photo here or open one")).toBeTruthy();
    expect(screen.queryByText("Edits remain reversible until you export.")).toBeNull();
    expect(screen.queryByText("Your canvas is ready")).toBeNull();
    expect(screen.getByTestId("canvas-scroll-area")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^Export$/ })).toBeNull();
  });

  it("accepts drag-over feedback and explains unsupported dropped files", () => {
    render(<PhotoEditor />);
    const workspace = screen.getByTestId("canvas-scroll-area");
    const textFile = new File(["not an image"], "notes.txt", { type: "text/plain" });

    fireEvent.dragOver(workspace, { dataTransfer: { files: [textFile] } });
    expect(workspace.className).toContain("ring-primary");

    fireEvent.drop(workspace, { dataTransfer: { files: [textFile] } });
    expect(screen.getByRole("alert").textContent).toContain("Drop an image file");
  });

  it("keeps File and History menus for document-level actions", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getAllByRole("button", { name: "File" })[0]);
    expect(screen.getByRole("button", { name: "Open photo…" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Export image…" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Reset edits" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("Images stay on this device while you edit.")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "History" })[0]);
    expect(screen.getAllByRole("button", { name: "Undo" }).every((button) => button.hasAttribute("disabled"))).toBe(true);
    expect(screen.getAllByRole("button", { name: "Redo" }).every((button) => button.hasAttribute("disabled"))).toBe(true);
  });

  it("keeps zoom controls and the scrollable canvas available", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("115%")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(screen.getByText("90%")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));
    expect(screen.getByText("90%")).toBeTruthy();
    expect(screen.getByTestId("canvas-scroll-area").className).toContain("overflow-auto");
  });

  it("closes an open menu when the user clicks outside the menu bar or presses Escape", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByRole("button", { name: "Open photo…" })).toBeTruthy();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("button", { name: "Open photo…" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("button", { name: "Open photo…" })).toBeNull();
  });

  it("opens SVG optimization without requiring a raster photo", () => {
    render(<PhotoEditor />);
    openFeature("SVG optimize");
    expect(screen.getByRole("button", { name: "Choose SVG…" })).toBeTruthy();
    expect(screen.getByText(/Remove comments and redundant whitespace/)).toBeTruthy();
  });

  it("appends collage selections, preserves order, previews on the canvas, and removes an item", () => {
    render(<PhotoEditor />);
    openFeature("Collage");
    const collageInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    const first = new File(["first"], "first.png", { type: "image/png", lastModified: 1 });
    const second = new File(["second"], "second.png", { type: "image/png", lastModified: 2 });

    fireEvent.change(collageInput, { target: { files: [first] } });
    expect(screen.getByText("1/9")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Preview of first.png" })).toBeTruthy();

    fireEvent.change(collageInput, { target: { files: [second] } });
    expect(screen.getByText("2/9")).toBeTruthy();
    const preview = screen.getByTestId("collage-canvas-preview");
    expect(within(preview).getAllByRole("img")).toHaveLength(2);
    expect(within(preview).getAllByRole("img")[0].getAttribute("alt")).toBe("first.png");
    expect(within(preview).getAllByRole("img")[1].getAttribute("alt")).toBe("second.png");

    fireEvent.change(collageInput, { target: { files: [first] } });
    expect(screen.getByText("2/9")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Remove first.png from collage" }));
    expect(screen.getByText("1/9")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Preview of second.png" })).toBeTruthy();
    expect(within(screen.getByTestId("collage-canvas-preview")).getAllByRole("img")).toHaveLength(1);
  });

  it("supports matrix, row, and column collage layouts with configurable matrix columns", () => {
    render(<PhotoEditor />);
    openFeature("Collage");
    const collageInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    const files = [
      new File(["one"], "one.png", { type: "image/png", lastModified: 1 }),
      new File(["two"], "two.png", { type: "image/png", lastModified: 2 }),
      new File(["three"], "three.png", { type: "image/png", lastModified: 3 }),
    ];
    fireEvent.change(collageInput, { target: { files } });

    expect(screen.getByLabelText("Collage layout")).toHaveProperty("value", "matrix");
    expect(screen.getByLabelText("Collage columns")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Collage columns"), { target: { value: "2" } });
    expect(screen.getByTestId("collage-canvas-preview").getAttribute("style")).toContain("repeat(2");

    fireEvent.change(screen.getByLabelText("Collage layout"), { target: { value: "row" } });
    expect(screen.getByTestId("collage-canvas-preview").getAttribute("style")).toContain("repeat(3");

    fireEvent.change(screen.getByLabelText("Collage layout"), { target: { value: "column" } });
    expect(screen.getByTestId("collage-canvas-preview").getAttribute("style")).toContain("repeat(1");
  });

  it("opens Help with concise local-processing guidance", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getAllByRole("button", { name: "Help" })[0]);
    expect(screen.getByText("Adjustments are rendered locally. Export creates a new file and never overwrites your original.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Crop & editing tips" })).toBeTruthy();
  });
});
