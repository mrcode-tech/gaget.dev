export type Breakpoint = "desktop" | "tablet" | "mobile";
export type FieldKind = "text" | "textarea" | "url" | "image";
export type FieldDefinition = { id: string; label: string; kind: FieldKind; required?: boolean; defaultValue: string };
export type Sample = {
  id: string; type: string; category: string; name: string; description: string;
  fields: FieldDefinition[]; accent: string; layout: "hero" | "cards" | "split" | "banner" | "footer";
};
export type Instance = { id: string; sampleId: string; content: Record<string,string> };
export type ResponsiveLayout = { order: string[]; hidden: string[] };
export type Page = { id: string; name: string; slug: string; instances: Instance[]; layouts: Record<Breakpoint,ResponsiveLayout> };
export type MissionStatus = "Not started" | "In progress" | "Complete" | "Needs review";
export type Mission = { id: string; title: string; level: number; status: MissionStatus; notNeeded: boolean };
export type Identity = { palette: string; primary: string; background: string; surface: string; text: string; accent: string; font: string };
export type Project = {
  id: string; name: string; businessType: string; purpose: string; audience: string;
  pages: Page[]; activePageId: string; identity: Identity; missions: Mission[]; completedLevels: number[]; finalReviewConfirmed: boolean;
};
export const LEVELS = [
  "Define website","Explore visual direction","Build shared website frame","Design homepage introduction",
  "Build homepage content","Complete homepage","Design responsive behavior","Plan additional pages",
  "Design additional pages","Review website","Complete design and handoff"
] as const;
const field = (id:string,label:string,kind:FieldKind,defaultValue:string,required=false):FieldDefinition => ({id,label,kind,defaultValue,required});
export const CATALOGUE: Sample[] = [
 {id:"hero-editorial",type:"hero",category:"Introduction",name:"Editorial split",description:"Large statement with image-led split composition.",accent:"#b66d4e",layout:"hero",fields:[field("eyebrow","Eyebrow","text","A considered collection"),field("title","Title","text","Objects made to be lived with",true),field("body","Description","textarea","Thoughtful design for everyday rituals."),field("button","Button label","text","Explore collection"),field("image","Image URL","image","")]},
 {id:"hero-bold",type:"hero",category:"Introduction",name:"Bold centered",description:"A confident centered introduction with strong typography.",accent:"#6b7e65",layout:"banner",fields:[field("eyebrow","Eyebrow","text","Independent by nature"),field("title","Title","text","Make room for better ideas",true),field("body","Description","textarea","A small studio with a clear point of view."),field("button","Button label","text","Discover more"),field("image","Image URL","image","")]},
 {id:"hero-minimal",type:"hero",category:"Introduction",name:"Minimal image",description:"Quiet typography paired with a full-bleed visual.",accent:"#8c7b9b",layout:"split",fields:[field("eyebrow","Eyebrow","text","New season"),field("title","Title","text","Less, but considered",true),field("body","Description","textarea","A focused edit of useful, lasting things."),field("button","Button label","text","View the edit"),field("image","Image URL","image","")]},
 {id:"features-grid",type:"features",category:"Content",name:"Three benefits",description:"Three concise value propositions in a balanced grid.",accent:"#6b7e65",layout:"cards",fields:[field("title","Title","text","Made for everyday life",true),field("item1","First benefit","text","Thoughtful materials"),field("item2","Second benefit","text","Designed to last"),field("item3","Third benefit","text","Made with care")]},
 {id:"story-split",type:"story",category:"Content",name:"Story with image",description:"Narrative copy beside a supporting image.",accent:"#b66d4e",layout:"split",fields:[field("title","Title","text","A little about our approach",true),field("body","Story","textarea","We believe the best things earn their place through usefulness, craft and care."),field("image","Image URL","image","")]},
 {id:"collection-cards",type:"collection",category:"Products & services",name:"Collection cards",description:"A visual three-item collection for products or services.",accent:"#9b865c",layout:"cards",fields:[field("title","Title","text","Explore the collection",true),field("item1","Item one","text","The essentials"),field("item2","Item two","text","New arrivals"),field("item3","Item three","text","Best loved")]},
 {id:"testimonial-quote",type:"testimonial",category:"Trust",name:"Featured quote",description:"A single testimonial with clear attribution.",accent:"#8c7b9b",layout:"banner",fields:[field("quote","Quote","textarea","“A thoughtful experience from beginning to end.”",true),field("author","Attribution","text","A happy customer")]},
 {id:"contact-banner",type:"contact",category:"Conversion",name:"Contact callout",description:"A focused invitation to take the next step.",accent:"#6b7e65",layout:"banner",fields:[field("title","Title","text","Have a project in mind?",true),field("body","Description","textarea","Tell us what you are looking for."),field("button","Button label","text","Get in touch")]},
 {id:"footer-simple",type:"footer",category:"Shared elements",name:"Simple footer",description:"A compact closing section with useful links.",accent:"#3e4a43",layout:"footer",fields:[field("brand","Brand","text","Your brand"),field("note","Closing note","text","Thoughtfully made."),field("copyright","Copyright","text","© 2026")]},
];
export const DEFAULT_MISSIONS: Mission[] = LEVELS.map((title,level)=>({id:"level-"+level,title,level,status:"Not started",notNeeded:false}));
export const PALETTES: Identity[] = [
 {palette:"Warm studio",primary:"#9a5b43",background:"#f4efe8",surface:"#fffdf9",text:"#282522",accent:"#c69b68",font:"Georgia"},
 {palette:"Botanical",primary:"#536b55",background:"#eff1e9",surface:"#fbfcf8",text:"#252d27",accent:"#b98d62",font:"Arial"},
 {palette:"Midnight",primary:"#334d68",background:"#edf0f3",surface:"#ffffff",text:"#202a35",accent:"#bd9469",font:"Georgia"},
 {palette:"Modern mono",primary:"#303030",background:"#f1f1ef",surface:"#ffffff",text:"#171717",accent:"#9b9b91",font:"Arial"}
];
export function createProject(input:{name:string;businessType:string;purpose:string;audience:string}):Project {
 const page:Page={id:"page-home",name:"Home",slug:"/",instances:[],layouts:{desktop:{order:[],hidden:[]},tablet:{order:[],hidden:[]},mobile:{order:[],hidden:[]}}};
 return {id:"project-"+Date.now(),...input,pages:[page],activePageId:page.id,identity:PALETTES[0],missions:DEFAULT_MISSIONS.map(m=>({...m})),completedLevels:[],finalReviewConfirmed:false};
}
export function activePage(project:Project):Page { return project.pages.find(p=>p.id===project.activePageId) ?? project.pages[0]; }
export function insertSample(page:Page,sample:Sample,index=page.instances.length):Page {
 const instance:Instance={id:"instance-"+Math.random().toString(36).slice(2,10),sampleId:sample.id,content:Object.fromEntries(sample.fields.map(f=>[f.id,f.defaultValue]))};
 const instances=[...page.instances]; instances.splice(Math.max(0,Math.min(index,instances.length)),0,instance);
 const layouts=Object.fromEntries((["desktop","tablet","mobile"] as Breakpoint[]).map(bp=>{const order=[...page.layouts[bp].order];order.splice(Math.max(0,Math.min(index,order.length)),0,instance.id);return [bp,{...page.layouts[bp],order}];})) as Record<Breakpoint,ResponsiveLayout>;
 return {...page,instances,layouts};
}
export function reorder(page:Page,bp:Breakpoint,id:string,delta:number):Page {
 const order=[...page.layouts[bp].order],from=order.indexOf(id),to=from+delta;
 if(from<0||to<0||to>=order.length)return page;
 [order[from],order[to]]=[order[to],order[from]];
 return {...page,layouts:{...page.layouts,[bp]:{...page.layouts[bp],order}}};
}
export function toggleHidden(page:Page,bp:Breakpoint,id:string):Page {
 if(bp==="desktop")return page;
 const current=page.layouts[bp],hidden=current.hidden.includes(id)?current.hidden.filter(x=>x!==id):[...current.hidden,id];
 return {...page,layouts:{...page.layouts,[bp]:{...current,hidden}}};
}
export function removeInstance(page:Page,id:string):Page {
 return {...page,instances:page.instances.filter(x=>x.id!==id),layouts:Object.fromEntries((["desktop","tablet","mobile"] as Breakpoint[]).map(bp=>[bp,{order:page.layouts[bp].order.filter(x=>x!==id),hidden:page.layouts[bp].hidden.filter(x=>x!==id)}])) as Record<Breakpoint,ResponsiveLayout>};
}
export function duplicateInstance(page:Page,id:string):Page {
 const source=page.instances.find(x=>x.id===id);if(!source)return page;
 const copy={...source,id:"instance-"+Math.random().toString(36).slice(2,10),content:{...source.content}};
 const instances=[...page.instances],at=instances.findIndex(x=>x.id===id);instances.splice(at+1,0,copy);
 const layouts=Object.fromEntries((["desktop","tablet","mobile"] as Breakpoint[]).map(bp=>{const order=[...page.layouts[bp].order],i=order.indexOf(id);order.splice(i+1,0,copy.id);return [bp,{...page.layouts[bp],order}];})) as Record<Breakpoint,ResponsiveLayout>;
 return {...page,instances,layouts};
}
export function reviewProject(project:Project):{severity:"error"|"warning";message:string;pageId:string;instanceId?:string}[] {
 const findings:{severity:"error"|"warning";message:string;pageId:string;instanceId?:string}[]=[];
 for(const page of project.pages) for(const instance of page.instances) {
  const sample=CATALOGUE.find(s=>s.id===instance.sampleId);if(!sample)continue;
  for(const f of sample.fields)if(f.required&&!String(instance.content[f.id]??"").trim())findings.push({severity:"error",message:"Required field missing: "+f.label,pageId:page.id,instanceId:instance.id});
  for(const f of sample.fields)if(f.kind==="image"&&instance.content[f.id]&&!instance.content[f.id].startsWith("http://")&&!instance.content[f.id].startsWith("https://"))findings.push({severity:"warning",message:"Image reference should be an http(s) URL or an attached session file.",pageId:page.id,instanceId:instance.id});
 }
 for(const page of project.pages)for(const bp of ["desktop","tablet","mobile"] as Breakpoint[]) {
  const layout=page.layouts[bp],ids=page.instances.map(i=>i.id);
  if(layout.order.length!==ids.length||new Set(layout.order).size!==ids.length||layout.order.some(id=>!ids.includes(id)))findings.push({severity:"error",message:bp+" layout has invalid component membership.",pageId:page.id});
 }
 return findings;
}
export function serializeProject(project:Project):string {
 return JSON.stringify({schemaVersion:"1.0.0",exportedAt:"",project},null,2);
}
export function markdownHandoff(project:Project):string {
 return ["# "+project.name,"","> Session-only design blueprint. This document describes the composition; it is not a published website.","","## Website definition","- Business: "+project.businessType,"- Purpose: "+project.purpose,"- Audience: "+project.audience,"","## Visual identity","- Direction: "+project.identity.palette,"- Primary: "+project.identity.primary,"- Background: "+project.identity.background,"- Typography: "+project.identity.font,"","## Pages",...project.pages.flatMap(p=>["### "+p.name+" ("+p.slug+")",...p.instances.map(i=>{const s=CATALOGUE.find(x=>x.id===i.sampleId);return "- "+(s?.name??i.sampleId)+": "+(i.content.title??i.content.quote??"");}),""]),"## Responsive behavior","Desktop, tablet and mobile layouts are maintained independently for order and visibility."].join("\n");
}


/**
 * Composition commands shared by the workspace and tests. These are pure
 * transformations so the in-memory Project remains the single source of truth.
 */
export type InsertPosition = { placement: "start" | "end" | "before" | "after"; relativeToId?: string };
export type ReplaceResult = { page: Page; preservedFields: string[]; resetFields: string[] };
export type AssetRecord = {
  id: string; fileName: string; mimeType: string; size: number;
  altText: string; dataUrl: string; pageId?: string; instanceId?: string;
};
export type NavigationReference = { pageId: string; label: string };
export type ExportReadiness = { status: "Complete" | "Incomplete"; findings: ReturnType<typeof reviewProject> };
export type WebsiteIdentityOptions = {
  direction: string; headingFont: string; bodyFont: string; typeScale: "compact" | "balanced" | "expressive";
  imageDirection: string; buttonStyle: "solid" | "outline" | "text"; spacing: "compact" | "comfortable" | "spacious";
  secondary: string; mutedText: string; border: string;
};

export function insertSampleAt(page: Page, sample: Sample, position: InsertPosition): Page {
  let index = page.instances.length;
  if (position.placement === "start") index = 0;
  if (position.placement === "before" || position.placement === "after") {
    const target = page.instances.findIndex(item => item.id === position.relativeToId);
    if (target < 0) return page;
    index = target + (position.placement === "after" ? 1 : 0);
  }
  return insertSample(page, sample, index);
}

export function replaceSample(page: Page, instanceId: string, nextSample: Sample): ReplaceResult {
  const current = page.instances.find(item => item.id === instanceId);
  if (!current) return { page, preservedFields: [], resetFields: [] };
  const nextContent: Record<string, string> = {};
  const preservedFields: string[] = [];
  const resetFields: string[] = [];
  for (const field of nextSample.fields) {
    if (Object.prototype.hasOwnProperty.call(current.content, field.id)) {
      nextContent[field.id] = current.content[field.id];
      preservedFields.push(field.id);
    } else {
      nextContent[field.id] = field.defaultValue;
      resetFields.push(field.id);
    }
  }
  return {
    page: { ...page, instances: page.instances.map(item => item.id === instanceId
      ? { ...item, sampleId: nextSample.id, content: nextContent } : item) },
    preservedFields, resetFields
  };
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
  const id = "page-" + Math.random().toString(36).slice(2, 10);
  const page: Page = { id, name: name.trim(), slug: normalized, instances: [],
    layouts: { desktop: { order: [], hidden: [] }, tablet: { order: [], hidden: [] }, mobile: { order: [], hidden: [] } } };
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
  const ratio = contrastRatio(identity.text, identity.background);
  return [{ role: "Body text on background", ratio, passesAA: ratio !== null && ratio >= 4.5 },
    { role: "Primary text on background", ratio: contrastRatio(identity.primary, identity.background),
      passesAA: (contrastRatio(identity.primary, identity.background) ?? 0) >= 3 }];
}

export function confirmFinalReview(project: Project, confirmed: boolean): Project {\n  return { ...project, finalReviewConfirmed: confirmed };\n}\n\nexport function exportReadiness(project: Project): ExportReadiness {
  const findings = [...reviewProject(project)];
  for (const page of project.pages) {
    if (!page.name.trim() || !page.slug.startsWith("/")) findings.push({ severity: "error", message: "Page name and absolute internal route are required.", pageId: page.id });
  }
  for (const issue of validateInternalNavigation(project)) findings.push({ severity: "error", message: issue.message, pageId: issue.pageId, instanceId: issue.instanceId });
  const allApplicableMissionsComplete = project.missions.every(mission => mission.status === "Complete");\n  return { status: allApplicableMissionsComplete && project.finalReviewConfirmed ? "Complete" : "Incomplete", findings };
}

export function exportBlueprint(project: Project, assets: AssetRecord[] = []): string {
  const readiness = exportReadiness(project);
  const assetManifest = assets.map(asset => ({ id: asset.id, fileName: asset.fileName, mimeType: asset.mimeType,
    size: asset.size, altText: asset.altText, embedded: false, note: "Binary media is not embedded in standalone JSON." }));
  return JSON.stringify({ schemaVersion: "1.0.0", status: readiness.status, project, assets: assetManifest,
    findings: readiness.findings }, null, 2);
}
