import { describe, expect, it } from "vitest";
import {
  CATALOGUE, TAXONOMY, SAMPLE_STYLES, WEBSITE_PURPOSES, createProject, activePage,
  insertSample, insertSampleAt, reorder, reorderToIndex, toggleHidden, removeInstance,
  duplicateInstance, reviewProject, serializeProject, markdownHandoff, setMissionStatus,
  validateProjectInput, validateSampleDefinition, validatePageComposition, validateFieldValue, searchCatalogue,
  replaceSample, resolveReplacementContent, prepareReplacement, updateInstanceContent,
  updateInstanceConfiguration, updateInstancePlaceholder, updateResponsivePresentation, clearResponsivePresentation, insertComponentCommand, confirmFinalReview, contrastRatio,
  exportBlueprint, exportReadiness, completeLevel, markMissionsForReview, createAdditionalPage,
  removePage, validateInternalNavigation
} from "@/lib/website-builder/model";

const projectInput = { name: "Studio", purpose: "Explain the studio and its work", businessType: "Studio", audience: "Clients" };

describe("website builder domain", () => {
  it("requires a project name and purpose and validates their documented limits", () => {
    expect(validateProjectInput({ name: "  ", purpose: "  " })).toEqual([
      "Add a project name to continue.", "Describe the website purpose to continue."
    ]);
    expect(validateProjectInput({ name: "x".repeat(81), purpose: "purpose" })).toContain("Project name must be 80 characters or fewer.");
    expect(() => createProject({ name: "Studio", purpose: " " })).toThrow("Describe the website purpose to continue.");
  });

  it("creates one temporary project, one empty page, and three responsive layouts", () => {
    const project = createProject(projectInput);
    expect(project.pages).toHaveLength(1);
    expect(activePage(project).layouts.desktop.order).toEqual([]);
    expect(activePage(project).layouts.tablet.order).toEqual([]);
    expect(activePage(project).layouts.mobile.order).toEqual([]);
    expect(project.missions).toHaveLength(11);
    expect(project.finalReviewConfirmed).toBe(false);
  });

  it("publishes a broad generic taxonomy and a validated synthetic portfolio", () => {
    expect(TAXONOMY.length).toBeGreaterThanOrEqual(9);
    expect(CATALOGUE.length).toBeGreaterThanOrEqual(25);
    expect(CATALOGUE.every(sample => validateSampleDefinition(sample).length === 0)).toBe(true);
    expect(CATALOGUE.every(sample => ["desktop","tablet","mobile"].every(breakpoint => sample.responsive[breakpoint as "desktop"|"tablet"|"mobile"].trim().length > 0))).toBe(true);
    expect(CATALOGUE.every(sample => TAXONOMY.some(category => category.name === sample.category && category.types.some(type => type.id === sample.type)))).toBe(true);
    expect(SAMPLE_STYLES).toContain("Editorial");
    expect(WEBSITE_PURPOSES.some(purpose => purpose.id === "portfolio")).toBe(true);
    expect(TAXONOMY.some(category => category.types.some(type => type.id === "product-grid"))).toBe(true);
    expect(TAXONOMY.some(category => category.types.some(type => type.id === "portfolio-grid"))).toBe(true);
  });

  it("searches by category, component type, visual style, purpose, and sample metadata", () => {
    expect(searchCatalogue({ category: "Navigation" }).map(sample => sample.id)).toContain("header-commerce");
    expect(searchCatalogue({ type: "hero" })).toHaveLength(3);
    expect(searchCatalogue({ style: "Editorial" }).length).toBeGreaterThan(1);
    expect(searchCatalogue({ purpose: "portfolio" }).some(sample => sample.id === "portfolio-grid")).toBe(true);
    expect(searchCatalogue({ query: "milestone" }).map(sample => sample.id)).toContain("story-timeline");
    expect(searchCatalogue({ query: "does-not-exist" })).toEqual([]);
  });

  it("inserts unique instances into all breakpoint layouts", () => {
    const page = insertSample(activePage(createProject(projectInput)), CATALOGUE[0]);
    expect(page.instances).toHaveLength(1);
    const instance = page.instances[0];
    expect(instance.sampleVersion).toBe(CATALOGUE[0].version);
    expect(instance.type).toBe(CATALOGUE[0].type);
    expect(page.layouts.desktop.order).toEqual([instance.id]);
    expect(page.layouts.tablet.order).toEqual([instance.id]);
    expect(page.layouts.mobile.order).toEqual([instance.id]);
    expect(validatePageComposition(page)).toEqual([]);
  });

  it("preserves the relative order of tablet and mobile when inserting at a desktop position", () => {
    const project = createProject(projectInput);
    let page = insertSample(activePage(project), CATALOGUE[0]);
    page = insertSample(page, CATALOGUE[1]);
    page = insertSample(page, CATALOGUE[2]);
    const [first, second, third] = page.instances;
    page = reorder(page, "tablet", third.id, -2);
    page = insertSampleAt(page, CATALOGUE.find(sample => sample.id === "header-editorial")!, { placement: "after", relativeToId: first.id });
    const inserted = page.instances.find(instance => instance.sampleId === "header-editorial")!;
    expect(page.layouts.desktop.order.indexOf(inserted.id)).toBe(page.layouts.desktop.order.indexOf(first.id) + 1);
    expect(page.layouts.tablet.order).toEqual([third.id, first.id, inserted.id, second.id]);
    expect(page.layouts.mobile.order).toEqual([first.id, inserted.id, second.id, third.id]);
  });

  it("rejects invalid insertion anchors without changing the page", () => {
    const page = activePage(createProject(projectInput));
    expect(insertSampleAt(page, CATALOGUE[0], { placement: "before", relativeToId: "missing" })).toBe(page);
    expect(insertComponentCommand(page, CATALOGUE[0], { placement: "before", relativeToId: "missing" })).toMatchObject({ ok: false });
  });

  it("supports independent breakpoint ordering and valid drag destination operations", () => {
    let page = activePage(createProject(projectInput));
    page = insertSample(page, CATALOGUE[0]);
    page = insertSample(page, CATALOGUE[1]);
    page = insertSample(page, CATALOGUE[2]);
    const [first, second, third] = page.instances;
    page = reorderToIndex(page, "desktop", third.id, 0);
    expect(page.layouts.desktop.order).toEqual([third.id, first.id, second.id]);
    expect(page.layouts.tablet.order).toEqual([first.id, second.id, third.id]);
    expect(reorderToIndex(page, "mobile", "unknown", 0)).toBe(page);
    expect(reorderToIndex(page, "desktop", first.id, 1).layouts.desktop.order).toEqual([third.id, first.id, second.id]);
  });

  it("hides a component at a breakpoint without removing shared membership", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE[0]);
    const id = page.instances[0].id;
    page = toggleHidden(page, "mobile", id);
    expect(page.layouts.mobile.hidden).toContain(id);
    expect(page.instances).toHaveLength(1);
    expect(page.layouts.desktop.order).toContain(id);
    expect(toggleHidden(page, "desktop", id)).toBe(page);
  });

  it("duplicates configuration, placeholder metadata, and responsive overrides independently", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE.find(sample => sample.id === "product-grid-editorial")!);
    const original = page.instances[0];
    const changed = updateResponsivePresentation(page, "tablet", original.id, "columns", "2");
    if (changed.ok) page = changed.value;
    page = duplicateInstance(page, original.id);
    const copy = page.instances.find(instance => instance.id !== original.id)!;
    expect(copy.configuration).toEqual(original.configuration);
    expect(copy.configuration).not.toBe(original.configuration);
    expect(page.layouts.tablet.presentation?.[copy.id]).toEqual({ columns: "2" });
    expect(page.layouts.tablet.presentation?.[copy.id]).not.toBe(page.layouts.tablet.presentation?.[original.id]);
  });

  it("duplicates independent content and removes shared membership across all layouts", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE[0]);
    const original = page.instances[0];
    page = duplicateInstance(page, original.id);
    expect(page.instances).toHaveLength(2);
    const duplicate = page.instances[1];
    expect(duplicate.id).not.toBe(original.id);
    expect(duplicate.content).toEqual(original.content);
    expect(duplicate.content).not.toBe(original.content);
    page = removeInstance(page, original.id);
    expect(page.instances).toHaveLength(1);
    for (const breakpoint of ["desktop", "tablet", "mobile"] as const) {
      expect(page.layouts[breakpoint].order).toEqual([duplicate.id]);
    }
  });

  it("validates schema-defined fields and configuration through atomic commands", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE.find(sample => sample.id === "product-grid-editorial")!);
    const instance = page.instances[0];
    const valid = updateInstanceContent(page, instance.id, "title", "Objects for everyday life");
    expect(valid.ok).toBe(true);
    if (valid.ok) page = valid.value;
    const invalid = updateInstanceContent(page, instance.id, "unknown-field", "value");
    expect(invalid).toMatchObject({ ok: false });
    expect(invalid.ok ? invalid.value : page).toBe(page);
    const overlong = updateInstanceContent(page, instance.id, "title", "x".repeat(120));
    expect(overlong).toMatchObject({ ok: false });
    const configured = updateInstanceConfiguration(page, instance.id, "columns", "2");
    expect(configured.ok).toBe(true);
    expect(updateInstanceConfiguration(page, instance.id, "columns", "99")).toMatchObject({ ok: false });
  });

  it("supports only declared responsive options and can reset an override to shared", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE.find(sample => sample.id === "product-grid-editorial")!);
    const instance = page.instances[0];
    const updated = updateResponsivePresentation(page, "tablet", instance.id, "columns", "2");
    expect(updated.ok).toBe(true);
    if (updated.ok) page = updated.value;
    expect(page.layouts.tablet.presentation?.[instance.id].columns).toBe("2");
    expect(page.layouts.desktop.presentation?.[instance.id]).toBeUndefined();
    expect(updateResponsivePresentation(page, "mobile", instance.id, "unsupported", "2")).toMatchObject({ ok: false });
    const cleared = clearResponsivePresentation(page, "tablet", instance.id, "columns");
    expect(cleared.ok).toBe(true);
    if (cleared.ok) page = cleared.value;
    expect(page.layouts.tablet.presentation?.[instance.id]).toBeUndefined();
    expect(validatePageComposition(page)).toEqual([]);
  });

  it("edits purpose-aware image placeholders without changing component identity", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE[0]);
    const instance = page.instances[0];
    const updated = updateInstancePlaceholder(page, instance.id, "image", "A wide image showing the studio interior");
    expect(updated.ok).toBe(true);
    if (updated.ok) {
      page = updated.value;
      expect(page.instances[0].placeholders.image.purpose).toBe("A wide image showing the studio interior");
      expect(page.instances[0].id).toBe(instance.id);
    }
    expect(updateInstancePlaceholder(page, instance.id, "title", "Not an image slot")).toMatchObject({ ok: false });
    expect(updateInstancePlaceholder(page, instance.id, "image", " ")).toMatchObject({ ok: false });
  });

  it("replaces only within the same component type and preserves the instance identity", () => {
    let page = insertSample(activePage(createProject(projectInput)), CATALOGUE[0]);
    const instance = page.instances[0];
    page = { ...page, instances: [{ ...instance, content: { ...instance.content, title: "My title", body: "My copy" } }] };
    const prepared = prepareReplacement(page, instance.id, CATALOGUE[1]);
    expect(prepared.ok).toBe(true);
    const result = replaceSample(page, instance.id, CATALOGUE[1]);
    expect(result.ok).toBe(true);
    expect(result.page.instances[0].id).toBe(instance.id);
    expect(result.page.instances[0].content.title).toBe("My title");
    expect(result.preservedFields).toContain("title");
    const incompatible = replaceSample(page, instance.id, CATALOGUE.find(sample => sample.type === "product-grid")!);
    expect(incompatible.ok).toBe(false);
    expect(incompatible.page).toBe(page);
  });

  it("resets incompatible and new fields while retaining compatible content by field identity and type", () => {
    const current = CATALOGUE[0];
    const candidate = {
      ...current,
      id: "hero-compatibility-test",
      fields: [
        ...current.fields.map(field => field.id === "title" ? { ...field, kind: "number" as const, defaultValue: "12" } : field),
        { id: "caption", label: "Caption", kind: "text" as const, defaultValue: "New caption" }
      ]
    };
    const result = resolveReplacementContent(current, { title: "Keep this?", body: "Preserve copy", eyebrow: "Hello" }, candidate);
    expect(result.content.title).toBe("12");
    expect(result.content.caption).toBe("New caption");
    expect(result.content.body).toBe("Preserve copy");
    expect(result.resetFields).toContain("title");
    expect(result.resetFields).toContain("caption");
    expect(result.preservedFields).toContain("body");
  });

  it("reports required content and provides a versioned JSON and Markdown handoff", () => {
    const project = createProject(projectInput);
    const page = insertSample(activePage(project), CATALOGUE[0]);
    const invalid = { ...project, pages: [{ ...page, instances: page.instances.map(instance => ({ ...instance, content: { ...instance.content, title: "" } })) }] };
    expect(reviewProject(invalid).some(finding => finding.message.includes("Title"))).toBe(true);
    expect(JSON.parse(serializeProject(project)).schemaVersion).toBe("1.0.0");
    expect(markdownHandoff(project)).toContain("# Studio");
  });

  it("keeps level completion separate from mission completion and supports review propagation", () => {
    let project = createProject(projectInput);
    project = setMissionStatus(project, 2, "Complete");
    project = completeLevel(project, 2, true);
    project = setMissionStatus(project, 3, "Not started", true);
    expect(project.completedLevels).toEqual([2]);
    expect(project.missions.find(mission => mission.level === 3)).toMatchObject({ status: "Complete", notNeeded: true });
    project = markMissionsForReview(project, [2, 3]);
    expect(project.missions.find(mission => mission.level === 2)?.status).toBe("Needs review");
    expect(project.missions.find(mission => mission.level === 3)?.status).toBe("Complete");
  });

  it("enforces page lifecycle and validates stable internal navigation references", () => {
    let project = createProject(projectInput);
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



  it("validates bounded, repeatable, structured, URL, and enum field values", () => {
    expect(validateFieldValue({ id: "links", label: "Links", kind: "list", defaultValue: "", repeatable: true, minItems: 2, maxItems: 3 }, "one")).toContain("at least 2");
    expect(validateFieldValue({ id: "items", label: "Items", kind: "structured", defaultValue: "", repeatable: true, minItems: 1 }, "{\"one\":1}")).toContain("JSON array");
    expect(validateFieldValue({ id: "items", label: "Items", kind: "structured", defaultValue: "", repeatable: true }, "[{\"one\":1}]")).toBeNull();
    expect(validateFieldValue({ id: "url", label: "Link", kind: "link", defaultValue: "" }, "not-a-link")).toContain("web, email, phone, or internal page link");
    expect(validateFieldValue({ id: "url", label: "Link", kind: "link", defaultValue: "" }, "page:about")).toBeNull();
    expect(validateFieldValue({ id: "choice", label: "Choice", kind: "enum", defaultValue: "a", options: ["a", "b"] }, "c")).toContain("Choose a valid");
  });

  it("requires every declared image placeholder and sample configuration", () => {
    const page = insertSample(activePage(createProject(projectInput)), CATALOGUE.find(sample => sample.id === "product-grid-editorial")!);
    const instance = page.instances[0];
    const invalid = { ...page, instances: [{ ...instance, placeholders: {}, configuration: {} }] };
    expect(validatePageComposition(invalid)).toContain("An image field is missing its purpose placeholder.");
    expect(validatePageComposition(invalid)).toContain("A component is missing configuration: columns.");
  });

  it("keeps desktop on shared configuration and restricts overrides to tablet and mobile", () => {
    const page = insertSample(activePage(createProject(projectInput)), CATALOGUE.find(sample => sample.id === "product-grid-editorial")!);
    const instance = page.instances[0];
    expect(updateResponsivePresentation(page, "desktop", instance.id, "columns", "2")).toMatchObject({ ok: false });
    expect(clearResponsivePresentation(page, "desktop", instance.id, "columns")).toMatchObject({ ok: false });
    expect(validatePageComposition(page)).toEqual([]);
  });

  it("calculates contrast and prevents complete handoff while content is invalid", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
    expect(contrastRatio("not-a-color", "#ffffff")).toBeNull();
    let project = createProject(projectInput);
    const page = insertSample(activePage(project), CATALOGUE[0]);
    project = { ...project, pages: [{ ...page, instances: [{ ...page.instances[0], content: { ...page.instances[0].content, title: "" } }] }] };
    expect(exportReadiness(project).status).toBe("Incomplete");
    project = { ...project, missions: project.missions.map(mission => ({ ...mission, status: "Complete" as const })) };
    project = confirmFinalReview(project, true);
    expect(exportReadiness(project).status).toBe("Incomplete");
    const validPage = { ...page, instances: page.instances.map(instance => ({ ...instance, content: { ...instance.content, title: "A complete title" } })) };
    project = { ...project, pages: [validPage] };
    expect(exportReadiness(project).status).toBe("Complete");
    expect(JSON.parse(exportBlueprint(project)).status).toBe("Complete");
  });
});
