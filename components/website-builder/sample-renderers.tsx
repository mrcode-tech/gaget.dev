import { Component, type ComponentType, type ReactNode } from "react";
import { CATALOGUE, type Breakpoint, type Project, type Sample } from "@/lib/website-builder/model";
import styles from "./sample-renderers.module.css";

export type SampleRendererProps = {
  sample: Sample;
  content: Record<string, string>;
  identity: Project["identity"];
  breakpoint?: Breakpoint;
  configuration?: Record<string, string>;
  presentation?: Record<string, string>;
  placeholders?: Record<string, { purpose: string; assetId?: string }>;
};

function Placeholder({ label, tone = "#d8d2c7", src }: { label: string; tone?: string; src?: string }) {
  const safeSource = src && /^(https?:\/\/|data:image\/)/i.test(src) ? src : undefined;
  return <div role="img" aria-label={label} className="relative grid min-h-20 place-items-center overflow-hidden rounded-sm px-2 text-center text-[10px]" style={{ background: tone }}>
    {safeSource ? <img src={safeSource} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : label}
  </div>;
}
function Text({ children }: { children?: string }) { return <span>{children ?? ""}</span>; }

function EditorialHero({ content, identity, placeholders }: SampleRendererProps) {
  return <div className="grid min-h-52 grid-cols-2" style={{ background: identity.surface, color: identity.text }}>
    <div className="flex flex-col justify-center p-5"><span className="text-[10px] uppercase tracking-[.2em]">{content.eyebrow}</span><h3 className="mt-3 text-2xl font-semibold leading-tight">{content.title}</h3><p className="mt-3 text-sm">{content.body}</p><span className="mt-5 w-fit rounded-full px-4 py-2 text-xs text-white" style={{ background: identity.primary }}>{content.button}</span></div>
    <div className="p-3"><Placeholder label={placeholders?.image?.purpose ?? "Editorial image placeholder"} tone="#d8c7b7" src={content.image} /></div>
  </div>;
}
function BoldHero({ content, identity }: SampleRendererProps) {
  return <div className="grid min-h-52 place-items-center px-7 py-10 text-center text-white" style={{ background: identity.primary }}>
    <div><span className="text-[10px] uppercase tracking-[.28em] text-white">{content.eyebrow}</span><h3 className="mx-auto mt-4 max-w-md text-3xl font-bold leading-[1.05]">{content.title}</h3><p className="mx-auto mt-3 max-w-sm text-sm text-white">{content.body}</p><span className="mt-5 inline-block border border-white/70 px-5 py-2 text-xs">{content.button}</span></div>
  </div>;
}
function MinimalHero({ content, identity }: SampleRendererProps) {
  return <div className="p-4" style={{ background: identity.surface, color: identity.text }}>
    <Placeholder label="Full-width visual placeholder" tone="#d6d0c7" />
    <div className="mx-auto max-w-md py-6 text-center"><span className="text-[9px] uppercase tracking-[.3em]">{content.eyebrow}</span><h3 className="mt-2 text-2xl font-normal tracking-tight">{content.title}</h3><p className="mt-2 text-xs">{content.body}</p><span className="mt-4 inline-block border-b pb-1 text-xs" style={{ borderColor: identity.primary }}>{content.button}</span></div>
  </div>;
}
function EditorialHeader({ content, identity }: SampleRendererProps) {
  return <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: identity.accent + "55", background: identity.surface, color: identity.text }}>
    <strong className="font-serif text-xl tracking-tight">{content.brand}</strong><nav aria-label="Sample navigation" className="flex flex-wrap gap-4 text-[10px] uppercase tracking-wider"><Text>{content.nav1}</Text><Text>{content.nav2}</Text><Text>{content.nav3}</Text></nav><span className="text-xs underline decoration-1 underline-offset-4">{content.action}</span>
  </header>;
}
function MinimalHeader({ content, identity }: SampleRendererProps) {
  return <header className="border-b px-5 py-4 text-center" style={{ borderColor: identity.accent + "55", background: identity.background, color: identity.text }}>
    <strong className="font-serif text-xl">{content.brand}</strong><nav aria-label="Sample navigation" className="mt-3 flex justify-center gap-5 text-[10px] tracking-wide"><Text>{content.nav1}</Text><Text>{content.nav2}</Text><Text>{content.nav3}</Text></nav>
  </header>;
}
function CommerceHeader({ content, identity }: SampleRendererProps) {
  return <header style={{ background: identity.text, color: identity.surface }}><div className="flex justify-between border-b border-white/15 px-5 py-2 text-[9px]"><span>Complimentary delivery over £60</span><span>United Kingdom · GBP</span></div><div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><strong className="text-xl tracking-tight">{content.brand}</strong><nav aria-label="Sample navigation" className="flex gap-4 text-[10px]"><Text>{content.nav1}</Text><Text>{content.nav2}</Text><Text>{content.nav3}</Text></nav><span className="rounded-full border border-white/40 px-3 py-1 text-[10px]">{content.action}</span></div></header>;
}
function FeatureCards({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.background, color: identity.text }}>
    <h3 className="text-center text-xl font-semibold">{content.title}</h3><div className="mt-6 grid grid-cols-3 gap-4">{[content.item1, content.item2, content.item3].map((item, index) => <div key={index} className="border-t-2 pt-3" style={{ borderColor: identity.accent }}><span className="text-xs font-semibold" style={{ color: identity.primary }}>0{index + 1}</span><p className="mt-2 text-sm font-medium">{item}</p></div>)}</div>
  </div>;
}
function StorySplit({ content, identity, placeholders }: SampleRendererProps) {
  return <div className="grid min-h-48 grid-cols-2" style={{ background: identity.surface, color: identity.text }}>
    <div className="p-4"><Placeholder label={placeholders?.image?.purpose ?? "Story image placeholder"} tone="#c7c2b4" src={content.image} /></div><div className="flex flex-col justify-center p-5"><span className="text-[9px] uppercase tracking-[.2em]">Our story</span><h3 className="mt-2 text-lg font-semibold">{content.title}</h3><p className="mt-3 text-xs leading-5">{content.body}</p></div>
  </div>;
}
function StoryTimeline({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.surface, color: identity.text }}><h3 className="font-serif text-2xl">{content.title}</h3><ol className="mt-5 grid gap-3 border-l pl-4 text-xs" style={{ borderColor: identity.accent }}>{[content.item1, content.item2, content.item3].map((item, i) => <li key={i} className="relative"><span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full" style={{ background: identity.primary }}/>{item}</li>)}</ol></div>;
}
function ThreeCards({ content, identity, sample }: SampleRendererProps & { sample: Sample }) {
  const items = [content.item1, content.item2, content.item3];
  return <div className="px-5 py-7" style={{ background: identity.background, color: identity.text }}><h3 className="text-center text-xl font-semibold">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{items.map((item, index) => <div key={index} className={sample.rendererKey === "product-grid-compact" ? "rounded-lg bg-white p-2 shadow-sm" : ""}><Placeholder label={(sample.type === "product-grid" ? "Product" : "Category") + " image " + (index + 1)} tone={["#d6c9b7", "#c5cec0", "#d7d0d4"][index]}/><p className="mt-2 text-xs font-medium">{item}</p>{sample.rendererKey === "product-grid-compact" && <p className="mt-1 text-[9px]">Explore item</p>}</div>)}</div></div>;
}
function CategoryTiles({ content, identity }: SampleRendererProps) {
  return <div className="px-5 py-7" style={{ background: identity.surface, color: identity.text }}>
    <h3 className="font-serif text-2xl">{content.title}</h3>
    <div className="mt-5 grid grid-cols-3 gap-3">{[content.item1, content.item2, content.item3].map((item, index) =>
      <div key={index} className="relative min-h-32 overflow-hidden rounded-lg p-3 text-white" style={{ background: ["#526452", "#75533d", "#4e5c72"][index] }}>
        <span className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(145deg, transparent, #111)" }}/>
        <span className="relative mt-auto block pt-20 text-xs font-semibold">{item}</span>
      </div>)}</div>
  </div>;
}
function ProductGridEditorial({ content, identity, configuration, presentation }: SampleRendererProps) {
  const columns = presentation?.columns ?? configuration?.columns ?? "3";
  const gridColumns = columns === "1" ? "grid-cols-1" : columns === "2" ? "grid-cols-2" : "grid-cols-3";
  return <div className="px-6 py-8" style={{ background: identity.background, color: identity.text }}>
    <div className="flex items-end justify-between"><h3 className="max-w-xs font-serif text-2xl">{content.title}</h3><span className="text-[9px] uppercase tracking-widest">The collection</span></div>
    <div className={"mt-6 grid gap-5 " + gridColumns}>{[content.item1, content.item2, content.item3].map((item, index) =>
      <div key={index}><Placeholder label={"Product photograph " + (index + 1)} tone={["#d5c7b8", "#c8d0c5", "#d4cfd0"][index]}/><p className="mt-3 font-serif text-sm">{item}</p><p className="mt-1 text-[9px] uppercase tracking-wider">Explore details</p></div>)}</div>
  </div>;
}
function ProductGridCompact({ content, identity, configuration, presentation }: SampleRendererProps) {
  const columns = presentation?.columns ?? configuration?.columns ?? "3";
  const gridColumns = columns === "1" ? "grid-cols-1" : columns === "2" ? "grid-cols-2" : columns === "4" ? "grid-cols-4" : "grid-cols-3";
  return <div className="p-5" style={{ background: identity.surface, color: identity.text }}>
    <h3 className="text-lg font-semibold">{content.title}</h3>
    <div className={"mt-4 grid gap-2 " + gridColumns}>{[content.item1, content.item2, content.item3].map((item, index) =>
      <div key={index} className="rounded-lg border p-2" style={{ borderColor: identity.accent + "66" }}><Placeholder label={"Product " + (index + 1)} tone="#e6e2d9"/><p className="mt-2 text-[10px] font-medium">{item}</p><p className="mt-1 text-[9px]">Details and availability</p></div>)}</div>
  </div>;
}
function ServiceCards({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.background, color: identity.text }}><h3 className="text-xl font-semibold">{content.title}</h3>
    <div className="mt-5 grid grid-cols-3 gap-3">{[content.item1, content.item2, content.item3].map((item, index)=><article key={index} className="border-t-2 bg-white/60 p-3" style={{ borderColor: identity.primary }}><span className="text-[9px] uppercase tracking-widest">Service 0{index+1}</span><h4 className="mt-3 text-xs font-semibold">{item}</h4><p className="mt-2 text-[9px] leading-4">A focused approach shaped around your needs.</p></article>)}</div>
  </div>;
}
function PortfolioGrid({ content, identity }: SampleRendererProps) {
  return <div className="p-5" style={{ background: identity.surface, color: identity.text }}><div className="flex items-end justify-between"><h3 className="font-serif text-2xl">{content.title}</h3><span className="text-[9px] uppercase tracking-widest">Selected projects</span></div>
    <div className="mt-4 grid grid-cols-3 gap-2">{[content.item1, content.item2, content.item3].map((item,index)=><div key={index}><Placeholder label={"Portfolio work " +(index+1)} tone={["#c7c5b7","#d4c7bc","#c5cfc9"][index]}/><p className="mt-2 text-[10px]">{item}</p></div>)}</div>
  </div>;
}
function TeamGrid({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.background, color: identity.text }}><h3 className="text-center font-serif text-2xl">{content.title}</h3>
    <div className="mt-5 grid grid-cols-3 gap-3">{[content.item1,content.item2,content.item3].map((item,index)=><div key={index} className="text-center"><div className="mx-auto h-16 w-16 rounded-full" style={{ background: ["#c9b9aa","#bdc9bd","#c4c3cf"][index] }}/><p className="mt-3 text-[10px] font-medium">{item}</p></div>)}</div>
  </div>;
}
function FeaturedProduct({ content, identity, placeholders }: SampleRendererProps) {
  return <div className="grid grid-cols-2 gap-4 p-5" style={{ background: identity.surface, color: identity.text }}><Placeholder label={placeholders?.image?.purpose ?? "Featured product image"} tone="#d7cabb" src={content.image}/><div className="flex flex-col justify-center"><span className="text-[9px] uppercase tracking-widest">Featured object</span><h3 className="mt-2 font-serif text-2xl">{content.title}</h3><p className="mt-2 text-xs leading-5">{content.body}</p><p className="mt-3 text-sm font-semibold">{content.price}</p><span className="mt-3 w-fit border-b pb-1 text-xs">{content.button}</span></div></div>;
}
function TestimonialQuote({ content, identity }: SampleRendererProps) {
  return <div className="px-8 py-10 text-center" style={{ background: identity.surface, color: identity.text }}><span aria-hidden="true" className="font-serif text-5xl leading-none" style={{ color: identity.accent }}>“</span><blockquote className="mx-auto max-w-lg font-serif text-xl leading-relaxed">{content.quote}</blockquote><p className="mt-5 text-xs font-semibold uppercase tracking-[.16em]">{content.author}</p></div>;
}
function ReviewStrip({ content, identity }: SampleRendererProps) {
  return <div className="px-5 py-6" style={{ background: identity.background, color: identity.text }}><h3 className="text-center font-serif text-xl">{content.title}</h3><div className="mt-4 grid grid-cols-3 gap-3">{[content.item1, content.item2, content.item3].map((item, i)=><blockquote key={i} className="border-t pt-3 text-[10px] leading-4" style={{ borderColor: identity.accent }}>★★★★★<p className="mt-2">{item}</p></blockquote>)}</div></div>;
}
function ContactBanner({ content, identity }: SampleRendererProps) {
  return <div className="flex min-h-36 flex-wrap items-center justify-between gap-5 px-7 py-8 text-white" style={{ background: identity.primary }}><div><h3 className="text-2xl font-semibold">{content.title}</h3><p className="mt-2 max-w-md text-sm text-white">{content.body}</p></div><span className="rounded-full bg-white px-5 py-3 text-xs font-semibold" style={{ color: identity.primary }}>{content.button}</span></div>;
}
function MinimalCTA({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-10 text-center" style={{ background: identity.surface, color: identity.text }}><h3 className="font-serif text-2xl">{content.title}</h3><p className="mx-auto mt-2 max-w-sm text-xs">{content.body}</p><span className="mt-5 inline-block border-b-2 pb-1 text-xs" style={{ borderColor: identity.primary }}>{content.button}</span></div>;
}
function ContactDetails({ content, identity }: SampleRendererProps) {
  return <div className="grid gap-4 p-6 sm:grid-cols-3" style={{ background: identity.background, color: identity.text }}><h3 className="sm:col-span-3 font-serif text-2xl">{content.title}</h3><div><span className="text-[9px] uppercase">Email</span><p className="mt-1 text-xs">{content.email}</p></div><div><span className="text-[9px] uppercase">Phone</span><p className="mt-1 text-xs">{content.phone}</p></div><div><span className="text-[9px] uppercase">Location</span><p className="mt-1 text-xs">{content.location}</p></div></div>;
}
function FAQList({ content, identity }: SampleRendererProps) {
  return <div className="mx-auto max-w-2xl px-6 py-7" style={{ background: identity.surface, color: identity.text }}><h3 className="font-serif text-2xl">{content.title}</h3><div className="mt-4 divide-y" style={{ borderColor: identity.accent }}>{[1,2].map(i=><div key={i} className="py-3"><p className="text-xs font-semibold">{content["item"+i]}</p><p className="mt-2 text-[10px] leading-4">{content["answer"+i]}</p></div>)}</div></div>;
}
function Newsletter({ content, identity }: SampleRendererProps) {
  return <div className="grid gap-4 px-6 py-7 md:grid-cols-2 md:items-center" style={{ background: identity.primary, color: identity.surface }}><div><h3 className="font-serif text-2xl">{content.title}</h3><p className="mt-2 text-xs">{content.body}</p></div><div className="flex gap-2"><span className="flex-1 border border-white px-3 py-2 text-[10px]">Email address</span><span className="bg-white px-4 py-2 text-[10px] font-semibold" style={{ color: identity.primary }}>{content.button}</span></div></div>;
}
function TrustStrip({ content, identity }: SampleRendererProps) {
  return <div className="flex flex-wrap justify-around gap-3 px-5 py-5 text-center" style={{ background: identity.background, color: identity.text }}>{[content.item1,content.item2,content.item3].map((item,i)=><span key={i} className="text-[10px] font-medium">✓　{item}</span>)}</div>;
}
function StatsBand({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.text, color: identity.surface }}><h3 className="text-center font-serif text-xl">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{[content.item1,content.item2,content.item3].map((item,i)=><p key={i} className="border-t border-white/25 pt-3 text-center text-xs">{item}</p>)}</div></div>;
}
function ProcessSteps({ content, identity }: SampleRendererProps) {
  return <div className="px-6 py-7" style={{ background: identity.surface, color: identity.text }}><h3 className="text-xl font-semibold">{content.title}</h3><div className="mt-5 grid grid-cols-3 gap-3">{[content.item1,content.item2,content.item3].map((item,i)=><div key={i}><span className="font-serif text-3xl">0{i+1}</span><p className="mt-2 text-xs">{item}</p></div>)}</div></div>;
}
function ArticleFeature({ content, identity, placeholders }: SampleRendererProps) {
  return <div className="grid grid-cols-2 gap-4 p-5" style={{ background: identity.surface, color: identity.text }}><Placeholder label={placeholders?.image?.purpose ?? "Featured article image"} tone="#d7cfc2" src={content.image}/><div className="flex flex-col justify-center"><span className="text-[9px] uppercase tracking-widest">{content.eyebrow}</span><h3 className="mt-2 font-serif text-xl">{content.title}</h3><p className="mt-2 text-[10px] leading-4">{content.body}</p><p className="mt-3 text-[9px]">{content.author}</p></div></div>;
}
function FooterSimple({ content }: SampleRendererProps) {
  return <footer className="flex flex-wrap items-center justify-between gap-4 bg-[#202923] px-6 py-7 text-white"><div><strong className="text-sm">{content.brand}</strong><p className="mt-1 text-[10px] text-white">{content.note}</p></div><div className="text-right"><p className="text-xs text-white">About　 Contact　 Help</p><p className="mt-2 text-[10px] text-white">{content.copyright}</p></div></footer>;
}
function FooterColumns({ content, identity }: SampleRendererProps) {
  return <footer className="grid gap-5 px-6 py-8 text-white sm:grid-cols-2" style={{ background: identity.text }}><div><strong className="font-serif text-xl">{content.brand}</strong><p className="mt-2 max-w-xs text-xs">{content.note}</p></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-xs">{content.nav1}　{content.nav2}　{content.nav3}</nav></footer>;
}

const rendererRegistry: Record<string, ComponentType<SampleRendererProps>> = {
  "hero-editorial": EditorialHero,
  "hero-bold": BoldHero,
  "hero-minimal": MinimalHero,
  "header-editorial": EditorialHeader,
  "header-minimal": MinimalHeader,
  "header-commerce": CommerceHeader,
  "category-tiles": CategoryTiles,
  "product-grid-editorial": ProductGridEditorial,
  "product-grid-compact": ProductGridCompact,
  "featured-product": FeaturedProduct,
  "features-grid": FeatureCards,
  "story-split": StorySplit,
  "story-timeline": StoryTimeline,
  "collection-cards": ThreeCards,
  "service-cards": ServiceCards,
  "portfolio-grid": PortfolioGrid,
  "team-grid": TeamGrid,
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
  const registered = CATALOGUE.find(item => item.id === sample.id && item.version === sample.version && item.rendererKey === sample.rendererKey);
  return registered ? rendererRegistry[registered.rendererKey] ?? null : null;
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
    <div className={styles.preview} data-breakpoint={props.breakpoint ?? "desktop"} data-responsive-columns={props.presentation?.columns}>
      <SampleRendererErrorBoundary key={props.sample.id}>{content}</SampleRendererErrorBoundary>
    </div>
  );
}
