import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { I18nProvider } from "@/components/i18n-provider";
import { McpLandingPage } from "@/components/mcp-landing-page";

afterEach(cleanup);

describe("MCP landing page", () => {
  it("clearly labels the pipeline example as guided and not executed", () => {
    render(<I18nProvider locale="en"><McpLandingPage capabilities={[{ id: "json.validate", version: "1.0.0", description: "Validate JSON syntax.", limits: { maxInputCharacters: 200000 } }]} /></I18nProvider>);
    expect(screen.getByRole("heading", { name: "Bring GaGet.dev tools into your AI workflows" })).toBeTruthy();
    expect(screen.getByText("Guided example · not executed")).toBeTruthy();
    expect(screen.getByText(/does not send a request to the MCP server/)).toBeTruthy();
  });

  it("shows a sample output only when requested and links to the canonical workbench", () => {
    render(<I18nProvider locale="en"><McpLandingPage /></I18nProvider>);
    expect(screen.getByRole("link", { name: /Open Batch Workbench/ }).getAttribute("href")).toBe("/workflow/pipeline");
    expect(screen.queryByText(/"ok": true/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Show sample output" }));
    expect(screen.getByText(/"ok": true/)).toBeTruthy();
    expect(screen.getByText(/precomputed illustration/)).toBeTruthy();
  });

  it("provides RTL copy for Persian and Arabic without changing operation IDs", () => {
    const { rerender } = render(<I18nProvider locale="fa"><McpLandingPage /></I18nProvider>);
    expect(screen.getByRole("heading", { name: /ابزارهای GaGet.dev/ })).toBeTruthy();
    expect(screen.getByText("json.validate")).toBeTruthy();
    rerender(<I18nProvider locale="ar"><McpLandingPage /></I18nProvider>);
    expect(screen.getByRole("heading", { name: /أدوات GaGet.dev/ })).toBeTruthy();
  });
  it("renders capability IDs and limits from the server registry props", () => {
    render(<I18nProvider locale="en"><McpLandingPage capabilities={[{ id: "json.validate", version: "1.0.0", description: "Validate JSON syntax.", limits: { maxInputCharacters: 200000 } }, { id: "encoding.charset", version: "1.0.0", description: "Convert explicit charsets.", limits: { maxInputCharacters: 1000000 } }]} /></I18nProvider>);
    expect(screen.getByText("json.validate")).toBeTruthy();
    expect(screen.getByText("encoding.charset")).toBeTruthy();
    expect(screen.getByText("maxInputCharacters: 200,000")).toBeTruthy();
  });

});
