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

  
  it("inserts before and after a selected section and rejects missing anchors", async () => {
    const { insertSampleAt } = await import("@/lib/website-builder/model");
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    let page = insertSample(activePage(project), CATALOGUE[0]);
    page = insertSampleAt(page, CATALOGUE[1], { placement: "start" });
    const [first, second] = page.instances;
    page = insertSampleAt(page, CATALOGUE[2], { placement: "after", relativeToId: first.id });
    expect(page.instances.map(item => item.sampleId)).toEqual([first.sampleId, CATALOGUE[2].id, second.sampleId]);
    expect(insertSampleAt(page, CATALOGUE[0], { placement: "before", relativeToId: "missing" })).toBe(page);
  });

  it("replaces a sample while preserving compatible content and initializing new fields", async () => {
    const { replaceSample } = await import("@/lib/website-builder/model");
    const project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    let page = insertSample(activePage(project), CATALOGUE[0]);
    const instance = page.instances[0];
    page = { ...page, instances: [{ ...instance, content: { ...instance.content, title: "My title", body: "My copy" } }] };
    const next = { ...CATALOGUE[0], id: "hero-replacement", fields: [
      ...CATALOGUE[0].fields, { id: "caption", label: "Caption", kind: "text" as const, defaultValue: "New caption" }
    ] };
    const result = replaceSample(page, instance.id, next);
    expect(result.page.instances[0].content.title).toBe("My title");
    expect(result.page.instances[0].content.caption).toBe("New caption");
    expect(result.preservedFields).toContain("title");
    expect(result.resetFields).toContain("caption");
  });

  it("keeps level completion separate from mission completion and supports review propagation", async () => {
    const { completeLevel, markMissionsForReview } = await import("@/lib/website-builder/model");
    let project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    project = setMissionStatus(project, 2, "Complete");
    project = completeLevel(project, 2, true);
    project = setMissionStatus(project, 3, "Not started", true);
    expect(project.completedLevels).toEqual([2]);
    expect(project.missions.find(m => m.level === 3)).toMatchObject({ status: "Complete", notNeeded: true });
    project = markMissionsForReview(project, [2, 3]);
    expect(project.missions.find(m => m.level === 2)?.status).toBe("Needs review");
    expect(project.missions.find(m => m.level === 3)?.status).toBe("Complete");
  });

  it("enforces page lifecycle and validates stable internal navigation references", async () => {
    const { createAdditionalPage, removePage, validateInternalNavigation } = await import("@/lib/website-builder/model");
    let project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    project = createAdditionalPage(project, "About", "/about");
    const about = project.pages[1];
    expect(project.activePageId).toBe(about.id);
    expect(createAdditionalPage(project, "Duplicate", "/about")).toBe(project);
    let page = insertSample(activePage(project), CATALOGUE[0]);
    page = { ...page, instances: [{ ...page.instances[0], content: { ...page.instances[0].content, button: "page:missing-page" } }] };
    project = { ...project, pages: project.pages.map(item => item.id === page.id ? page : item) };
    expect(validateInternalNavigation(project)).toHaveLength(1);
    expect(removePage(project, about.id).pages).toHaveLength(1);
  });

  it("calculates WCAG contrast and marks incomplete exports", async () => {
    const { confirmFinalReview, contrastRatio, exportBlueprint, exportReadiness } = await import("@/lib/website-builder/model");
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
    expect(contrastRatio("not-a-color", "#ffffff")).toBeNull();
    let project = createProject({ name: "Studio", businessType: "Studio", purpose: "", audience: "" });
    const page = insertSample(activePage(project), CATALOGUE[0]);
    project = { ...project, pages: [{ ...page, instances: [{ ...page.instances[0], content: { ...page.instances[0].content, title: "" } }] }] };
    expect(exportReadiness(project).status).toBe("Incomplete");
    expect(JSON.parse(exportBlueprint(project)).schemaVersion).toBe("1.0.0");
    expect(JSON.parse(exportBlueprint(project)).status).toBe("Incomplete");
    project = { ...project, missions: project.missions.map(mission => ({ ...mission, status: "Complete" as const })) };
    project = confirmFinalReview(project, true);
    expect(exportReadiness(project).status).toBe("Complete");
    expect(JSON.parse(exportBlueprint(project)).status).toBe("Complete");
  });

});
