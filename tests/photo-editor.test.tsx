import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhotoEditor } from "@/components/photo-editor";

afterEach(() => cleanup());

describe("PhotoEditor workspace", () => {
  it("renders a standalone editing workspace with app menus and a canvas empty state", () => {
    render(<PhotoEditor />);

    expect(screen.getByRole("link", { name: "Back to GaGet.dev home" })).toBeTruthy();
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
