import { Component, type ComponentType, type ReactNode } from "react";
import type { Project, Sample } from "@/lib/website-builder/model";

export type SampleRendererProps = {
  sample: Sample;
  content: Record<string, string>;
  identity: Project["identity"];
};

function Placeholder({ label, tone }: { label: string; tone: string }) {
  return <div role="img" aria-label={label} className="grid min-h-24 place-items-center rounded-sm text-xs opacity-70" style={{ background: tone }}>{label}</div>;
}

function EditorialHero({ content, identity }: SampleRendererProps) {
  return <div className="grid min-h-52 grid-cols-2" style={{ background: identity.surface, color: identity.text }}>
    <div className="flex flex-col justify-center p-5"><span className="text-[10px] uppercase tracking-[.2em] opacity-60">{content.eyebrow}</span><h3 className="mt-3 text-2xl font-semibold leading-tight">{content.title}</h3><p className="mt-3 text-sm opacity-70">{content.body}</p><span className="mt-5 w-fit rounded-full px-4 py-2 text-xs text-white" style={{ background: identity.primary }}>{content.button}</span></div>
    <div className="p-3"><Placeholder label="Editorial image placeholder" tone="#d8c7b7" /></div>
  </div>;
}

function BoldHero({ content, identity }: SampleRendererProps) {
  return <div className="grid min-h-52 place-items-center px-7 py-10 text-center text-white" style={{ background: identity.primary }}>
    <div><span className="text-[10px] uppercase tracking-[.28em] text-white/65">{content.eyebrow}</span><h3 className="mx-auto mt-4 max-w-md text-3xl font-bold leading-[1.05]">{content.title}</h3><p className="mx-auto mt-3 max-w-sm text-sm text-white/75">{content.body}</p><span className="mt-5 inline-block border border-white/70 px-5 py-2 text-xs">{content.button}</span></div>
  </div>;
}

function MinimalHero({ content, identity }: SampleRendererProps) {
  return <div className="p-4" style={{ background: identity.surface, color: identity.text }}>
    <Placeholder label="Full-width visual placeholder" tone="#d6d0c7" />
    <div className="mx-auto max-w-md py-6 text-center"><span className="text-[9px] uppercase tracking-[.3em] opacity-50">{content.eyebrow}</span><h3 className="mt-2 text-2xl font-normal tracking-tight">{content.title}</h3><p className="mt-2 text-xs opacity-65">{content.body}</p><span className="mt-4 inline-block border-b pb-1 text-xs" style={{ borderColor: identity.primary }}>{content.button}</span></div>
  </div>;
}

function FeaturesGrid({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.background, color: identity.text }}>
    <h3 className="text-center text-xl font-semibold">{content.title}</h3><div className="mt-6 grid grid-cols-3 gap-4">{[content.item1, content.item2, content.item3].map((item, index) => <div key={index} className="border-t-2 pt-3" style={{ borderColor: identity.accent }}><span className="text-xs font-semibold" style={{ color: identity.primary }}>0{index + 1}</span><p className="mt-2 text-sm font-medium">{item}</p></div>)}</div>
  </div>;
}

function StorySplit({ content, identity }: SampleRendererProps) {
  return <div className="grid min-h-48 grid-cols-2" style={{ background: identity.surface, color: identity.text }}>
    <div className="p-4"><Placeholder label="Story image placeholder" tone="#c7c2b4" /></div><div className="flex flex-col justify-center p-5"><span className="text-[9px] uppercase tracking-[.2em] opacity-50">Our story</span><h3 className="mt-2 text-lg font-semibold">{content.title}</h3><p className="mt-3 text-xs leading-5 opacity-70">{content.body}</p></div>
  </div>;
}

function CollectionCards({ content, identity }: SampleRendererProps) {
  return <div className="px-5 py-7" style={{ background: identity.background, color: identity.text }}>
    <h3 className="text-center text-xl font-semibold">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{[content.item1, content.item2, content.item3].map((item, index) => <div key={index}><Placeholder label={"Collection image " + (index + 1)} tone={["#d6c9b7", "#c5cec0", "#d7d0d4"][index]} /><p className="mt-2 text-xs font-medium">{item}</p></div>)}</div>
  </div>;
}

function TestimonialQuote({ content, identity }: SampleRendererProps) {
  return <div className="px-8 py-10 text-center" style={{ background: identity.surface, color: identity.text }}>
    <span className="font-serif text-5xl leading-none" style={{ color: identity.accent }}>“</span><blockquote className="mx-auto max-w-lg font-serif text-xl leading-relaxed">{content.quote}</blockquote><p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] opacity-60">{content.author}</p>
  </div>;
}

function ContactBanner({ content, identity }: SampleRendererProps) {
  return <div className="flex min-h-36 flex-wrap items-center justify-between gap-5 px-7 py-8 text-white" style={{ background: identity.primary }}>
    <div><h3 className="text-2xl font-semibold">{content.title}</h3><p className="mt-2 max-w-md text-sm text-white/75">{content.body}</p></div><span className="rounded-full bg-white px-5 py-3 text-xs font-semibold" style={{ color: identity.primary }}>{content.button}</span>
  </div>;
}

function SimpleFooter({ content, identity }: SampleRendererProps) {
  return <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-7 text-white" style={{ background: "#202923" }}>
    <div><strong className="text-sm">{content.brand}</strong><p className="mt-1 text-[10px] text-white/60">{content.note}</p></div><div className="text-right"><p className="text-xs text-white/75">About　 Contact　 Instagram</p><p className="mt-2 text-[10px] text-white/50">{content.copyright}</p></div>
    <span className="sr-only">Footer identity color: {identity.primary}</span>
  </footer>;
}

const rendererRegistry: Record<string, ComponentType<SampleRendererProps>> = {
  "hero-editorial": EditorialHero,
  "hero-bold": BoldHero,
  "hero-minimal": MinimalHero,
  "features-grid": FeaturesGrid,
  "story-split": StorySplit,
  "collection-cards": CollectionCards,
  "testimonial-quote": TestimonialQuote,
  "contact-banner": ContactBanner,
  "footer-simple": SimpleFooter,
};

export function getSampleRenderer(sample: Sample): ComponentType<SampleRendererProps> | null {
  return rendererRegistry[sample.id] ?? null;
}

export class SampleRendererErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div role="alert" className="p-6 text-center text-sm text-amber-700">This preview could not be rendered. Choose another design.</div>;
    return this.props.children;
  }
}
export function SampleRendererView(props: SampleRendererProps) {
  const Renderer = getSampleRenderer(props.sample);
  if (!Renderer) return <div role="status" className="p-6 text-center text-sm text-amber-700">This sample preview is currently unavailable.</div>;
  return <SampleRendererErrorBoundary key={props.sample.id}><Renderer {...props} /></SampleRendererErrorBoundary>;
}
