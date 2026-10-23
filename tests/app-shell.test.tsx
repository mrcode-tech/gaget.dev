import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("link", { name: "Dev Tools" })).toBeTruthy();
    const headerHamburger = document.querySelector('header button[aria-label="Open navigation"]');
    expect(headerHamburger).toBeTruthy();
    expect(headerHamburger?.className).toContain("lg:hidden");
    const sharedHeader = document.querySelector("header");
    expect(sharedHeader).toBeTruthy();
    expect(sharedHeader?.className).toContain("fixed");
    expect(sharedHeader?.className).toContain("top-0");
    expect(sharedHeader?.parentElement?.className).toContain("hidden lg:block");

    const languageControl = screen.getByRole("combobox", { name: "Language" });
    expect(languageControl.parentElement?.parentElement?.className).toContain("hidden");
    expect(languageControl.parentElement?.parentElement?.className).toContain("lg:flex");
    const themeControl = screen.getByRole("button", { name: "Switch to dark mode" });
    expect(themeControl.parentElement?.className).toContain("hidden");
    expect(themeControl.parentElement?.className).toContain("lg:flex");

    const editorMenu = screen.getByTestId("editor-menubar");
    // The editor keeps a viewport-sized workspace while offsetting desktop content
    // so its toolbar and dropdowns begin after the fixed sidebar.
    expect(editorMenu.parentElement?.className).toContain("h-dvh");
    expect(editorMenu.parentElement?.className).toContain("overflow-hidden");
    expect(editorMenu.parentElement?.className).toContain("lg:pl-[248px]");
  });
  
  it("treats the Video Editor as a full-screen editor route", () => {
    navigation.pathname = "/video/editor";
    render(<I18nProvider locale="en"><AppShell><div data-testid="video-editor-menubar">File · Edit · Adjust · Analyze · Export · Record</div></AppShell></I18nProvider>);
    const menubar = screen.getByTestId("video-editor-menubar");
    expect(menubar.parentElement?.className).toContain("h-dvh");
    expect(menubar.parentElement?.className).toContain("overflow-hidden");
    expect(menubar.parentElement?.className).toContain("lg:pl-[248px]");
    expect(document.querySelector("header")?.parentElement?.className).toContain("hidden lg:block");
    const spacer = Array.from(document.querySelectorAll('div[aria-hidden="true"]')).find((element) => element.className.includes("hidden h-[68px] lg:block"));
    expect(spacer).toBeTruthy();
  });

  it("keeps the shared navbar and hamburger fixed on ordinary routes", () => {
    navigation.pathname = "/tools";
    render(
      <I18nProvider locale="en">
        <AppShell><main>Tools page</main></AppShell>
      </I18nProvider>,
    );

    const header = document.querySelector("header");
    expect(header?.className).toContain("fixed");
    expect(header?.className).toContain("top-0");
    expect(screen.getByRole("button", { name: "Open navigation" })).toBeTruthy();
    expect(document.querySelector('[data-testid="mobile-site-navigation-trigger"]')).toBeNull();
    const spacer = Array.from(document.querySelectorAll('div[aria-hidden="true"]')).find((element) => element.className.includes("h-[68px]"));
    expect(spacer).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByTestId("mobile-navigation-drawer")).toBeTruthy();
  });

});
