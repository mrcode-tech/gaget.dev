import { cleanup, fireEvent, render, screen, beforeEach, afterEach, describe, expect, it, vi } from "@testing-library/react";
import { VideoWorkbench } from "@/components/video-workbench";
beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:video-preview") });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
});
afterEach(() => cleanup());
describe("VideoWorkbench", () => {
  it("renders the Video Editor empty state and shared File menu", () => {
    render(<VideoWorkbench slug="editor" />);
    expect(screen.getByRole("main", { name: "GaGet Video Editor" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Video Editor" })).toBeTruthy();
    expect(screen.getByText("Drop a video here")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "File menu" }));
    expect(screen.getByTestId("video-file-menu")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Open video/ })).toBeTruthy();
  });
  it("exposes all 23 feature actions in grouped mobile menu", () => {
    render(<VideoWorkbench slug="editor" />);
    fireEvent.click(screen.getByRole("button", { name: "Open video editor features" }));
    const menu = screen.getByTestId("video-feature-menu");
    const labels = ["Trim video","Split video","Merge videos","Crop, rotate & flip","Text & watermark","Video reverser","Color adjustments","Speed changer","Audio track","Stabilization","Video information","Extract frames","Thumbnail generator","Subtitle editor","Video comparison","Video converter","Video compressor","Resolution & frame rate","Video to audio","Video to GIF","Metadata cleaner","Base64 encode/decode","Video recorder"];
    for (const label of labels) expect(menu.textContent).toContain(label);
    expect(labels).toHaveLength(23);
  });
  it("uses an icon-based navigation trigger rather than a text hamburger glyph", () => {
    render(<VideoWorkbench slug="editor" />);
    const navigation = screen.getByRole("button", { name: "Open navigation" });
    expect(navigation.querySelector("svg")).toBeTruthy();
    expect(navigation.textContent).toBe("");
  });
});
