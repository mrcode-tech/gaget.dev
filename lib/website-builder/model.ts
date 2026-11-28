import { CATALOGUE, TAXONOMY, SAMPLE_STYLES, WEBSITE_PURPOSES } from "./catalogue";
export { CATALOGUE, TAXONOMY, SAMPLE_STYLES, WEBSITE_PURPOSES };

export type Breakpoint = "desktop" | "tablet" | "mobile";
export type FieldKind = "text" | "textarea" | "url" | "image" | "number" | "boolean" | "enum" | "list" | "structured";
export type FieldDefinition = {
  id: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  defaultValue: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  placeholderPurpose?: string;
};
export type ConfigurationDefinition = { id: string; label: string; defaultValue: string; options: string[] };
export type TaxonomyType = { id: string; name: string; description: string };
export type TaxonomyCategory = { id: string; name: string; description: string; types: TaxonomyType[] };
export type Sample = {
  id: string;
  version: string;
  type: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  rationale: string;
  style: string;
  secondaryStyles: string[];
  purposes: string[];
  keywords: string[];
  lifecycle: "draft" | "review" | "published" | "deprecated" | "retired";
  fields: FieldDefinition[];
  configuration?: ConfigurationDefinition[];
  accent: string;
  layout: "hero" | "cards" | "split" | "banner" | "footer";
  rendererKey: string;
};
export type Instance = {
  id: string;
  sampleId: string;
  sampleVersion: string;
  type: string;
  content: Record<string, string>;
  configuration: Record<string, string>;
  placeholders: Record<string, { purpose: string; assetId?: string }>;
};
export type ResponsiveLayout = { order: string[]; hidden: string[]; presentation?: Record<string, Record<string, string>> };
export type Page = { id: string; name: string; slug: string; instances: Instance[]; layouts: Record<Breakpoint, ResponsiveLayout> };
export type MissionStatus = "Not started" | "In progress" | "Complete" | "Needs review";
export type Mission = { id: string; title: string; level: number; status: MissionStatus; notNeeded: boolean };
export type Identity = { palette: string; primary: string; background: string; surface: string; text: string; accent: string; font: string };
export type Project = {
  id: string; name: string; businessType: string; purpose: string; audience: string;
  pages: Page[]; activePageId: string; identity: Identity; missions: Mission[];
  completedLevels: number[]; finalReviewConfirmed: boolean;
};
export type ProjectInput = { name: string; purpose: string; businessType?: string; audience?: string };
export type InsertPosition = { placement: "start" | "end" | "before" | "after"; relativeToId?: string };
export type ReplaceResult = {
  page: Page; preservedFields: string[]; resetFields: string[]; removedFields: string[];
  ok: boolean; error?: string;
};
export type ReplacementDraft = { original: Instance; candidate: Instance; result: ReplaceResult };
export type CommandResult<T> = { ok: true; value: T } | { ok: false; error: string };
export type AssetRecord = {
  id: string; fileName: string; mimeType: string; size: number; altText: string;
  dataUrl: string; pageId?: string; instanceId?: string;
};
export type NavigationReference = { pageId: string; label: string };
export type ExportReadiness = { status: "Complete" | "Incomplete"; findings: ReturnType<typeof reviewProject> };
export type WebsiteIdentityOptions = {
  direction: string; headingFont: string; bodyFont: string; typeScale: "compact" | "balanced" | "expressive";
  imageDirection: string; buttonStyle: "solid" | "outline" | "text"; spacing: "compact" | "comfortable" | "spacious";
  secondary: string; mutedText: string; border: string;
};
export type CatalogueFilters = { category?: string; type?: string; style?: string; purpose?: string; query?: string };

export const LEVELS = [
  "Define website", "Explore visual direction", "Build shared website frame", "Design homepage introduction",
  "Build homepage content", "Complete homepage", "Design responsive behavior", "Plan additional pages",
  "Design additional pages", "Review website", "Complete design and handoff",
] as const;

export const DEFAULT_MISSIONS: Mission[] = LEVELS.map((title, level) => ({
  id: "level-" + level, title, level, status: "Not started", notNeeded: false,
}));

export const PALETTES: Identity[] = [
  { palette: "Warm studio", primary: "#9a5b43", background: "#f4efe8", surface: "#fffdf9", text: "#282522", accent: "#c69b68", font: "Georgia" },
  { palette: "Botanical", primary: "#536b55", background: "#eff1e9", surface: "#fbfcf8", text: "#252d27", accent: "#b98d62", font: "Arial" },
  { palette: "Midnight", primary: "#334d68", background: "#edf0f3", surface: "#ffffff", text: "#202a35", accent: "#bd9469", font: "Georgia" },
  { palette: "Modern mono", primary: "#303030", background: "#f1f1ef", surface: "#ffffff", text: "#171717", accent: "#9b9b91", font: "Arial" },
];

function createId(prefix: string): string {
  const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);
  return prefix + "-" + random;
}

export function validateProjectInput(input: Pick<ProjectInput, "name" | "purpose">): string[] {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push("Add a project name to continue.");
  if (!input.purpose.trim()) errors.push("Describe the website purpose to continue.");
  if (input.name.trim().length > 80) errors.push("Project name must be 80 characters or fewer.");
  if (input.purpose.trim().length > 500) errors.push("Website purpose must be 500 characters or fewer.");
  return errors;
}

export function createProject(input: ProjectInput): Project {
  const errors = validateProjectInput(input);
  if (errors.length) throw new Error(errors.join(" "));
  const page: Page = {
    id: createId("page"), name: "Home", slug: "/", instances: [],
    layouts: {
      desktop: { order: [], hidden: [], presentation: {} },
      tablet: { order: [], hidden: [], presentation: {} },
      mobile: { order: [], hidden: [], presentation: {} },
    },
  };
  return {
    id: createId("project"), name: input.name.trim(), purpose: input.purpose.trim(),
    businessType: input.businessType?.trim() || "General website", audience: input.audience?.trim() || "",
    pages: [page], activePageId: page.id, identity: { ...PALETTES[0] },
    missions: DEFAULT_MISSIONS.map(m => ({ ...m })), completedLevels: [], finalReviewConfirmed: false,
  };
}

export function activePage(project: Project): Page {
  return project.pages.find(page => page.id === project.activePageId) ?? project.pages[0];
}

export function getSampleById(id: string): Sample | undefined {
  return CATALOGUE.find(sample => sample.id === id);
}

export function searchCatalogue(filters: CatalogueFilters = {}): Sample[] {
  const query = (filters.query ?? "").trim().toLowerCase();
  return CATALOGUE.filter(item => {
    if (item.lifecycle !== "published") return false;
    if (filters.category && filters.category !== "All" && item.category !== filters.category) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.style && item.style !== filters.style && !item.secondaryStyles.includes(filters.style)) return false;
    if (filters.purpose && !item.purposes.includes(filters.purpose) && !item.purposes.includes("all")) return false;
    if (query) {
      const haystack = [item.name, item.description, item.rationale, item.type, item.category, item.subcategory,
        item.style, ...item.secondaryStyles, ...item.purposes, ...item.keywords, ...item.fields.map(f => f.label)]
        .join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function validateSampleDefinition(sample: Sample): string[] {
  const errors: string[] = [];
  if (!sample.id.trim() || !sample.version.trim()) errors.push("Sample identity and version are required.");
  if (!sample.type.trim() || !sample.category.trim()) errors.push("Sample category and component type are required.");
  if (!TAXONOMY.some(category => category.name === sample.category && category.types.some(type => type.id === sample.type))) {
    errors.push("Sample category and component type must resolve to the approved taxonomy.");
  }
  if (!SAMPLE_STYLES.includes(sample.style as typeof SAMPLE_STYLES[number]) ||
      sample.secondaryStyles.some(style => !SAMPLE_STYLES.includes(style as typeof SAMPLE_STYLES[number]))) {
    errors.push("Sample visual styles must use the controlled style vocabulary.");
  }
  if (sample.purposes.some(purpose => purpose !== "all" && !WEBSITE_PURPOSES.some(item => item.id === purpose))) {
    errors.push("Sample website purposes must use the controlled purpose vocabulary.");
  }
  if (!sample.rendererKey.trim()) errors.push("A renderer key is required.");
  if (new Set(sample.fields.map(field => field.id)).size !== sample.fields.length) errors.push("Sample field identifiers must be unique.");
  for (const field of sample.fields) {
    if (!field.id.trim() || !field.label.trim()) errors.push("Every sample field needs an identifier and label.");
    if (field.kind === "enum" && (!field.options?.length || !field.options.includes(field.defaultValue))) errors.push("Enum field defaults must be declared options.");
    if (field.minLength !== undefined && field.maxLength !== undefined && field.minLength > field.maxLength) errors.push("Field minimum length cannot exceed its maximum.");
  }
  for (const option of sample.configuration ?? []) {
    if (!option.options.length || !option.options.includes(option.defaultValue)) errors.push("Configuration defaults must be declared options.");
  }
  return errors;
}

export function validateFieldValue(field: FieldDefinition, value: string): string | null {
  if (field.required && !value.trim()) return field.label + " is required.";
  if (field.minLength !== undefined && value.length < field.minLength) return field.label + " is too short.";
  if (field.maxLength !== undefined && value.length > field.maxLength) return field.label + " is too long.";
  if (field.pattern && value && !new RegExp(field.pattern).test(value)) return field.label + " has an invalid format.";
  if (field.kind === "number" && value && (!Number.isFinite(Number(value)) ||
      (field.min !== undefined && Number(value) < field.min) || (field.max !== undefined && Number(value) > field.max))) {
    return field.label + " must be a valid number within the allowed range.";
  }
  if (field.kind === "enum" && value && !field.options?.includes(value)) return "Choose a valid " + field.label.toLowerCase() + ".";
  if (field.kind === "url" && value && !/^page:[a-zA-Z0-9_-]+$/.test(value) &&
      !/^(https?:\/\/|mailto:|tel:)/i.test(value)) return field.label + " must be a web, email, phone, or internal page link.";
  if (field.kind === "image" && value && !/^(https?:\/\/|asset:)/i.test(value)) return field.label + " must reference a web image or selected session asset.";
  if (field.kind === "boolean" && value && value !== "true" && value !== "false") return field.label + " must be true or false.";
  if (field.kind === "list" && value && value.split("\n").length > 50) return field.label + " can contain at most 50 items.";
  if (field.kind === "structured" && value) {
    try { if (!Array.isArray(JSON.parse(value)) && typeof JSON.parse(value) !== "object") return field.label + " must contain structured JSON."; }
    catch { return field.label + " must contain valid JSON."; }
  }
  return null;
}

export function validateInstanceContent(sample: Sample, content: Record<string, string>): string[] {
  const errors: string[] = [];
  const allowed = new Set(sample.fields.map(field => field.id));
  for (const key of Object.keys(content)) if (!allowed.has(key)) errors.push("Unsupported content field: " + key + ".");
  for (const field of sample.fields) {
    const error = validateFieldValue(field, content[field.id] ?? "");
    if (error) errors.push(error);
  }
  return errors;
}

export function createInstance(sample: Sample): Instance {
  return {
    id: createId("instance"), sampleId: sample.id, sampleVersion: sample.version, type: sample.type,
    content: Object.fromEntries(sample.fields.map(field => [field.id, field.defaultValue])),
    configuration: Object.fromEntries((sample.configuration ?? []).map(option => [option.id, option.defaultValue])),
    placeholders: Object.fromEntries(sample.fields.filter(field => field.kind === "image").map(field =>
      [field.id, { purpose: field.placeholderPurpose ?? field.label }])),
  };
}

function insertIntoOrder(order: string[], id: string, index: number): string[] {
  const next = [...order];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, id);
  return next;
}

export function insertSample(page: Page, sample: Sample, index = page.layouts.desktop.order.length): Page {
  return insertSampleAt(page, sample, index <= 0 ? { placement: "start" } :
    index >= page.layouts.desktop.order.length ? { placement: "end" } :
      { placement: "before", relativeToId: page.layouts.desktop.order[index] });
}

export function insertSampleAt(page: Page, sample: Sample, position: InsertPosition): Page {
  if (sample.lifecycle !== "published" || validateSampleDefinition(sample).length) return page;
  const desktopOrder = [...page.layouts.desktop.order];
  let index = desktopOrder.length;
  if (position.placement === "start") index = 0;
  if (position.placement === "before" || position.placement === "after") {
    const target = desktopOrder.indexOf(position.relativeToId ?? "");
    if (target < 0) return page;
    index = target + (position.placement === "after" ? 1 : 0);
  }
  const instance = createInstance(sample);
  const previousDesktop = desktopOrder[index - 1];
  const nextDesktop = desktopOrder[index];
  const layouts = { ...page.layouts };
  layouts.desktop = { ...page.layouts.desktop, order: insertIntoOrder(desktopOrder, instance.id, index) };
  for (const bp of ["tablet", "mobile"] as const) {
    const order = [...page.layouts[bp].order];
    let responsiveIndex = order.length;
    if (previousDesktop) {
      const previousIndex = order.indexOf(previousDesktop);
      if (previousIndex >= 0) responsiveIndex = previousIndex + 1;
      else if (nextDesktop && order.includes(nextDesktop)) responsiveIndex = order.indexOf(nextDesktop);
    } else if (nextDesktop && order.includes(nextDesktop)) responsiveIndex = order.indexOf(nextDesktop);
    layouts[bp] = { ...page.layouts[bp], order: insertIntoOrder(order, instance.id, responsiveIndex) };
  }
  const instances = [...page.instances];
  instances.splice(Math.max(0, Math.min(index, instances.length)), 0, instance);
  return { ...page, instances, layouts };
}

export function reorderToIndex(page: Page, breakpoint: Breakpoint, id: string, targetIndex: number): Page {
  if (!page.instances.some(instance => instance.id === id)) return page;
  const current = page.layouts[breakpoint];
  if (current.order.length !== page.instances.length || new Set(current.order).size !== current.order.length ||
      current.order.some(ref => !page.instances.some(instance => instance.id === ref))) return page;
  const from = current.order.indexOf(id);
  if (from < 0 || !Number.isInteger(targetIndex)) return page;
  const order = [...current.order];
  order.splice(from, 1);
  order.splice(Math.max(0, Math.min(targetIndex, order.length)), 0, id);
  if (order.every((value, index) => value === current.order[index])) return page;
  return { ...page, layouts: { ...page.layouts, [breakpoint]: { ...current, order } } };
}

export function reorder(page: Page, breakpoint: Breakpoint, id: string, delta: number): Page {
  const currentIndex = page.layouts[breakpoint].order.indexOf(id);
  if (!Number.isInteger(delta)) return page;
  return reorderToIndex(page, breakpoint, id, currentIndex + delta);
}

export function toggleHidden(page: Page, breakpoint: Breakpoint, id: string): Page {
  if (breakpoint === "desktop" || !page.instances.some(instance => instance.id === id)) return page;
  const current = page.layouts[breakpoint];
  const hidden = current.hidden.includes(id) ? current.hidden.filter(value => value !== id) : [...current.hidden, id];
  return { ...page, layouts: { ...page.layouts, [breakpoint]: { ...current, hidden } } };
}

export function removeInstance(page: Page, id: string): Page {
  if (!page.instances.some(instance => instance.id === id)) return page;
  return {
    ...page,
    instances: page.instances.filter(instance => instance.id !== id),
    layouts: Object.fromEntries((["desktop", "tablet", "mobile"] as Breakpoint[]).map(bp => [bp, {
      ...page.layouts[bp], order: page.layouts[bp].order.filter(value => value !== id),
      hidden: page.layouts[bp].hidden.filter(value => value !== id),
      presentation: Object.fromEntries(Object.entries(page.layouts[bp].presentation ?? {}).filter(([key]) => key !== id)),
    }])) as Record<Breakpoint, ResponsiveLayout>,
  };
}

export function duplicateInstance(page: Page, id: string): Page {
  const source = page.instances.find(instance => instance.id === id);
  if (!source) return page;
  const copy: Instance = {
    ...source, id: createId("instance"), content: { ...source.content }, configuration: { ...source.configuration },
    placeholders: Object.fromEntries(Object.entries(source.placeholders).map(([key, value]) => [key, { ...value }])),
  };
  const instances = [...page.instances];
  const at = instances.findIndex(instance => instance.id === id);
  instances.splice(at + 1, 0, copy);
  const layouts = Object.fromEntries((["desktop", "tablet", "mobile"] as Breakpoint[]).map(bp => {
    const order = [...page.layouts[bp].order];
    const index = order.indexOf(id);
    if (index >= 0) order.splice(index + 1, 0, copy.id);
    return [bp, { ...page.layouts[bp], order }];
  })) as Record<Breakpoint, ResponsiveLayout>;
  return { ...page, instances, layouts };
}

export function updateInstanceContent(page: Page, instanceId: string, fieldId: string, value: string): CommandResult<Page> {
  const instance = page.instances.find(item => item.id === instanceId);
  if (!instance) return { ok: false, error: "The selected section no longer exists." };
  const sample = getSampleById(instance.sampleId);
  if (!sample) return { ok: false, error: "The selected sample definition is unavailable." };
  const field = sample.fields.find(item => item.id === fieldId);
  if (!field) return { ok: false, error: "This field is not supported by the selected design." };
  const error = validateFieldValue({ ...field, required: false }, value);
  if (error) return { ok: false, error };
  return { ok: true, value: { ...page, instances: page.instances.map(item => item.id === instanceId
    ? { ...item, content: { ...item.content, [fieldId]: value } } : item) } };
}

export function updateInstancePlaceholder(page: Page, instanceId: string, slotId: string, purpose: string): CommandResult<Page> {
  const instance = page.instances.find(item => item.id === instanceId);
  if (!instance) return { ok: false, error: "The selected section no longer exists." };
  const sample = getSampleById(instance.sampleId);
  const slot = sample?.fields.find(field => field.id === slotId && field.kind === "image");
  if (!slot) return { ok: false, error: "This image placeholder is not supported by the selected design." };
  if (!purpose.trim() || purpose.trim().length > 120) return { ok: false, error: "Image purpose must contain between 1 and 120 characters." };
  return { ok: true, value: { ...page, instances: page.instances.map(item => item.id === instanceId
    ? { ...item, placeholders: { ...item.placeholders, [slotId]: { ...item.placeholders[slotId], purpose: purpose.trim() } } }
    : item) } };
}

export function updateInstanceConfiguration(page: Page, instanceId: string, key: string, value: string): CommandResult<Page> {
  const instance = page.instances.find(item => item.id === instanceId);
  if (!instance) return { ok: false, error: "The selected section no longer exists." };
  const sample = getSampleById(instance.sampleId);
  const option = sample?.configuration?.find(item => item.id === key);
  if (!option || !option.options.includes(value)) return { ok: false, error: "Choose one of the options supported by this design." };
  return { ok: true, value: { ...page, instances: page.instances.map(item => item.id === instanceId
    ? { ...item, configuration: { ...item.configuration, [key]: value } } : item) } };
}

export function validatePageComposition(page: Page): string[] {
  const errors: string[] = [];
  const ids = page.instances.map(instance => instance.id);
  if (new Set(ids).size !== ids.length) errors.push("Component instance identifiers must be unique.");
  for (const instance of page.instances) {
    const sample = getSampleById(instance.sampleId);
    if (!sample) { errors.push("A component references an unavailable sample."); continue; }
    if (instance.type !== sample.type) errors.push("A component type does not match its sample.");
    if (instance.sampleVersion !== sample.version) errors.push("A component sample version is unavailable.");
    errors.push(...validateInstanceContent(sample, instance.content));
    for (const [slotId, placeholder] of Object.entries(instance.placeholders)) {
      const field = sample.fields.find(item => item.id === slotId && item.kind === "image");
      if (!field) errors.push("A placeholder references an unsupported image slot.");
      if (!placeholder.purpose.trim()) errors.push("Image placeholder purpose cannot be empty.");
    }
    for (const [key, value] of Object.entries(instance.configuration)) {
      const option = sample.configuration?.find(item => item.id === key);
      if (!option || !option.options.includes(value)) errors.push("Unsupported configuration value: " + key + ".");
    }
  }
  for (const bp of ["desktop", "tablet", "mobile"] as const) {
    const layout = page.layouts[bp];
    if (layout.order.length !== ids.length || new Set(layout.order).size !== ids.length ||
        layout.order.some(id => !ids.includes(id))) errors.push(bp + " layout must contain every shared component exactly once.");
    if (layout.hidden.some(id => !ids.includes(id))) errors.push(bp + " visibility references an unknown component.");
    for (const id of Object.keys(layout.presentation ?? {})) {
      if (!ids.includes(id)) errors.push(bp + " presentation references an unknown component.");
    }
  }
  return [...new Set(errors)];
}

export function insertComponentCommand(page: Page, sample: Sample, position: InsertPosition): CommandResult<Page> {
  const next = insertSampleAt(page, sample, position);
  if (next === page) return { ok: false, error: "The sample or insertion position is not valid." };
  const errors = validatePageComposition(next);
  return errors.length ? { ok: false, error: errors[0] } : { ok: true, value: next };
}

export function prepareReplacement(page: Page, instanceId: string, nextSample: Sample): CommandResult<ReplacementDraft> {
  const original = page.instances.find(instance => instance.id === instanceId);
  if (!original) return { ok: false, error: "The selected section no longer exists." };
  if (original.type !== nextSample.type) return { ok: false, error: "Choose a design from the same component type." };
  if (nextSample.lifecycle !== "published" || validateSampleDefinition(nextSample).length) return { ok: false, error: "This design is not available for replacement." };
  const result = replaceSample(page, instanceId, nextSample);
  if (!result.ok) return { ok: false, error: result.error ?? "The replacement could not be prepared." };
  return { ok: true, value: { original, candidate: result.page.instances.find(instance => instance.id === instanceId)!, result } };
}

export function resolveReplacementContent(currentSample: Sample, currentContent: Record<string, string>, nextSample: Sample): {
  content: Record<string, string>; preservedFields: string[]; resetFields: string[]; removedFields: string[];
} {
  const content: Record<string, string> = {};
  const preservedFields: string[] = [];
  const resetFields: string[] = [];
  const removedFields: string[] = [];
  const targetFields = new Map(nextSample.fields.map(field => [field.id, field]));
  for (const field of nextSample.fields) {
    const oldField = currentSample.fields.find(item => item.id === field.id);
    const existing = currentContent[field.id];
    if (oldField && oldField.kind === field.kind && existing !== undefined && !validateFieldValue(field, existing)) {
      content[field.id] = existing;
      preservedFields.push(field.id);
    } else {
      content[field.id] = field.defaultValue;
      resetFields.push(field.id);
    }
  }
  for (const field of currentSample.fields) if (!targetFields.has(field.id)) removedFields.push(field.id);
  return { content, preservedFields, resetFields, removedFields };
}

export function replaceSample(page: Page, instanceId: string, nextSample: Sample): ReplaceResult {
  const current = page.instances.find(instance => instance.id === instanceId);
  const fail = (error: string): ReplaceResult => ({ page, preservedFields: [], resetFields: [], removedFields: [], ok: false, error });
  if (!current) return fail("The selected section no longer exists.");
  if (current.type !== nextSample.type) return fail("Replacement must use the same component type.");
  if (nextSample.lifecycle !== "published" || validateSampleDefinition(nextSample).length) return fail("This design is not available.");
  const currentSample = getSampleById(current.sampleId);
  if (!currentSample) return fail("The current sample definition is unavailable.");
  const compatibility = resolveReplacementContent(currentSample, current.content, nextSample);
  const { content: nextContent, preservedFields, resetFields, removedFields } = compatibility;
  const nextConfiguration: Record<string, string> = {};
  for (const option of nextSample.configuration ?? []) {
    const oldOption = currentSample?.configuration?.find(item => item.id === option.id);
    const value = current.configuration[option.id];
    nextConfiguration[option.id] = oldOption && oldOption.options.includes(value) && option.options.includes(value)
      ? value : option.defaultValue;
  }
  const nextInstance: Instance = {
    ...current, sampleId: nextSample.id, sampleVersion: nextSample.version, type: nextSample.type,
    content: nextContent, configuration: nextConfiguration,
    placeholders: Object.fromEntries(nextSample.fields.filter(field => field.kind === "image").map(field => {
      const previous = current.placeholders[field.id];
      return [field.id, previous ? { ...previous, purpose: field.placeholderPurpose ?? previous.purpose } :
        { purpose: field.placeholderPurpose ?? field.label }];
    })),
  };
  const nextPage = { ...page, instances: page.instances.map(item => item.id === instanceId ? nextInstance : item) };
  const errors = validatePageComposition(nextPage);
  if (errors.length) return fail(errors[0]);
  return { page: nextPage, preservedFields, resetFields, removedFields, ok: true };
}

export function reorderInstanceToIndex(page: Page, breakpoint: Breakpoint, instanceId: string, targetIndex: number): CommandResult<Page> {
  const next = reorderToIndex(page, breakpoint, instanceId, targetIndex);
  if (next === page) return { ok: false, error: "The requested component move is invalid or has no effect." };
  return { ok: true, value: next };
}

export function removeComponentCommand(page: Page, instanceId: string): CommandResult<Page> {
  if (!page.instances.some(instance => instance.id === instanceId)) return { ok: false, error: "The selected section no longer exists." };
  return { ok: true, value: removeInstance(page, instanceId) };
}

export function duplicateComponentCommand(page: Page, instanceId: string): CommandResult<Page> {
  if (!page.instances.some(instance => instance.id === instanceId)) return { ok: false, error: "The selected section no longer exists." };
  return { ok: true, value: duplicateInstance(page, instanceId) };
}

export function reviewProject(project: Project): { severity: "error" | "warning"; message: string; pageId: string; instanceId?: string; fieldId?: string }[] {
  const findings: { severity: "error" | "warning"; message: string; pageId: string; instanceId?: string; fieldId?: string }[] = [];
  for (const page of project.pages) {
    for (const instance of page.instances) {
      const sample = getSampleById(instance.sampleId);
      if (!sample) {
        findings.push({ severity: "error", message: "A section uses an unavailable design.", pageId: page.id, instanceId: instance.id });
        continue;
      }
      for (const field of sample.fields) {
        const error = validateFieldValue(field, instance.content[field.id] ?? "");
        if (error) findings.push({ severity: field.required ? "error" : "warning", message: error, pageId: page.id, instanceId: instance.id, fieldId: field.id });
      }
    }
    for (const error of validatePageComposition(page)) findings.push({ severity: "error", message: error, pageId: page.id });
  }
  return findings;
}

export function serializeProject(project: Project): string {
  return JSON.stringify({ schemaVersion: "1.0.0", exportedAt: "", project }, null, 2);
}

export function markdownHandoff(project: Project): string {
  return [
    "# " + project.name, "",
    "> Session-only design blueprint. This document describes the composition; it is not a published website.", "",
    "## Website definition", "- Business: " + project.businessType, "- Purpose: " + project.purpose, "- Audience: " + project.audience, "",
    "## Visual identity", "- Direction: " + project.identity.palette, "- Primary: " + project.identity.primary,
    "- Background: " + project.identity.background, "- Typography: " + project.identity.font, "",
    "## Pages", ...project.pages.flatMap(page => [
      "### " + page.name + " (" + page.slug + ")",
      ...page.layouts.desktop.order.map(id => {
        const instance = page.instances.find(item => item.id === id);
        if (!instance) return "- [Missing component reference: " + id + "]";
        const definition = getSampleById(instance.sampleId);
        return "- " + (definition?.name ?? instance.sampleId) + ": " + (instance.content.title ?? instance.content.quote ?? "");
      }), "",
    ]),
    "## Responsive behavior", "Desktop, tablet and mobile layouts are maintained independently for order and visibility.",
  ].join("\n");
}

export function setMissionStatus(project: Project, level: number, status: MissionStatus, notNeeded = false): Project {
  const missions = project.missions.map(mission => mission.level === level
    ? { ...mission, status: notNeeded ? "Complete" as const : status, notNeeded }
    : mission);
  return { ...project, missions };
}

export function completeLevel(project: Project, level: number, complete: boolean): Project {
  const levels = new Set(project.completedLevels);
  if (complete) levels.add(level); else levels.delete(level);
  return { ...project, completedLevels: [...levels].sort((a, b) => a - b) };
}

export function markMissionsForReview(project: Project, affectedLevels: number[]): Project {
  const affected = new Set(affectedLevels);
  return { ...project, missions: project.missions.map(mission =>
    affected.has(mission.level) && mission.status === "Complete" && !mission.notNeeded
      ? { ...mission, status: "Needs review" } : mission) };
}

export function createAdditionalPage(project: Project, name: string, slug: string): Project {
  const normalized = slug.startsWith("/") ? slug : "/" + slug;
  if (!name.trim() || !normalized.slice(1) || project.pages.some(page => page.slug === normalized)) return project;
  const id = createId("page");
  const page: Page = {
    id, name: name.trim(), slug: normalized, instances: [],
    layouts: {
      desktop: { order: [], hidden: [], presentation: {} },
      tablet: { order: [], hidden: [], presentation: {} },
      mobile: { order: [], hidden: [], presentation: {} },
    },
  };
  return { ...project, pages: [...project.pages, page], activePageId: id };
}

export function removePage(project: Project, pageId: string): Project {
  if (project.pages.length <= 1 || !project.pages.some(page => page.id === pageId)) return project;
  const pages = project.pages.filter(page => page.id !== pageId);
  return { ...project, pages, activePageId: project.activePageId === pageId ? pages[0].id : project.activePageId };
}

export function setActivePage(project: Project, pageId: string): Project {
  return project.pages.some(page => page.id === pageId) ? { ...project, activePageId: pageId } : project;
}

export function validateInternalNavigation(project: Project): { pageId: string; instanceId: string; fieldId: string; message: string }[] {
  const validIds = new Set(project.pages.map(page => page.id));
  const errors: { pageId: string; instanceId: string; fieldId: string; message: string }[] = [];
  for (const page of project.pages) for (const instance of page.instances) {
    for (const [fieldId, value] of Object.entries(instance.content)) {
      if (typeof value !== "string") continue;
      const match = value.match(/^page:([a-zA-Z0-9_-]+)$/);
      if (match && !validIds.has(match[1])) errors.push({ pageId: page.id, instanceId: instance.id, fieldId, message: "This link points to a page that no longer exists." });
    }
  }
  return errors;
}

function linearChannel(hex: string): number {
  const channel = parseInt(hex, 16) / 255;
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}
export function contrastRatio(foreground: string, background: string): number | null {
  const valid = /^#?([\da-f]{6})$/i;
  const fg = foreground.match(valid)?.[1], bg = background.match(valid)?.[1];
  if (!fg || !bg) return null;
  const luminance = (color: string) => {
    const r = linearChannel(color.slice(0, 2)), g = linearChannel(color.slice(2, 4)), b = linearChannel(color.slice(4, 6));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const values = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return Number(((values[0] + 0.05) / (values[1] + 0.05)).toFixed(2));
}

export function reviewIdentity(identity: Identity): { role: string; ratio: number | null; passesAA: boolean }[] {
  const body = contrastRatio(identity.text, identity.background);
  const primary = contrastRatio(identity.primary, identity.background);
  return [
    { role: "Body text on background", ratio: body, passesAA: body !== null && body >= 4.5 },
    { role: "Primary interface element on background", ratio: primary, passesAA: primary !== null && primary >= 3 },
  ];
}

export function confirmFinalReview(project: Project, confirmed: boolean): Project {
  return { ...project, finalReviewConfirmed: confirmed };
}

export function exportReadiness(project: Project): ExportReadiness {
  const findings = [...reviewProject(project)];
  for (const page of project.pages) {
    if (!page.name.trim() || !page.slug.startsWith("/")) findings.push({ severity: "error", message: "Page name and absolute internal route are required.", pageId: page.id });
  }
  for (const issue of validateInternalNavigation(project)) findings.push({ severity: "error", message: issue.message, pageId: issue.pageId, instanceId: issue.instanceId, fieldId: issue.fieldId });
  const allApplicableMissionsComplete = project.missions.every(mission => mission.status === "Complete");
  return { status: allApplicableMissionsComplete && project.finalReviewConfirmed && !findings.some(finding => finding.severity === "error")
    ? "Complete" : "Incomplete", findings };
}

export function exportBlueprint(project: Project, assets: AssetRecord[] = []): string {
  const readiness = exportReadiness(project);
  const assetManifest = assets.map(asset => ({
    id: asset.id, fileName: asset.fileName, mimeType: asset.mimeType, size: asset.size,
    altText: asset.altText, embedded: false, note: "Binary media is not embedded in standalone JSON.",
  }));
  return JSON.stringify({ schemaVersion: "1.0.0", status: readiness.status, project, assets: assetManifest, findings: readiness.findings }, null, 2);
}

export function serializeProject(project: Project): string {
  return JSON.stringify({ schemaVersion: "1.0.0", exportedAt: "", project }, null, 2);
}
