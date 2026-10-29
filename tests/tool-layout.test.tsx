import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "@/components/i18n-provider";
import { ToolLayout } from "@/components/tool-layout";

afterEach(cleanup);

describe("ToolLayout privacy disclosure", () => {
  for (const locale of ["en", "fa", "ar"] as const) {
    it(`does not render the generic privacy disclosure in ${locale}`, () => {
      render(
        <I18nProvider locale={locale}>
          <ToolLayout category="JSON" title="JSON Formatter & Validator" description="Format JSON.">
            <div>Tool content</div>
          </ToolLayout>
        </I18nProvider>
      );
      expect(screen.queryByText(/Privacy & data|حریم خصوصی و داده‌ها|الخصوصية والبيانات/i)).toBeNull();
      expect(screen.queryByText(/Most tools process your data|بیشتر ابزارها داده‌ها|تعالج معظم الأدوات بياناتك/i)).toBeNull();
      expect(screen.getByText("Tool content")).toBeTruthy();
      expect(screen.getByRole("main").className).toContain("px-3");
      expect(screen.getByRole("main").className).toContain("sm:px-6");
      expect(screen.getByRole("main").className).toContain("lg:px-8");
      expect(screen.getByRole("main").className).toContain("max-w-[1600px]");
    });
  }
});

describe("ToolLayout workspace gutter ownership", () => {
  it("does not add outer gutters around a full-width workspace command bar", () => {
    render(
      <I18nProvider locale="en">
        <ToolLayout category="JSON" title="JSON Formatter & Validator" description="Format JSON." workspace>
          <div>Workspace content</div>
        </ToolLayout>
      </I18nProvider>
    );
    const main = screen.getByRole("main");
    expect(main.className).toContain("w-full");
    expect(main.className).toContain("px-0");
    expect(main.className).not.toContain("sm:px-6");
    expect(main.className).not.toContain("lg:px-8");
  });
});

describe("MCP contextual help", () => {
  it("shows accurate MCP help for a verified JSON workspace in English", async () => {
    render(<I18nProvider locale="en"><ToolLayout category="JSON" title="JSON Formatter & Validator" description="Format JSON." workspace><div>JSON workspace</div></ToolLayout></I18nProvider>);
    expect(screen.getByRole("button", { name: /AI \/ MCP help/i })).toBeTruthy();
    expect(screen.getByText("JSON workspace")).toBeTruthy();
  });
  it("does not advertise MCP help for a workspace without a verified server operation", () => {
    render(<I18nProvider locale="en"><ToolLayout category="Image" title="Image Editor" description="Edit images." workspace><div>Date workspace</div></ToolLayout></I18nProvider>);
    expect(screen.queryByRole("button", { name: /AI \/ MCP help/i })).toBeNull();
  });
  it("opens an accessible help dialog with privacy and setup information", async () => {
    const user = userEvent.setup();
    render(<I18nProvider locale="fa"><ToolLayout category="JSON" title="JSON Formatter & Validator" description="Format JSON."><div>JSON workspace</div></ToolLayout></I18nProvider>);
    await user.click(screen.getByRole("button", { name: /راهنمای هوش مصنوعی \/ MCP/i }));
    expect(screen.getByRole("dialog", { name: "راهنمای هوش مصنوعی / MCP" })).toBeTruthy();
    expect(screen.getByText("حریم خصوصی و انتقال داده")).toBeTruthy();
    expect(screen.getByText("راه‌اندازی میزبانی‌شده توسط خودتان")).toBeTruthy();
  });
});
