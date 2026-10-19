import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhotoEditor } from "@/components/photo-editor";
import { AudioWorkbench } from "@/components/audio-workbench";
import { VideoWorkbench } from "@/components/video-workbench";

afterEach(() => cleanup());

describe("shared media editor command-bar geometry", () => {
  it("keeps the command bar and File/first feature buttons consistent", () => {
    const editors = [
      { render: () => render(<PhotoEditor />), barId: "editor-menubar", fileMenuId: "photo-file-menu" },
      { render: () => render(<AudioWorkbench slug="editor" />), barId: "audio-editor-menubar", fileMenuId: "audio-file-menu" },
      { render: () => render(<VideoWorkbench slug="editor" />), barId: "video-editor-menubar", fileMenuId: "video-file-menu" },
    ];

    for (const editor of editors) {
      const { container, unmount } = editor.render();
      const bar = container.querySelector<HTMLElement>(`[data-testid="${editor.barId}"]`);
      expect(bar).toBeTruthy();
      expect(bar?.className).toContain("gap-3");
      expect(bar?.className).toContain("px-3");
      expect(bar?.className).toContain("sm:px-6");

      const fileButton = Array.from(bar!.querySelectorAll("button")).find((button) => button.textContent?.trim() === "File");
      const editButton = Array.from(bar!.querySelectorAll("button")).find((button) => button.textContent?.trim() === "Edit");
      expect(fileButton?.parentElement?.className).toContain("shrink-0");
      for (const button of [fileButton, editButton]) {
        expect(button).toBeTruthy();
        expect(button?.className).toContain("inline-flex");
        expect(button?.className).toContain("h-9");
        expect(button?.className).toContain("items-center");
        expect(button?.className).toContain("px-3");
        expect(button?.className).toContain("py-1.5");
      }

      fireEvent.click(fileButton!);
      const fileMenu = within(bar!).getByTestId(editor.fileMenuId);
      expect(fileMenu.className).toContain("left-3");
      expect(fileMenu.className).toContain("top-[calc(100%-1px)]");
      expect(fileMenu.className).toContain("sm:left-6");
      unmount();
    }
  });
});
