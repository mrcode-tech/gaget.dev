import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
