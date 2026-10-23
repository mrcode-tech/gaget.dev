import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
import { AudioWorkbench } from "@/components/audio-workbench";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalCreateObjectURL) Object.defineProperty(URL, "createObjectURL", { configurable: true, value: originalCreateObjectURL });
  else Reflect.deleteProperty(URL, "createObjectURL");
  if (originalRevokeObjectURL) Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: originalRevokeObjectURL });
  else Reflect.deleteProperty(URL, "revokeObjectURL");
});

describe("AudioWorkbench template parity", () => {
  it("uses the shared empty-state scroll region and upload geometry", () => {
    render(<AudioWorkbench slug="editor" />);
    const intro = screen.getByTestId("audio-empty-intro");
    const workspace = intro.closest('[class~="overflow-y-auto"]');
    expect(workspace).toBeTruthy();
    expect(workspace?.className).toContain("sm:p-6");
    expect(workspace?.className).not.toContain("space-y-3");
    expect(intro.querySelector("h1")?.textContent).toBe("Audio Editor");
    const dropArea = intro.querySelector(".aspect-square");
    expect(dropArea).toBeTruthy();
    expect(dropArea?.className).toContain("max-h-[400px]");
    expect(screen.getByText("Drag and drop an audio file here")).toBeTruthy();
  });

  it("shows concise accessible descriptions in the mobile feature menu", () => {
    render(<AudioWorkbench slug="editor" />);
    fireEvent.click(screen.getByRole("button", { name: "Open audio editor features" }));
    const menu = screen.getByTestId("audio-feature-menu");
    expect(menu.className).toContain("bg-popover");
    expect(menu.className).toContain("p-1.5");
    const feature = within(menu).getByRole("button", { name: "Trim & range" });
    expect(feature.className).toContain("py-2.5");
    const descriptionId = feature.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId!)?.textContent).toContain("Choose a range");
  });
  
  it("keeps the mobile feature panel closed after a file decodes without feature selection", async () => {
    class MockAudioContext {
      async decodeAudioData() {
        return {
          duration: 1,
          sampleRate: 8000,
          numberOfChannels: 1,
          length: 8000,
          getChannelData: () => new Float32Array(8000),
        } as unknown as AudioBuffer;
      }
      async close() {}
    }
    vi.stubGlobal("AudioContext", MockAudioContext);
    vi.stubGlobal("requestAnimationFrame", vi.fn());
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:sample.wav") });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });

    const { container } = render(<AudioWorkbench slug="editor" />);
    const audioFile = new File(["audio"], "sample.wav", { type: "audio/wav" });
    Object.defineProperty(audioFile, "arrayBuffer", {
      configurable: true,
      value: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    });
    const input = container.querySelector<HTMLInputElement>("#audio-input");
    expect(input).toBeTruthy();
    fireEvent.change(input!, { target: { files: [audioFile] } });

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("Decoded locally");
    });
    const panel = screen.getByTestId("audio-feature-panel");
    expect(panel.className).toContain("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Open audio editor features" }));
    fireEvent.click(within(screen.getByTestId("audio-feature-menu")).getByRole("button", { name: "Trim & range" }));
    expect(panel.className).not.toContain("hidden");
    expect(within(panel).getByText("Choose a range and export trimmed audio.")).toBeTruthy();
    expect(screen.getByText("Start (seconds)").className).toContain("block");
  });

  it("opens the same resizable feature sheet before an audio file is selected", () => {
    render(<AudioWorkbench slug="editor" />);
    fireEvent.click(screen.getByRole("button", { name: "Open audio editor features" }));
    fireEvent.click(within(screen.getByTestId("audio-feature-menu")).getByRole("button", { name: "Trim & range" }));
    const panel = screen.getByTestId("audio-feature-panel");
    expect(panel.className).toContain("fixed");
    expect(within(panel).getByRole("heading", { name: "Audio Editor" })).toBeTruthy();
    const handle = within(panel).getByRole("slider", { name: "Resize editing panel" });
    fireEvent.keyDown(handle, { key: "End" });
    expect(handle.getAttribute("aria-valuenow")).toBe(handle.getAttribute("aria-valuemax"));
  });
});
