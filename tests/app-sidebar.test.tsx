import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { I18nProvider } from "@/components/i18n-provider";

const navigation = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

afterEach(() => {
  cleanup();
  navigation.pathname = "/";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(HTMLElement.prototype, "hasPointerCapture");
  Reflect.deleteProperty(HTMLElement.prototype, "setPointerCapture");
  Reflect.deleteProperty(HTMLElement.prototype, "releasePointerCapture");
});

function SidebarHarness() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <I18nProvider locale="en">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
    </I18nProvider>
  );
}

describe("AppSidebar", () => {
  it("shows navigation labels when expanded and hides them when collapsed", () => {
    render(<SidebarHarness />);
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "All tools" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Video" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "category.video" })).toBeNull();
    expect(screen.getByText("Categories")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("title")).toBe("Home");
    expect(screen.queryByText("Categories")).toBeNull();
    expect(screen.queryByText("All tools")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(screen.getByRole("link", { name: "All tools" })).toBeTruthy();
    expect(screen.getByText("Categories")).toBeTruthy();
  });

  it("shows language and appearance as separately captioned rows in the mobile drawer", () => {
    render(<SidebarHarness />);
    expect(screen.queryByRole("combobox", { name: "Language" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Switch to dark mode" })).toBeNull();
    act(() => {
      window.dispatchEvent(new Event("gaget:open-navigation"));
    });
    const languageCaption = screen.getAllByText("Language", { selector: "span" })[0];
    const appearanceCaption = screen.getByText("Appearance", { selector: "span" });
    expect(screen.getByRole("combobox", { name: "Language" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeTruthy();
    const languageRow = languageCaption.parentElement;
    const appearanceRow = appearanceCaption.parentElement;
    expect(languageRow?.className).toContain("min-h-10");
    expect(appearanceRow?.className).toContain("min-h-10");
    expect(languageRow).not.toBe(appearanceRow);
    expect(languageRow?.parentElement).toBe(appearanceRow?.parentElement);
    expect(languageRow?.parentElement?.className).toContain("border-t");
    Object.defineProperties(HTMLElement.prototype, {
      hasPointerCapture: { configurable: true, value: () => false },
      setPointerCapture: { configurable: true, value: () => undefined },
      releasePointerCapture: { configurable: true, value: () => undefined },
    });
    fireEvent.keyDown(screen.getByRole("combobox", { name: "Language" }), { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: "Español" })).toBeTruthy();
  });

  it("marks the current route as active", () => {
    navigation.pathname = "/tools";
    render(<SidebarHarness />);
    expect(screen.getByRole("link", { name: "All tools" }).className).toContain("bg-accent");
  });

  it("keeps the drawer close button in the header instead of floating over the GaGet logo", () => {
    render(<SidebarHarness />);
    act(() => {
      window.dispatchEvent(new Event("gaget:open-navigation"));
    });
    const drawer = screen.getByTestId("mobile-navigation-drawer");
    const logo = within(drawer).getByRole("link", { name: "GaGet.dev home" });
    const close = within(drawer).getByRole("button", { name: "Close navigation" });
    expect(drawer.contains(logo)).toBe(true);
    expect(drawer.contains(close)).toBe(true);
    expect(logo.parentElement).toBe(close.parentElement);
    fireEvent.click(close);
    expect(screen.queryByTestId("mobile-navigation-drawer")).toBeNull();
  });

  it("opens the mobile drawer from the in-flow editor navbar trigger event", () => {
    navigation.pathname = "/images/editor";
    render(<SidebarHarness />);
    expect(screen.queryByTestId("mobile-site-navigation-trigger")).toBeNull();
    expect(screen.queryByRole("button", { name: "Open navigation" })).toBeNull();
    act(() => {
      window.dispatchEvent(new Event("gaget:open-navigation"));
    });
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeTruthy();
  });
});
