import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PhotoEditor } from "@/components/photo-editor";
import { AudioWorkbench } from "@/components/audio-workbench";
import { VideoWorkbench } from "@/components/video-workbench";
import { DateTimeEditor } from "@/components/datetime-editor";
import { I18nProvider } from "@/components/i18n-provider";
import { matchesFeatureSearch, shouldShowFeatureSearch, useFeatureMenuSearch } from "@/lib/feature-menu-search";

function setViewport(width: number) {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
}

const editors = [
  { name: "Photo", count: 13, render: () => <PhotoEditor />, trigger: "Open photo editor features", menu: "mobile-feature-menu", match: "Favicon", query: "fAvIcOn" },
  { name: "Audio", count: 18, render: () => <AudioWorkbench slug="editor" />, trigger: "Open audio editor features", menu: "audio-feature-menu", match: "Trim & range", query: "TRIM & RANGE" },
  { name: "Video", count: 23, render: () => <VideoWorkbench slug="editor" />, trigger: "Open video editor features", menu: "video-feature-menu", match: "Video recorder", query: "VIDEO RECORDER" },
  { name: "Date & Time", count: 20, render: () => <DateTimeEditor />, trigger: "Features", menu: "datetime-feature-menu", match: /World clock/, query: "WORLD CLOCK" },
] as const;

afterEach(() => {
  cleanup();
  setViewport(1024);
});

function SearchHarness({ editorKey }: { editorKey: string }) {
  const search = useFeatureMenuSearch(true, 9, editorKey, "en");
  return <input aria-label="Harness search" value={search.query} onChange={(event) => search.setQuery(event.target.value)} />;
}

describe("shared mobile feature search contract", () => {
  it("shows search only below 768px and only for more than eight features", () => {
    expect(shouldShowFeatureSearch(8, 390)).toBe(false);
    expect(shouldShowFeatureSearch(9, 390)).toBe(true);
    expect(shouldShowFeatureSearch(9, 767)).toBe(true);
    expect(shouldShowFeatureSearch(9, 768)).toBe(false);
    expect(shouldShowFeatureSearch(20, 1440)).toBe(false);
  });

  it("clears the query when the editor identity changes", () => {
    setViewport(390);
    const view = render(<SearchHarness editorKey="photo" />);
    const input = screen.getByRole("textbox", { name: "Harness search" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "crop" } });
    expect(input.value).toBe("crop");
    view.rerender(<SearchHarness editorKey="audio" />);
    expect((screen.getByRole("textbox", { name: "Harness search" }) as HTMLInputElement).value).toBe("");
  });

  it("matches trimmed, case-insensitive title, description, and group text", () => {
    expect(matchesFeatureSearch("  WORLD CLOCK  ", ["World clock & time zones", "Compare clocks", "Time"], "en")).toBe(true);
    expect(matchesFeatureSearch("calendar", ["Date converter", "Convert dates", "Calendar"], "en")).toBe(true);
    expect(matchesFeatureSearch("  ", ["Any feature"], "en")).toBe(true);
    expect(matchesFeatureSearch("missing", ["Crop", "Image"], "en")).toBe(false);
  });

  it.each(editors)("$name exposes the shared search, filters only its features, shows no matches, and clears on reopen", ({ render: renderEditor, trigger, menu, match, query, count }) => {
    setViewport(390);
    render(renderEditor());
    fireEvent.click(screen.getByRole("button", { name: trigger }));
    const featureMenu = screen.getByTestId(menu);
    const search = within(featureMenu).getByRole("searchbox", { name: "Search features" });
    expect(search).toBeTruthy();
    expect(featureMenu.querySelectorAll("section button").length).toBe(count);

    fireEvent.change(search, { target: { value: query } });
    expect(within(featureMenu).getByRole("button", { name: match })).toBeTruthy();
    expect(featureMenu.querySelectorAll("section button").length).toBe(1);

    fireEvent.change(search, { target: { value: "no-such-feature-xyz" } });
    expect(within(featureMenu).getByText("No matching features. Try a different search.")).toBeTruthy();
    expect(featureMenu.querySelectorAll("section button").length).toBe(0);

    fireEvent.click(within(featureMenu).getByRole("button", { name: "Close feature menu" }));
    fireEvent.click(screen.getByRole("button", { name: trigger }));
    expect((within(screen.getByTestId(menu)).getByRole("searchbox", { name: "Search features" }) as HTMLInputElement).value).toBe("");
    expect(screen.getByTestId(menu).querySelectorAll("section button").length).toBe(count);
  });

  it.each(editors)("$name does not show search at tablet width", ({ render: renderEditor, trigger }) => {
    setViewport(768);
    render(renderEditor());
    fireEvent.click(screen.getByRole("button", { name: trigger }));
    expect(screen.queryByRole("searchbox", { name: "Search features" })).toBeNull();
  });

  it("restores the full feature list when a mobile menu is resized to tablet width", () => {
    setViewport(390);
    render(<PhotoEditor />);
    fireEvent.click(screen.getByRole("button", { name: "Open photo editor features" }));
    const menu = screen.getByTestId("mobile-feature-menu");
    fireEvent.change(within(menu).getByRole("searchbox", { name: "Search features" }), { target: { value: "favicon" } });
    expect(menu.querySelectorAll("section button").length).toBe(1);
    act(() => setViewport(768));
    expect(within(menu).queryByRole("searchbox", { name: "Search features" })).toBeNull();
    expect(menu.querySelectorAll("section button").length).toBe(13);
  });

  it("localizes search controls and keeps Persian input direction RTL", () => {
    setViewport(390);
    render(<I18nProvider locale="fa"><PhotoEditor /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Open photo editor features" }));
    const search = screen.getByRole("searchbox", { name: "جست‌وجوی ویژگی‌ها" });
    expect(search.getAttribute("dir")).toBe("rtl");
    expect((search as HTMLInputElement).placeholder).toBe("جست‌وجوی ویژگی‌ها…");
  });
});
