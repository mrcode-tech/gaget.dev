import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AudioWorkbench } from "@/components/audio-workbench";

afterEach(() => cleanup());

describe("AudioWorkbench template parity", () => {
  it("uses the shared empty-state scroll region and upload geometry", () => {
    render(<AudioWorkbench slug="editor" />);
    const intro = screen.getByTestId("audio-empty-intro");
    expect(intro.closest('[class~="overflow-y-auto"]')).toBeTruthy();
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
    const feature = within(menu).getByRole("button", { name: "Trim & range" });
    const descriptionId = feature.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId!)?.textContent).toContain("Choose a range");
  });
});
