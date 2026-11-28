import { Component, type ComponentType, type ReactNode } from "react";
import type { Breakpoint, Project, Sample } from "@/lib/website-builder/model";
import styles from "./sample-renderers.module.css";

export type SampleRendererProps = {
  sample: Sample;
  content: Record<string, string>;
  identity: Project["identity"];
  breakpoint?: Breakpoint;
  configuration?: Record<string, string>;
  presentation?: Record<string, string>;
};

function Placeholder({ label, tone = "#d8d2c7" }: { label: string; tone?: string }) {
  return <div role="img" aria-label={label} className="grid min-h-20 place-items-center rounded-sm px-2 text-center text-[10px] opacity-75" style={{ background: tone }}>{label}</div>;
}
function Text({ children }: { children?: string }) { return <span>{children ?? ""}</span>; }

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
function EditorialHeader({ content, identity }: SampleRendererProps) {
  return <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: identity.accent + "55", background: identity.surface, color: identity.text }}>
    <strong className="font-serif text-xl tracking-tight">{content.brand}</strong><nav aria-label="Sample navigation" className="flex flex-wrap gap-4 text-[10px] uppercase tracking-wider opacity-70"><Text>{content.nav1}</Text><Text>{content.nav2}</Text><Text>{content.nav3}</Text></nav><span className="text-xs underline decoration-1 underline-offset-4">{content.action}</span>
  </header>;
}
function MinimalHeader({ content, identity }: SampleRendererProps) {
  return <header className="border-b px-5 py-4 text-center" style={{ borderColor: identity.accent + "55", background: identity.background, color: identity.text }}>
    <strong className="font-serif text-xl">{content.brand}</strong><nav aria-label="Sample navigation" className="mt-3 flex justify-center gap-5 text-[10px] tracking-wide opacity-65"><Text>{content.nav1}</Text><Text>{content.nav2}</Text><Text>{content.nav3}</Text></nav>
  </header>;
}
function CommerceHeader({ content, identity }: SampleRendererProps) {
  return <header style={{ background: identity.text, color: identity.surface }}><div className="flex justify-between border-b border-white/15 px-5 py-2 text-[9px] opacity-70"><span>Complimentary delivery over £60</span><span>United Kingdom · GBP</span></div><div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><strong className="text-xl tracking-tight">{content.brand}</strong><nav aria-label="Sample navigation" className="flex gap-4 text-[10px]"><Text>{content.nav1}</Text><Text>{content.nav2}</Text><Text>{content.nav3}</Text></nav><span className="rounded-full border border-white/40 px-3 py-1 text-[10px]">{content.action}</span></div></header>;
}
function FeatureCards({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.background, color: identity.text }}>
    <h3 className="text-center text-xl font-semibold">{content.title}</h3><div className="mt-6 grid grid-cols-3 gap-4">{[content.item1, content.item2, content.item3].map((item, index) => <div key={index} className="border-t-2 pt-3" style={{ borderColor: identity.accent }}><span className="text-xs font-semibold" style={{ color: identity.primary }}>0{index + 1}</span><p className="mt-2 text-sm font-medium">{item}</p></div>)}</div>
  </div>;
}
function StorySplit({ content, identity }: SampleRendererProps) {
  return <div className="grid min-h-48 grid-cols-2" style={{ background: identity.surface, color: identity.text }}>
    <div className="p-4"><Placeholder label="Story image placeholder" tone="#c7c2b4" /></div><div className="flex flex-col justify-center p-5"><span className="text-[9px] uppercase tracking-[.2em] opacity-50">Our story</span><h3 className="mt-2 text-lg font-semibold">{content.title}</h3><p className="mt-3 text-xs leading-5 opacity-70">{content.body}</p></div>
  </div>;
}
function StoryTimeline({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.surface, color: identity.text }}><h3 className="font-serif text-2xl">{content.title}</h3><ol className="mt-5 grid gap-3 border-l pl-4 text-xs" style={{ borderColor: identity.accent }}>{[content.item1, content.item2, content.item3].map((item, i) => <li key={i} className="relative"><span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full" style={{ background: identity.primary }}/>{item}</li>)}</ol></div>;
}
function ThreeCards({ content, identity, sample }: SampleRendererProps & { sample: Sample }) {
  const items = [content.item1, content.item2, content.item3];
  return <div className="px-5 py-7" style={{ background: identity.background, color: identity.text }}><h3 className="text-center text-xl font-semibold">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{items.map((item, index) => <div key={index} className={sample.rendererKey === "product-grid-compact" ? "rounded-lg bg-white p-2 shadow-sm" : ""}><Placeholder label={(sample.type === "product-grid" ? "Product" : "Category") + " image " + (index + 1)} tone={["#d6c9b7", "#c5cec0", "#d7d0d4"][index]}/><p className="mt-2 text-xs font-medium">{item}</p>{sample.rendererKey === "product-grid-compact" && <p className="mt-1 text-[9px] opacity-60">Explore item</p>}</div>)}</div></div>;
}
function FeaturedProduct({ content, identity }: SampleRendererProps) {
  return <div className="grid grid-cols-2 gap-4 p-5" style={{ background: identity.surface, color: identity.text }}><Placeholder label="Featured product image" tone="#d7cabb"/><div className="flex flex-col justify-center"><span className="text-[9px] uppercase tracking-widest opacity-50">Featured object</span><h3 className="mt-2 font-serif text-2xl">{content.title}</h3><p className="mt-2 text-xs leading-5 opacity-70">{content.body}</p><p className="mt-3 text-sm font-semibold">{content.price}</p><span className="mt-3 w-fit border-b pb-1 text-xs">{content.button}</span></div></div>;
}
function TestimonialQuote({ content, identity }: SampleRendererProps) {
  return <div className="px-8 py-10 text-center" style={{ background: identity.surface, color: identity.text }}><span className="font-serif text-5xl leading-none" style={{ color: identity.accent }}>“</span><blockquote className="mx-auto max-w-lg font-serif text-xl leading-relaxed">{content.quote}</blockquote><p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] opacity-60">{content.author}</p></div>;
}
function ReviewStrip({ content, identity }: SampleRendererProps) {
  return <div className="px-5 py-6" style={{ background: identity.background, color: identity.text }}><h3 className="text-center font-serif text-xl">{content.title}</h3><div className="mt-4 grid grid-cols-3 gap-3">{[content.item1, content.item2, content.item3].map((item, i)=><blockquote key={i} className="border-t pt-3 text-[10px] leading-4" style={{ borderColor: identity.accent }}>★★★★★<p className="mt-2 opacity-75">{item}</p></blockquote>)}</div></div>;
}
function ContactBanner({ content, identity }: SampleRendererProps) {
  return <div className="flex min-h-36 flex-wrap items-center justify-between gap-5 px-7 py-8 text-white" style={{ background: identity.primary }}><div><h3 className="text-2xl font-semibold">{content.title}</h3><p className="mt-2 max-w-md text-sm text-white/75">{content.body}</p></div><span className="rounded-full bg-white px-5 py-3 text-xs font-semibold" style={{ color: identity.primary }}>{content.button}</span></div>;
}
function MinimalCTA({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-10 text-center" style={{ background: identity.surface, color: identity.text }}><h3 className="font-serif text-2xl">{content.title}</h3><p className="mx-auto mt-2 max-w-sm text-xs opacity-70">{content.body}</p><span className="mt-5 inline-block border-b-2 pb-1 text-xs" style={{ borderColor: identity.primary }}>{content.button}</span></div>;
}
function ContactDetails({ content, identity }: SampleRendererProps) {
  return <div className="grid gap-4 p-6 sm:grid-cols-3" style={{ background: identity.background, color: identity.text }}><h3 className="sm:col-span-3 font-serif text-2xl">{content.title}</h3><div><span className="text-[9px] uppercase opacity-50">Email</span><p className="mt-1 text-xs">{content.email}</p></div><div><span className="text-[9px] uppercase opacity-50">Phone</span><p className="mt-1 text-xs">{content.phone}</p></div><div><span className="text-[9px] uppercase opacity-50">Location</span><p className="mt-1 text-xs">{content.location}</p></div></div>;
}
function FAQList({ content, identity }: SampleRendererProps) {
  return <div className="mx-auto max-w-2xl px-6 py-7" style={{ background: identity.surface, color: identity.text }}><h3 className="font-serif text-2xl">{content.title}</h3><div className="mt-4 divide-y" style={{ borderColor: identity.accent }}>{[1,2].map(i=><div key={i} className="py-3"><p className="text-xs font-semibold">{content["item"+i]}</p><p className="mt-2 text-[10px] leading-4 opacity-70">{content["answer"+i]}</p></div>)}</div></div>;
}
function Newsletter({ content, identity }: SampleRendererProps) {
  return <div className="grid gap-4 px-6 py-7 md:grid-cols-2 md:items-center" style={{ background: identity.primary, color: identity.surface }}><div><h3 className="font-serif text-2xl">{content.title}</h3><p className="mt-2 text-xs opacity-75">{content.body}</p></div><div className="flex gap-2"><span className="flex-1 border border-white/50 px-3 py-2 text-[10px] opacity-70">Email address</span><span className="bg-white px-4 py-2 text-[10px] font-semibold" style={{ color: identity.primary }}>{content.button}</span></div></div>;
}
function TrustStrip({ content, identity }: SampleRendererProps) {
  return <div className="flex flex-wrap justify-around gap-3 px-5 py-5 text-center" style={{ background: identity.background, color: identity.text }}>{[content.item1,content.item2,content.item3].map((item,i)=><span key={i} className="text-[10px] font-medium">✓　{item}</span>)}</div>;
}
function StatsBand({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.text, color: identity.surface }}><h3 className="text-center font-serif text-xl">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{[content.item1,content.item2,content.item3].map((item,i)=><p key={i} className="border-t border-white/25 pt-3 text-center text-xs">{item}</p>)}</div></div>;
}
function ProcessSteps({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.surface, color: identity.text }}><h3 className="text-xl font-semibold">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{[content.item1,content.item2,content.item3].map((item,i)=><div key={i}><span className="font-serif text-3xl opacity-35">0{i+1}</span><p className="mt-2 text-xs">{item}</p></div>)}</div></div>;
}
function ArticleFeature({ content, identity }: SampleRendererProps) {
  return <div className="grid grid-cols-2 gap-4 p-5" style={{ background: identity.surface, color: identity.text }}><Placeholder label="Featured article image" tone="#d7cfc2"/><div className="flex flex-col justify-center"><span className="text-[9px] uppercase tracking-widest opacity-50">{content.eyebrow}</span><h3 className="mt-2 font-serif text-xl">{content.title}</h3><p className="mt-2 text-[10px] leading-4 opacity-70">{content.body}</p><p className="mt-3 text-[9px] opacity-50">{content.author}</p></div></div>;
}
function FooterSimple({ content }: SampleRendererProps) {
  return <footer className="flex flex-wrap items-center justify-between gap-4 bg-[#202923] px-6 py-7 text-white"><div><strong className="text-sm">{content.brand}</strong><p className="mt-1 text-[10px] text-white/60">{content.note}</p></div><div className="text-right"><p className="text-xs text-white/75">About　 Contact　 Help</p><p className="mt-2 text-[10px] text-white/50">{content.copyright}</p></div></footer>;
}
function FooterColumns({ content, identity }: SampleRendererProps) {
  return <footer className="grid gap-5 px-6 py-8 text-white sm:grid-cols-2" style={{ background: identity.text }}><div><strong className="font-serif text-xl">{content.brand}</strong><p className="mt-2 max-w-xs text-xs opacity-60">{content.note}</p></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-xs opacity-75">{content.nav1}　{content.nav2}　{content.nav3}</nav></footer>;
}

const rendererRegistry: Record<string, ComponentType<SampleRendererProps>> = {
  "hero-editorial": EditorialHero,
  "hero-bold": BoldHero,
  "hero-minimal": MinimalHero,
  "header-editorial": EditorialHeader,
  "header-minimal": MinimalHeader,
  "header-commerce": CommerceHeader,
  "category-tiles": ThreeCards,
  "product-grid-editorial": ThreeCards,
  "product-grid-compact": ThreeCards,
  "featured-product": FeaturedProduct,
  "features-grid": FeatureCards,
  "story-split": StorySplit,
  "story-timeline": StoryTimeline,
  "collection-cards": ThreeCards,
  "service-cards": ThreeCards,
  "portfolio-grid": ThreeCards,
  "team-grid": ThreeCards,
  "testimonial-quote": TestimonialQuote,
  "review-strip": ReviewStrip,
  "faq-list": FAQList,
  "contact-banner": ContactBanner,
  "cta-minimal": MinimalCTA,
  "contact-details": ContactDetails,
  "newsletter-panel": Newsletter,
  "trust-strip": TrustStrip,
  "stats-band": StatsBand,
  "process-steps": ProcessSteps,
  "article-feature": ArticleFeature,
  "footer-simple": FooterSimple,
  "footer-columns": FooterColumns,
};

export function getSampleRenderer(sample: Sample): ComponentType<SampleRendererProps> | null {
  return rendererRegistry[sample.rendererKey] ?? null;
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
  if (!Renderer) {
    return <div role="status" className="p-6 text-center text-sm text-amber-700">This sample preview is currently unavailable.</div>;
  }
  const content = Renderer === ThreeCards
    ? <ThreeCards {...props} sample={props.sample}/>
    : <Renderer {...props}/>;
  return (
    <div className={styles.preview} data-breakpoint={props.breakpoint ?? "desktop"}>
      <SampleRendererErrorBoundary key={props.sample.id}>{content}</SampleRendererErrorBoundary>
    </div>
  );
}
