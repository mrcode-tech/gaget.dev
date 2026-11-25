import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { DesignShell } from "@/design/components/design-shell";
import { designStyles } from "@/design/data/styles";

export const metadata: Metadata = {
  title: { default: "Design Playground", template: "%s | Design Playground" },
  description: "Explore visual design movements through a shared sample portfolio and practical design guidance.",
};

export default async function DesignLayout({ children }: Readonly<{ children: ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-gaget-locale") || "en";
  return <DesignShell locale={locale} stylesList={designStyles}>{children}</DesignShell>;
}
