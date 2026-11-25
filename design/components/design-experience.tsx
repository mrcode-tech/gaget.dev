import styles from "@/design/styles/design.module.css";
import { samplePortfolio } from "@/design/data/sample-portfolio";
import type { DesignStyle } from "@/design/data/styles";

type LinkForLocale = (path: string) => string;

export function DesignLanding({ stylesList, href }: { stylesList: DesignStyle[]; href: LinkForLocale }) {
  return (
    <>
      <p className={styles.kicker}>Learn by seeing the system</p>
      <h1 className={styles.title}>Explore the ideas that shape what you see.</h1>
      <p className={styles.lede}>A hands-on field guide to visual design. Explore influential styles through one shared portfolio, then unpack the history, principles, typography, color, and layout decisions behind each experience.</p>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Visual design movements</h2>
        <span className={styles.sectionNote}>One portfolio · Different visual systems</span>
      </div>
      <div className={styles.styleGrid}>
        {stylesList.map((style) => (
          <Link key={style.id} href={href(`/design/${style.id}`)} className={styles.styleCard}>
            <div className={styles.cardVisual} data-style={style.id}><span className={styles.cardVisualLabel}>{style.name}</span></div>
            <div className={styles.cardMeta}>
              <div><h3 className={styles.cardTitle}>{style.name}</h3><p className={styles.cardSubtitle}>{style.subtitle}</p></div>
              <span className={styles.cardPeriod}>{style.period}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>How to use this playground</h2>
      </div>
      <div className={styles.learningGrid}>
        <article className={styles.learningCard}><h3>01 / Compare</h3><p>Every style uses the same fictional portfolio, so you can focus on changes in hierarchy, color, typography, and composition.</p></article>
        <article className={styles.learningCard}><h3>02 / Understand</h3><p>Read the context and principles behind a movement, then connect those ideas to visible design decisions.</p></article>
      </div>
    </>
  );
}

export function PortfolioPreview({ styleId }: { styleId: string }) {
  return (
    <section className={styles.preview} data-style={styleId} dir="ltr" aria-label={`Sample portfolio rendered in ${styleId} style`}>
      <div className={styles.previewNav}>
        <span className={styles.previewBrand}>{samplePortfolio.name}</span>
        <nav className={styles.previewLinks} aria-label="Sample portfolio"><a href="#projects">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <span>{samplePortfolio.location}</span>
      </div>
      <div className={styles.previewHero}>
        <div>
          <p className={styles.previewEyebrow}>{samplePortfolio.role}</p>
          <h2 className={styles.previewHeading}>Designing with clarity and curiosity.</h2>
          <p className={styles.previewCopy}>{samplePortfolio.introduction}</p>
          <a className={styles.previewAction} href={`mailto:${samplePortfolio.contact}`}>Start a conversation ↗</a>
        </div>
        <div className={styles.previewArtwork} aria-label="Abstract geometric portfolio artwork" role="img" />
      </div>
      <div className={styles.previewProjects} id="projects">
        <div className={styles.previewProjectHead}><span>Selected projects</span><span>2024 — 2025</span></div>
        <div className={styles.projectGrid}>
          {samplePortfolio.projects.map((project) => (
            <article className={styles.projectCard} key={project.id}>
              <div className={styles.projectImage}><span>{project.number}</span></div>
              <h3 className={styles.projectName}>{project.title}</h3>
              <p className={styles.projectCategory}>{project.category} · {project.year}</p>
            </article>
          ))}
        </div>
      </div>
      <section className={styles.previewAbout} id="about"><h3>A little about the practice</h3><p>{samplePortfolio.biography}</p></section>
      <div className={styles.previewFooter} id="contact"><span>{samplePortfolio.availability}</span><a href={`mailto:${samplePortfolio.contact}`}>{samplePortfolio.contact}</a></div>
    </section>
  );
}

export function DesignStylePage({ style }: { style: DesignStyle }) {
  return (
    <>
      <div className={styles.detailHeader}>
        <div><p className={styles.kicker}>Design movement / visual system</p><h1 className={styles.title}>{style.name}</h1><p className={styles.lede}>{style.description}</p></div>
        <span className={styles.period}>{style.period}</span>
      </div>
      <PortfolioPreview styleId={style.id} />
      <div className={styles.sectionHead}><h2 className={styles.sectionTitle}>Understand the system</h2><span className={styles.sectionNote}>History · principles · practice</span></div>
      <div className={styles.learningGrid}>
        <article className={styles.learningCard}><h3>Historical context</h3><p>{style.history}</p></article>
        <article className={styles.learningCard}><h3>Core principles</h3><ul>{style.principles.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className={styles.learningCard}>
          <h3>Color palette</h3>
          <div className={styles.swatches}>{style.palette.map((color) => <div className={styles.swatch} key={color.name}><span className={styles.swatchColor} style={{ backgroundColor: color.value }} /><strong>{color.name}</strong><small>{color.value} · {color.role}</small></div>)}</div>
        </article>
        <article className={styles.learningCard}><h3>Typography</h3>{style.typography.map((item) => <p key={item.role}><strong>{item.role}:</strong> {item.recommendation}</p>)}</article>
        <article className={styles.learningCard}><h3>Layout & composition</h3><p>{style.layout}</p></article>
        <article className={styles.learningCard}><h3>Iconography</h3><p>{style.iconography}</p></article>
        <article className={styles.learningCard}><h3>Components & interaction</h3><p>{style.components}</p></article>
        <article className={styles.learningCard}><h3>Implementation notes</h3><p>{style.implementation}</p><div className={styles.codeNote}>/* Keep the visual system scoped */\n.design-example &#123;\n  color: var(--style-ink);\n  background: var(--style-paper);\n&#125;</div></article>
      </div>
    </>
  );
}
