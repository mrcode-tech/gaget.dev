"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { localeDirections } from "@/lib/i18n/messages";
import { useI18n } from "@/components/i18n-provider";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { locale } = useI18n();
  const direction = localeDirections[locale];
  const pathname = usePathname();
  const isPhotoEditor = /(?:^|\/)images\/editor\/?$/.test(pathname);
  const isAudioEditor = /(?:^|\/)audio\/editor\/?$/.test(pathname);
  const isEditor = isPhotoEditor || isAudioEditor;

  return (
    <>
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />
      <div
        className={
          isEditor ? "h-dvh overflow-hidden" : direction === "ltr"
            ? sidebarCollapsed
              ? "min-h-screen transition-[padding] duration-200 lg:pl-16"
              : "min-h-screen transition-[padding] duration-200 lg:pl-[248px]"
            : sidebarCollapsed
              ? "min-h-screen transition-[padding] duration-200 lg:pr-16"
              : "min-h-screen transition-[padding] duration-200 lg:pr-[248px]"
        }
      >
        <div className={isEditor ? "hidden lg:block" : ""}>
          <AppHeader sidebarCollapsed={sidebarCollapsed} />
        </div>
        <div aria-hidden="true" className={isEditor ? "hidden h-[68px] lg:block" : "h-[68px]"} />
        {children}
      </div>
    </>
  );
}
