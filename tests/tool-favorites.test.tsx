import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "@/components/i18n-provider";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/tools/registry";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  window.localStorage.clear();
});

describe("tool favorites", () => {
  it("persists a starred Video Editor and updates the control state", () => {
    const videoEditor = tools.find((tool) => tool.name === "Video Editor");
    if (!videoEditor) throw new Error("Video Editor missing from tool registry");
    render(<I18nProvider locale="en"><ToolCard tool={videoEditor} /></I18nProvider>);
    const favoriteButton = screen.getByRole("button", { name: "Add Video Editor to favorites" });
    fireEvent.click(favoriteButton);
    expect(window.localStorage.getItem("gaget:favorites:v1")).toBe(JSON.stringify(["/video/editor"]));
    expect(screen.getByRole("button", { name: "Remove Video Editor from favorites" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("removes a favorite when the star is clicked again", () => {
    const videoEditor = tools.find((tool) => tool.name === "Video Editor");
    if (!videoEditor) throw new Error("Video Editor missing from tool registry");
    window.localStorage.setItem("gaget:favorites:v1", JSON.stringify(["/video/editor"]));
    render(<I18nProvider locale="en"><ToolCard tool={videoEditor} /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Remove Video Editor from favorites" }));
    expect(window.localStorage.getItem("gaget:favorites:v1")).toBe("[]");
  });
});
