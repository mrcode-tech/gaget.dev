import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "@/components/i18n-provider";
import { ToolCatalog } from "@/components/tool-catalog";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function renderCatalog(locale: "en" | "fa" | "ar" = "en") {
  return render(<I18nProvider locale={locale}><ToolCatalog /></I18nProvider>);
}

describe("ToolCatalog", () => {
  it("renders developer utilities grouped by category without independent workspaces", () => {
    renderCatalog();
    expect(screen.getByRole("heading", { level: 1, name: "Dev Tools" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "JSON" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Security" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Encoders & Decoders" })).toBeTruthy();

    for (const workspaceName of ["Photo Editor", "Audio Editor", "Video Editor", "Date & Time Editor"]) {
      expect(screen.queryByText(workspaceName)).toBeNull();
    }
    expect(screen.getByRole("link", { name: /JSON Workspace/ }).getAttribute("href")).toBe("/json/formatter");
    expect(screen.getByRole("link", { name: /JWT Decoder/ }).getAttribute("href")).toBe("/security/jwt-decoder");
    expect(screen.getByRole("link", { name: /URL Encoder \/ Decoder/ }).getAttribute("href")).toBe("/encoding/url");
  });

  it("searches only developer utilities and omits categories without matching tools", () => {
    renderCatalog();
    const search = screen.getByRole("textbox");
    fireEvent.change(search, { target: { value: "photo" } });
    expect(screen.getByText("No tools match your search.")).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "JSON" })).toBeNull();
    expect(screen.queryByText("Photo Editor")).toBeNull();

    fireEvent.change(search, { target: { value: "jwt" } });
    expect(screen.getByRole("heading", { level: 2, name: "Security" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /JWT Decoder/ })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 2, name: "JSON" })).toBeNull();
  });

  it("preserves RTL direction for Persian and Arabic search controls", () => {
    const { rerender } = renderCatalog("fa");
    expect(screen.getByRole("textbox").getAttribute("dir")).toBe("rtl");
    rerender(<I18nProvider locale="ar"><ToolCatalog /></I18nProvider>);
    expect(screen.getByRole("textbox").getAttribute("dir")).toBe("rtl");
  });
});
