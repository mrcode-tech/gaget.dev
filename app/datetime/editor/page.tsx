import type { Metadata } from "next";
import { DateTimeEditor } from "@/components/datetime-editor";

export const metadata: Metadata = {
  title: "Date & Time Workspace | GaGet.dev",
  description: "Explore dates, time zones, calendars, timestamps, and date calculations in one multilingual workspace.",
  alternates: { canonical: "/datetime/editor" },
  openGraph: {
    title: "Date & Time Workspace",
    description: "A multilingual workspace for dates, calendars, clocks, and calculations.",
    url: "/datetime/editor",
    type: "website",
  },
};

export default async function DateTimeEditorPage({ searchParams }: { searchParams: Promise<{ feature?: string }> }) {
  const { feature } = await searchParams;
  return <DateTimeEditor initialFeature={feature} />;
}
