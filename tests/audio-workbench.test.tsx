import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AudioWorkbench } from "@/components/audio-workbench";

afterEach(() => cleanup());

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
