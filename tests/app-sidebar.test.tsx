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

    expect(screen.getByRole("heading", { name: "Preferences" })).toBeTruthy();
    const languageCaption = screen.getByText("Language", { selector: "p" });
    const appearanceCaption = screen.getByText("Appearance", { selector: "p" });
    expect(screen.getByRole("combobox", { name: "Language" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeTruthy();

    const languageRow = languageCaption.parentElement;
    const appearanceRow = appearanceCaption.parentElement;
    expect(languageRow?.className).toContain("space-y-2");
    expect(appearanceRow?.className).toContain("space-y-2");
    expect(languageRow).not.toBe(appearanceRow);
    expect(languageRow?.parentElement).toBe(appearanceRow?.parentElement);
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
});
