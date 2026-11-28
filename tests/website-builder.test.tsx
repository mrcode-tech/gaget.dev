import { describe, expect, it } from "vitest";
import {
  CATALOGUE, createProject, activePage, insertSample, reorder, toggleHidden,
  removeInstance, duplicateInstance, reviewProject, serializeProject, markdownHandoff
} from "@/lib/website-builder/model";

describe("website builder domain", () => {
  it("creates a session project with one empty page and three breakpoint layouts", () => {
    const project = createProject({ name: "Studio", businessType: "Design studio", purpose: "Show work", audience: "Clients" });
    expect(project.pages).toHaveLength(1);
    expect(activePage(project).layouts.desktop.order).toEqual([]);
    expect(activePage(project).layouts.tablet.order).toEqual([]);
    expect(activePage(project).layouts.mobile.order).toEqual([]);
    expect(project.missions).toHaveLength(11);
  });

  it("inserts a unique instance into all responsive layouts", () => {
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    const page = insertSample(activePage(project), CATALOGUE[0]);
    expect(page.instances).toHaveLength(1);
    const id = page.instances[0].id;
    expect(page.layouts.desktop.order).toEqual([id]);
    expect(page.layouts.tablet.order).toEqual([id]);
    expect(page.layouts.mobile.order).toEqual([id]);
  });

  it("keeps tablet and mobile ordering independent", () => {
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    let page = insertSample(activePage(project), CATALOGUE[0]);
    page = insertSample(page, CATALOGUE[1]);
    const [first, second] = page.instances;
    page = reorder(page, "tablet", second.id, -1);
    expect(page.layouts.tablet.order).toEqual([second.id, first.id]);
    expect(page.layouts.desktop.order).toEqual([first.id, second.id]);
    expect(page.layouts.mobile.order).toEqual([first.id, second.id]);
  });

  it("hides a component at a breakpoint without removing membership", () => {
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    let page = insertSample(activePage(project), CATALOGUE[0]);
    const id = page.instances[0].id;
    page = toggleHidden(page, "mobile", id);
    expect(page.layouts.mobile.hidden).toContain(id);
    expect(page.instances).toHaveLength(1);
    expect(page.layouts.desktop.order).toContain(id);
  });

  it("duplicates independently and removes shared membership across breakpoints", () => {
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    let page = insertSample(activePage(project), CATALOGUE[0]);
    const original = page.instances[0];
    page = duplicateInstance(page, original.id);
    expect(page.instances).toHaveLength(2);
    expect(page.instances[0].id).not.toBe(page.instances[1].id);
    page = removeInstance(page, original.id);
    expect(page.instances).toHaveLength(1);
    expect(page.layouts.desktop.order).toEqual([page.instances[0].id]);
    expect(page.layouts.tablet.order).toEqual([page.instances[0].id]);
    expect(page.layouts.mobile.order).toEqual([page.instances[0].id]);
  });

  it("reports required content and exports a versioned blueprint and readable handoff", () => {
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    const page = insertSample(activePage(project), CATALOGUE[0]);
    const invalid = { ...project, pages: [{ ...page, instances: page.instances.map(i => ({ ...i, content: { ...i.content, title: "" } })) }] };
    expect(reviewProject(invalid).some(f => f.message.includes("Title"))).toBe(true);
    expect(JSON.parse(serializeProject(project)).schemaVersion).toBe("1.0.0");
    expect(markdownHandoff(project)).toContain("# Studio");
  });
});
