import { headers } from "next/headers";
import { DesignLanding } from "@/design/components/design-experience";
import { designStyles } from "@/design/data/styles";

export default async function DesignPage() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-gaget-locale") || "en";
  const prefix = locale === "en" ? "" : `/${locale}`;
  return <DesignLanding stylesList={designStyles} href={(path) => `${prefix}${path}`} />;
}
