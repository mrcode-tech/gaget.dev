import { cleanup, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DesignLanding, PortfolioPreview, DesignStylePage } from "@/design/components/design-experience";
import { DesignShell } from "@/design/components/design-shell";
import { designStyles, getDesignStyle } from "@/design/data/styles";

vi.mock("next/navigation", () => ({ usePathname: () => "/design/bauhaus" }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

afterEach(cleanup);

describe("Design Playground", () => {
  it("offers the initial style catalogue from one landing page", () => {
    render(<DesignLanding stylesList={designStyles} href={(path) => path} />);
    expect(screen.getByRole("heading", { name: "Explore the ideas that shape what you see." })).toBeTruthy();
    for (const style of designStyles) {
      expect(screen.getByRole("link", { name: new RegExp(style.name) }).getAttribute("href")).toBe(`/design/${style.id}`);
    }
  });

  it("uses the same sample project content across different visual styles", () => {
    const { rerender } = render(<PortfolioPreview styleId="bauhaus" />);
    expect(screen.getByRole("heading", { name: "Northline Journal" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Form & Field" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Common Ground" })).toBeTruthy();

    rerender(<PortfolioPreview styleId="swiss" />);
    expect(screen.getByRole("heading", { name: "Northline Journal" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Form & Field" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Common Ground" })).toBeTruthy();
  });

  it("renders learning material alongside the complete portfolio example", () => {
    const bauhaus = getDesignStyle("bauhaus");
    expect(bauhaus).toBeTruthy();
    render(<DesignStylePage style={bauhaus!} />);
    expect(screen.getByRole("heading", { name: "Historical context" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Color palette" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Typography" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Northline Journal" })).toBeTruthy();
  });

  it("provides an independent Design navigation shell", () => {
    render(<DesignShell locale="en" stylesList={designStyles}><p>Design content</p></DesignShell>);
    expect(screen.getByRole("navigation", { name: "Design styles" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to GaGet" }).getAttribute("href")).toBe("/");
    expect(screen.getByText("Design content")).toBeTruthy();
  });
});
