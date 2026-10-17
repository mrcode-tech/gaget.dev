import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
      />
    </I18nProvider>
  );
}

describe("AppSidebar", () => {
  it("shows navigation labels when expanded and hides them when collapsed", () => {
    render(<SidebarHarness />);

    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "All tools" })).toBeTruthy();
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

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));

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

  it("opens and closes the mobile navigation", () => {
    render(<SidebarHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(screen.queryByRole("button", { name: "Close navigation" })).toBeNull();
  });

  it("keeps the existing hamburger fixed above the compact editor navbar on mobile and tablet", () => {
    navigation.pathname = "/images/editor";
    render(<SidebarHarness />);
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    const viewportTrigger = screen.getByTestId("mobile-site-navigation-trigger");

    expect(trigger.className).toContain("z-[101]");
    expect(trigger.className).toContain("pointer-events-auto");
    expect(viewportTrigger.className).toContain("fixed");
    expect(viewportTrigger.className).toContain("z-[100]");
    expect(viewportTrigger.className).toContain("top-0");
    expect(viewportTrigger.className).toContain("left-2");
  });
});
