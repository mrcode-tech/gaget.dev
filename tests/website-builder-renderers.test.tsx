import { describe, expect, it } from "vitest";
import { CATALOGUE } from "@/lib/website-builder/model";
import { getSampleRenderer } from "@/components/website-builder/sample-renderers";

describe("website builder sample renderer registry", () => {
  it("registers an isolated renderer for every initial synthetic sample", () => {
    const renderers = CATALOGUE.map(sample => getSampleRenderer(sample));
    expect(renderers.every(Boolean)).toBe(true);
    expect(new Set(renderers).size).toBe(CATALOGUE.length);
  });

  it("returns an explicit unavailable result for an unknown sample identity", () => {
    expect(getSampleRenderer({ ...CATALOGUE[0], id: "unknown-sample" })).toBeNull();
  });
});
