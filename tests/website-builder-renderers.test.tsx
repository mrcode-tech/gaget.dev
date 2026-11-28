import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CATALOGUE } from "@/lib/website-builder/model";
import { getSampleRenderer, SampleRendererView } from "@/components/website-builder/sample-renderers";

describe("website builder sample renderer registry", () => {
  it("registers an isolated renderer for every initial synthetic sample", () => {
    const renderers = CATALOGUE.map(sample => getSampleRenderer(sample));
    expect(renderers.every(Boolean)).toBe(true);
    expect(new Set(renderers).size).toBe(CATALOGUE.length);
  });

  it("returns an explicit unavailable result for an unknown sample identity", () => {
    const unknown = { ...CATALOGUE[0], id: "unknown-sample" };
    expect(getSampleRenderer(unknown)).toBeNull();
    const markup = renderToStaticMarkup(<SampleRendererView sample={unknown} content={{}} identity={{ ...({ palette: "test", primary: "#000000", background: "#ffffff", surface: "#ffffff", text: "#000000", accent: "#777777", font: "sans-serif" }) }} />);
    expect(markup).toContain("preview is currently unavailable");
  });
});
