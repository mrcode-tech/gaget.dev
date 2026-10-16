import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhotoEditor } from "@/components/photo-editor";

afterEach(() => cleanup());

describe("PhotoEditor workspace", () => {
  it("renders a standalone editing workspace with app menus and a canvas empty state", () => {
    render(<PhotoEditor />);

    expect(screen.getByRole("link", { name: "Back to GaGet.dev home" })).toBeTruthy();
    expect(screen.getByRole("complementary", { name: "GaGet.dev navigation" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Browse all GaGet.dev tools" })).toBeTruthy();
    expect(screen.getByText("Photo Editor")).toBeTruthy();
    expect(screen.getByRole("button", { name: "File" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Edit" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Image" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Adjust" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tools" })).toBeTruthy();
    expect(screen.queryByText("PROPERTIES")).toBeNull();
    expect(screen.getAllByRole("button", { name: "Help" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Your canvas is ready")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Choose image" })).toBeTruthy();
  });


  it("opens contextual feature panels from categorized menus and closes them without a static sidebar", () => {
    render(<PhotoEditor />);

    expect(screen.queryByText("PROPERTIES")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Adjust" }));
    fireEvent.click(screen.getByRole("button", { name: "Color & filters…" }));

    expect(screen.getByTestId("feature-panel")).toBeTruthy();
    expect(screen.getByText("Changes are previewed on the canvas")).toBeTruthy();
    expect(screen.getByText("Choose a photo to enable editing controls.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close feature panel" }));
    expect(screen.getByTestId("feature-panel").className).toContain("hidden");
  });

  it("keeps the canvas workspace scrollable and avoids a permanent export button", () => {
    render(<PhotoEditor />);

    expect(screen.getByTestId("canvas-scroll-area").className).toContain("overflow-auto");
    expect(screen.queryByRole("button", { name: /^Export$/ })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByRole("button", { name: "Export image…" })).toBeTruthy();
  });



  it("opens crop, transform, adjustment, and color tools from their logical menus", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Image" }));
    fireEvent.click(screen.getByRole("button", { name: "Crop…" }));
    expect(screen.getByText("Crop & transform")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close feature panel" }));

    fireEvent.click(screen.getByRole("button", { name: "Image" }));
    fireEvent.click(screen.getByRole("button", { name: "Resize & rotate…" }));
    expect(screen.getByText("Crop & transform")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close feature panel" }));

    fireEvent.click(screen.getByRole("button", { name: "Adjust" }));
    fireEvent.click(screen.getByRole("button", { name: "Color & filters…" }));
    expect(screen.getByText("Color & filters")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close feature panel" }));

    fireEvent.click(screen.getByRole("button", { name: "Adjust" }));
    fireEvent.click(screen.getByRole("button", { name: "Color picker…" }));
    expect(screen.getByText("Color picker & palette")).toBeTruthy();
  });

  it("routes image capabilities through the categorized Tools menu", () => {
    render(<PhotoEditor />);

    const capabilities = [
      ["Image to Base64…", "Image to Base64"],
      ["Base64 to image…", "Base64 to image"],
      ["Favicon generator…", "Favicon generator"],
      ["Collage maker…", "Collage maker"],
      ["SVG optimizer…", "SVG optimizer"],
      ["Image information…", "Image information"],
      ["Print size & DPI…", "Print size & DPI"],
      ["Export & format…", "Export & format"],
      ["Text & watermark…", "Text & watermark"],
    ] as const;

    for (const [menuItem, panelTitle] of capabilities) {
      fireEvent.click(screen.getByRole("button", { name: "Tools" }));
      fireEvent.click(screen.getByRole("button", { name: menuItem }));
      expect(screen.getByText(panelTitle)).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Close feature panel" }));
    }
  });

  it("opens SVG optimization without requiring a raster photo", () => {
    render(<PhotoEditor />);
    fireEvent.click(screen.getByRole("button", { name: "Tools" }));
    fireEvent.click(screen.getByRole("button", { name: "SVG optimizer…" }));
    expect(screen.getByRole("button", { name: "Choose SVG…" })).toBeTruthy();
    expect(screen.getByText(/Remove comments and redundant whitespace/)).toBeTruthy();
  });

  it("opens the File menu and exposes local open, export, and reset actions", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "File" }));

    expect(screen.getByRole("button", { name: "Open photo…" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Export image…" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reset edits" })).toBeTruthy();
    expect(screen.getByText("Images stay on this device while you edit.")).toBeTruthy();
  });

  it("keeps image-dependent editing and export actions disabled until a photo is opened", () => {
    render(<PhotoEditor />);


    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByRole("button", { name: "Export image…" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Reset edits" }).hasAttribute("disabled")).toBe(true);
  });

  it("supports zoom controls and resets the zoom percentage", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("115%")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(screen.getByText("90%")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset zoom" }));
    expect(screen.getByText("90%")).toBeTruthy();
  });

  it("closes an open menu when the user clicks outside the menu bar", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByRole("button", { name: "Open photo…" })).toBeTruthy();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("button", { name: "Open photo…" })).toBeNull();
  });

  it("closes an open menu when Escape is pressed", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("button", { name: "Open photo…" })).toBeNull();
  });

  it("opens the Help menu with local-processing guidance", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getAllByRole("button", { name: /^Help$/ })[0]);

    expect(screen.getByText("A lightweight editor. Adjustments are rendered locally in your browser; export creates a new file and never overwrites your original.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Crop & editing tips" })).toBeTruthy();
  });
});
