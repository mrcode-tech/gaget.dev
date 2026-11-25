"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "@/design/styles/design.module.css";
import type { DesignStyle } from "@/design/data/styles";

type Props = { children: ReactNode; locale: string; stylesList: DesignStyle[] };

export function DesignShell({ children, locale, stylesList }: Props) {
  const pathname = usePathname();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const href = (path: string) => `${prefix}${path}`;
  const currentPath = pathname.replace(/^\/(fa|ar)(?=\/|$)/, "") || "/";
  const labels = locale === "fa"
    ? { title: "آزمایشگاه طراحی", styles: "سبک‌های طراحی", modules: "آزمایشگاه‌های آینده", back: "بازگشت به GaGet" }
    : locale === "ar"
      ? { title: "مختبر التصميم", styles: "الأساليب", modules: "مختبرات قادمة", back: "العودة إلى GaGet" }
      : { title: "Design Playground", styles: "Design styles", modules: "Coming next", back: "Back to GaGet" };

  return (
    <div className={styles.shell} dir={locale === "fa" || locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.frame}>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href={href("/design")}>
            <span className={styles.brandMark} aria-hidden="true">D</span>
            <span className={styles.brandText}>DESIGN ATLAS<small>{labels.title}</small></span>
          </Link>
          <div className={styles.navLabel}>{labels.styles}</div>
          <nav className={styles.nav} aria-label={labels.styles}>
            {stylesList.map((style) => {
              const active = currentPath === `/design/${style.id}`;
              return (
                <Link key={style.id} href={href(`/design/${style.id}`)} className={active ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}>
                  <span className={styles.navDot} aria-hidden="true" />{style.name}
                </Link>
              );
            })}
          </nav>
          <div className={styles.navLabel}>{labels.modules}</div>
          <nav className={styles.nav} aria-label={labels.modules}>
            <span className={styles.navLink} aria-disabled="true">Typography</span>
            <span className={styles.navLink} aria-disabled="true">Color systems</span>
            <span className={styles.navLink} aria-disabled="true">Layout & grids</span>
          </nav>
          <div className={styles.sidebarFooter}>A visual field guide to the ideas behind digital design.</div>
        </aside>
        <div className={styles.main}>
          <header className={styles.topbar}>
            <span className={styles.breadcrumb}>GaGet.dev <span aria-hidden="true">/</span> Design</span>
            <Link className={styles.backLink} href={href("/")} aria-label={labels.back}>← {labels.back}</Link>
          </header>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
