import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DateTimeEditor } from "@/components/datetime-editor";
import { dateTimeToolEntries } from "@/lib/tools/date-time-tools";

export function generateStaticParams() {
  return dateTimeToolEntries.map(([tool]) => ({ tool }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const entry = dateTimeToolEntries.find(([slug]) => slug === tool);
  if (!entry) return { title: "Date & Time Workspace | GaGet.dev" };
  const canonical = "/datetime/editor?feature=" + tool;
  return {
    title: entry[1] + " | Date & Time | GaGet.dev",
    description: entry[2],
    alternates: { canonical },
    openGraph: { title: entry[1], description: entry[2], url: canonical, type: "website" },
  };
}

export default async function DateTimeToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (!dateTimeToolEntries.some(([slug]) => slug === tool)) notFound();
  return <DateTimeEditor initialFeature={tool} />;
}
