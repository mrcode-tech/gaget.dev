"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Home, Sparkles, X, Wrench, PanelLeftClose, PanelLeftOpen, Image as ImageIcon, Music, Film, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

type AppSidebarProps = { collapsed: boolean; onToggle: () => void };
const workspaces = [
  { label: "Images", href: "/images/editor", icon: ImageIcon },
  { label: "Audio", href: "/audio/editor", icon: Music },
  { label: "Video", href: "/video/editor", icon: Film },
  { label: "Date & Time", href: "/datetime/editor", icon: Clock3 },
] as const;

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const openNavigation = () => setMobileOpen(true);
    window.addEventListener("gaget:open-navigation", openNavigation);
    return () => window.removeEventListener("gaget:open-navigation", openNavigation);
  }, []);
  const direction = localeDirections[locale];
  const cleanPath = pathname.replace(/^\/(fa|ar)(?=\/|$)/, "") || "/";
  const isActive = (href: string) => cleanPath === href || (href !== "/" && cleanPath.startsWith(href + "/"));
  const devToolsActive = ["/tools", "/categories", "/json", "/encoding", "/security", "/generators", "/text", "/xml", "/sql", "/data", "/web", "/api"].some(isActive);
  const devToolsLabel = locale === "fa" ? "ابزارهای توسعه" : locale === "ar" ? "أدوات المطورين" : "Dev Tools";
  const workspaceHeading = locale === "fa" ? "فضاهای کاری" : locale === "ar" ? "مساحات العمل" : "Workspaces";

  const renderSidebar = (isCollapsed: boolean, mobile = false) => (
    <div className={cn("flex h-full flex-col border-border bg-card", isCollapsed ? "w-16" : "w-[248px]", direction === "ltr" ? "border-r" : "border-l", !mobile && "transition-[width] duration-200 ease-in-out")}>
      <div className={cn("flex h-[68px] shrink-0 items-center border-b border-border", isCollapsed ? "justify-center px-2" : "gap-3 px-5")}>
        <LocaleLink href="/" aria-label="GaGet.dev home" title={isCollapsed ? "GaGet.dev home" : undefined} className={cn("flex min-w-0 items-center gap-3", isCollapsed && "justify-center")} onClick={mobile ? () => setMobileOpen(false) : undefined}>
          <Image src="/gaget-mark.svg" alt="" aria-hidden="true" width={32} height={32} priority className="h-8 w-8 shrink-0 rounded-xl" />
          {!isCollapsed && <span className="whitespace-nowrap text-base font-bold tracking-tight">GaGet<span className="text-primary">.dev</span></span>}
        </LocaleLink>
        {mobile ? <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 shrink-0" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X className="h-4 w-4" /></Button> :
          <Button variant="ghost" size="icon" className={cn("h-8 w-8 shrink-0", !isCollapsed && "ml-auto")} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggle}>
            {isCollapsed ? (direction === "ltr" ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />) : (direction === "ltr" ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />)}
          </Button>}
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Main navigation" className={cn("space-y-6 py-5", isCollapsed ? "px-2" : "px-3")}>
          <div className="space-y-1">
            <NavLink href="/" label={t("nav.home")} active={isActive("/")} icon={<Home className="h-4 w-4" />} collapsed={isCollapsed} onClick={mobile ? () => setMobileOpen(false) : undefined} />
            <NavLink href="/#popular-tools" label={t("nav.popular")} active={false} icon={<Sparkles className="h-4 w-4" />} collapsed={isCollapsed} onClick={mobile ? () => setMobileOpen(false) : undefined} />
            <NavLink href="/#favorites" label={t("nav.favorites")} active={false} icon={<Heart className="h-4 w-4" />} collapsed={isCollapsed} onClick={mobile ? () => setMobileOpen(false) : undefined} />
          </div>
          <div>
            {!isCollapsed && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{workspaceHeading}</p>}
            <div className="space-y-1">{workspaces.map((workspace) => {
              const Icon = workspace.icon;
              const label = workspace.label === "Images" ? t("category.Images") : workspace.label === "Audio" ? t("category.Audio") : workspace.label === "Video" ? t("category.video") : t("category.Date & Time");
              return <NavLink key={workspace.href} href={workspace.href} label={label} active={isActive(workspace.href)} icon={<Icon className="h-4 w-4" />} collapsed={isCollapsed} onClick={mobile ? () => setMobileOpen(false) : undefined} />;
            })}</div>
            <NavLink href="/tools" label={devToolsLabel} active={devToolsActive} icon={<Wrench className="h-4 w-4" />} collapsed={isCollapsed} onClick={mobile ? () => setMobileOpen(false) : undefined} />
          </div>
        </nav>
        {mobile && <section aria-label="Preferences" className="mt-3 space-y-1 border-t border-border px-1 pt-2">
          <div className="flex min-h-10 items-center justify-between gap-3 px-2"><span className="shrink-0 text-xs font-medium text-muted-foreground">{t("nav.language")}</span><div className="flex min-w-0 items-center" onClick={(event) => event.stopPropagation()}><LanguageSwitcher /></div></div>
          <div className="flex min-h-10 items-center justify-between gap-3 px-2"><span className="shrink-0 text-xs font-medium text-muted-foreground">{t("nav.appearance")}</span><ThemeToggle /></div>
        </section>}
      </ScrollArea>
      <div className={cn("shrink-0 border-t border-border py-3 text-[11px] text-muted-foreground", isCollapsed ? "flex justify-center px-1" : "px-5")}>{isCollapsed ? <span aria-label="GaGet.dev">©</span> : <>© {new Date().getFullYear()} GaGet.dev</>}</div>
    </div>
  );
  return <>
    <aside className={cn("fixed inset-y-0 z-40 hidden lg:block", direction === "ltr" ? "left-0" : "right-0")}>{renderSidebar(collapsed)}</aside>
    {mobileOpen && <div className="fixed inset-0 z-[110] lg:hidden" data-testid="mobile-navigation-drawer">
      <button aria-label="Close navigation overlay" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
      <div className={cn("absolute inset-y-0", direction === "ltr" ? "left-0" : "right-0")}>{renderSidebar(false, true)}</div>
    </div>}
  </>;
}
function NavLink({ href, label, active, icon, collapsed, onClick }: { href: string; label: string; active: boolean; icon: React.ReactNode; collapsed: boolean; onClick?: () => void }) {
  return <LocaleLink href={href} onClick={onClick} title={collapsed ? label : undefined} aria-label={label} className={cn("flex h-9 items-center rounded-lg text-sm transition-colors", collapsed ? "justify-center px-0" : "gap-3 px-3", active ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
    <span className="shrink-0">{icon}</span>{!collapsed && <span className="truncate">{label}</span>}
  </LocaleLink>;
}
