"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { localeDirections } from "@/lib/i18n/messages";
import { useI18n } from "@/components/i18n-provider";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  if (pathname.replace(/\\/$/, "") === "/images/editor") return <>{children}</>;
  const { locale } = useI18n();
  const direction = localeDirections[locale];

  return (
    <>
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />
      <div
        className={
          direction === "ltr"
            ? sidebarCollapsed
              ? "min-h-screen transition-[padding] duration-200 lg:pl-16"
              : "min-h-screen transition-[padding] duration-200 lg:pl-[248px]"
            : sidebarCollapsed
              ? "min-h-screen transition-[padding] duration-200 lg:pr-16"
              : "min-h-screen transition-[padding] duration-200 lg:pr-[248px]"
        }
      >
        <AppHeader sidebarCollapsed={sidebarCollapsed} />
        {children}
      </div>
    </>
  );
}
