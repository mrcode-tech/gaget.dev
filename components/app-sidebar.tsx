"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Code2, Heart, Home, Menu, Sparkles, X } from "lucide-react";
import { categories } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebar = (
    <div className="flex h-full w-[248px] flex-col border-r border-border bg-card">
      <div className="flex h-[68px] items-center gap-3 border-b border-border px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Code2 className="h-4 w-4" /></div>
        <Link href="/" className="text-base font-bold tracking-tight">GaGet<span className="text-primary">.dev</span></Link>
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          <NavLink href="/" label="Home" active={pathname === "/"} icon={<Home className="h-4 w-4" />} onClick={() => setMobileOpen(false)} />
          <NavLink href="/#popular-tools" label="Popular tools" active={false} icon={<Sparkles className="h-4 w-4" />} onClick={() => setMobileOpen(false)} />
          <NavLink href="/#popular-tools" label="Favorites" active={false} icon={<Heart className="h-4 w-4" />} onClick={() => setMobileOpen(false)} />
        </div>
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Categories</p>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return <NavLink key={category.name} href={category.href} label={category.name} active={pathname.startsWith(category.href.split("/").slice(0, 2).join("/")) && category.href !== "/encoding/url" ? true : pathname === category.href} icon={<Icon className="h-4 w-4" />} onClick={() => setMobileOpen(false)} />;
            })}
          </div>
        </div>
      </nav>
      <div className="m-3 rounded-xl border border-border bg-muted/50 p-3">
        <p className="text-sm font-semibold">Built for developers</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Fast, free utilities. Your data stays in your browser whenever possible.</p>
      </div>
      <div className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">© {new Date().getFullYear()} GaGet.dev</div>
    </div>
  );
  return <>
    <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
    <div className="fixed left-3 top-3 z-50 lg:hidden">
      <Button variant="outline" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu className="h-4 w-4" /></Button>
    </div>
    {mobileOpen && <div className="fixed inset-0 z-[60] lg:hidden">
      <button aria-label="Close navigation overlay" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
      <div className="absolute inset-y-0 left-0">{sidebar}</div>
      <Button variant="secondary" size="icon" className="absolute left-[260px] top-3" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X className="h-4 w-4" /></Button>
    </div>}
  </>;
}

function NavLink({ href, label, active, icon, onClick }: { href: string; label: string; active: boolean; icon: React.ReactNode; onClick?: () => void }) {
  return <Link href={href} onClick={onClick} className={cn("flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors", active ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
    <span className="shrink-0">{icon}</span><span className="truncate">{label}</span>
  </Link>;
}
