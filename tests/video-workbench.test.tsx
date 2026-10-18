import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VideoWorkbench } from "@/components/video-workbench";

beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:video-preview") });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function loadVideo(container: HTMLElement) {
  const input = container.querySelector('input[type="file"][accept^="video/"]');
  expect(input).toBeTruthy();
  fireEvent.change(input!, { target: { files: [new File(["video"], "sample.mp4", { type: "video/mp4" })] } });
}

function chooseMobileFeature(slugLabel: string) {
  fireEvent.click(screen.getByRole("button", { name: "Open video editor features" }));
  fireEvent.click(within(screen.getByTestId("video-feature-menu")).getByRole("button", { name: slugLabel }));
}

describe("VideoWorkbench", () => {
  it("renders the Video Editor empty state and shared File menu", () => {
    render(<VideoWorkbench slug="editor" />);
    expect(screen.getByRole("main", { name: "GaGet Video Editor" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Video Editor" })).toBeTruthy();
    expect(screen.getByText("Drop a video here")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "File menu" }));
    expect(screen.getByTestId("video-file-menu")).toBeTruthy();
    expect(within(screen.getByTestId("video-file-menu")).getByRole("button", { name: /Open video/ })).toBeTruthy();
  });

  it("exposes all 23 feature actions in grouped mobile menu", () => {
    render(<VideoWorkbench slug="editor" />);
    fireEvent.click(screen.getByRole("button", { name: "Open video editor features" }));
    const menu = screen.getByTestId("video-feature-menu");
    const labels = ["Trim video","Split video","Merge videos","Crop, rotate & flip","Text & watermark","Video reverser","Color adjustments","Speed changer","Audio track","Stabilization","Video information","Extract frames","Thumbnail generator","Subtitle editor","Video comparison","Video converter","Video compressor","Resolution & frame rate","Video to audio","Video to GIF","Metadata cleaner","Base64 encode/decode","Video recorder"];
    for (const label of labels) expect(menu.textContent).toContain(label);
    expect(labels).toHaveLength(23);
  });

  it("hides the timeline for informational features after a video is selected", () => {
    const { container } = render(<VideoWorkbench slug="editor" />);
    loadVideo(container);
    chooseMobileFeature("Video information");
    expect(screen.queryByTestId("video-timeline")).toBeNull();
    expect(screen.getByTestId("video-feature-panel").className).toContain("fixed");
    expect(screen.getByRole("heading", { name: "Video information" })).toBeTruthy();
  });

  it("shows the trim timeline only for time-range features and closes the mobile sheet", () => {
    const { container } = render(<VideoWorkbench slug="editor" />);
    loadVideo(container);
    chooseMobileFeature("Trim video");
    expect(screen.getByTestId("video-timeline")).toBeTruthy();
    expect(screen.getByTestId("video-feature-panel").className).toContain("fixed");
    fireEvent.click(screen.getByRole("button", { name: "Close video feature panel" }));
    expect(screen.getByTestId("video-feature-panel").className).toContain("hidden");
    expect(screen.getByTestId("video-timeline")).toBeTruthy();
  });

  it("uses an icon-based navigation trigger rather than a text hamburger glyph", () => {
    render(<VideoWorkbench slug="editor" />);
    const navigation = screen.getByRole("button", { name: "Open navigation" });
    expect(navigation.querySelector("svg")).toBeTruthy();
    expect(navigation.textContent).toBe("");
  });
});
