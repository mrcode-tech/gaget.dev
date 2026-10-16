"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  Menu,
  Sparkles,
  X,
  Grid2X2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { categories } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/components/i18n-provider";
import { localeDirections } from "@/lib/i18n/messages";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const direction = localeDirections[locale];

  const isActive = (href: string) => {
    const clean = pathname.replace(/^\/(fa|ar)(?=\/|$)/, "") || "/";
    return clean === href || (href !== "/" && clean.startsWith(href + "/"));
  };

  const renderSidebar = (isCollapsed: boolean, mobile = false) => (
    <div
      className={cn(
        "flex h-full flex-col border-border bg-card",
        isCollapsed ? "w-16" : "w-[248px]",
        direction === "ltr" ? "border-r" : "border-l",
        !mobile && "transition-[width] duration-200 ease-in-out"
      )}
    >
      <div
        className={cn(
          "flex h-[68px] shrink-0 items-center border-b border-border",
          isCollapsed ? "justify-center px-2" : "gap-3 px-5"
        )}
      >
        <LocaleLink
          href="/"
          aria-label="GaGet.dev home"
          title={isCollapsed ? "GaGet.dev home" : undefined}
          className={cn("flex min-w-0 items-center gap-3", isCollapsed && "justify-center")}
          onClick={mobile ? () => setMobileOpen(false) : undefined}
        >
          <Image src="/gaget-mark.svg" alt="" aria-hidden="true" width={32} height={32} priority className="h-8 w-8 shrink-0 rounded-xl" />
          {!isCollapsed && (
            <span className="whitespace-nowrap text-base font-bold tracking-tight">
              GaGet<span className="text-primary">.dev</span>
            </span>
          )}
        </LocaleLink>
        {!mobile && (
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 shrink-0", !isCollapsed && "ml-auto")}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggle}
          >
            {isCollapsed ? (
              direction === "ltr" ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )
            ) : direction === "ltr" ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <nav
          aria-label="Main navigation"
          className={cn("space-y-6 py-5", isCollapsed ? "px-2" : "px-3")}
        >
          <div className="space-y-1">
            <NavLink
              href="/"
              label={t("nav.home")}
              active={isActive("/")}
              icon={<Home className="h-4 w-4" />}
              collapsed={isCollapsed}
              onClick={mobile ? () => setMobileOpen(false) : undefined}
            />
            <NavLink
              href="/#popular-tools"
              label={t("nav.popular")}
              active={false}
              icon={<Sparkles className="h-4 w-4" />}
              collapsed={isCollapsed}
              onClick={mobile ? () => setMobileOpen(false) : undefined}
            />
            <NavLink
              href="/tools"
              label={t("nav.allTools")}
              active={isActive("/tools")}
              icon={<Grid2X2 className="h-4 w-4" />}
              collapsed={isCollapsed}
              onClick={mobile ? () => setMobileOpen(false) : undefined}
            />
            <NavLink
              href="/#popular-tools"
              label={t("nav.favorites")}
              active={false}
              icon={<Heart className="h-4 w-4" />}
              collapsed={isCollapsed}
              onClick={mobile ? () => setMobileOpen(false) : undefined}
            />
          </div>

          <div>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {t("nav.categories")}
              </p>
            )}
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <NavLink
                    key={category.name}
                    href={category.href}
                    label={t(`category.${category.name}`)}
                    active={isActive(category.href)}
                    icon={<Icon className="h-4 w-4" />}
                    collapsed={isCollapsed}
                    onClick={mobile ? () => setMobileOpen(false) : undefined}
                  />
                );
              })}
            </div>
          </div>
        </nav>
      </ScrollArea>

      {mobile && (
        <div className="shrink-0 border-t border-border px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}

      <div
        className={cn(
          "shrink-0 border-t border-border py-3 text-[11px] text-muted-foreground",
          isCollapsed ? "flex justify-center px-1" : "px-5"
        )}
      >
        {isCollapsed ? (
          <span aria-label="GaGet.dev">©</span>
        ) : (
          <>© {new Date().getFullYear()} GaGet.dev</>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 z-40 hidden lg:block",
          direction === "ltr" ? "left-0" : "right-0"
        )}
      >
        {renderSidebar(collapsed)}
      </aside>

      <div
        className={cn(
          "fixed top-3 z-50 lg:hidden",
          direction === "ltr" ? "left-3" : "right-3"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0",
              direction === "ltr" ? "left-0" : "right-0"
            )}
          >
            {renderSidebar(false, true)}
          </div>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute top-3",
              direction === "ltr" ? "left-[260px]" : "right-[260px]"
            )}
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}

function NavLink({
  href,
  label,
  active,
  icon,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <LocaleLink
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={cn(
        "flex h-9 items-center rounded-lg text-sm transition-colors",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active
          ? "bg-accent font-semibold text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </LocaleLink>
  );
}
