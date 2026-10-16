import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/app-shell";
import { I18nProvider } from "@/components/i18n-provider";

const navigation = vi.hoisted(() => ({ pathname: "/images/editor" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

afterEach(() => {
  cleanup();
  navigation.pathname = "/images/editor";
});

describe("AppShell", () => {
  it("keeps the shared GaGet sidebar and header on the Photo Editor route", () => {
    render(
      <I18nProvider locale="en">
        <AppShell>
          <div data-testid="editor-menubar">File · Edit · Image · Create</div>
        </AppShell>
      </I18nProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "All tools" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Open navigation" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /search/i })).toBeTruthy();

    const editorMenu = screen.getByTestId("editor-menubar");
    expect(editorMenu.parentElement?.className).toContain("lg:pl-[248px]");
    expect(editorMenu.parentElement?.className).not.toContain("lg:pl-0");
  });
});
