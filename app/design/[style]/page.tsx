import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignStylePage } from "@/design/components/design-experience";
import { designStyles, getDesignStyle } from "@/design/data/styles";

type Props = { params: Promise<{ style: string }> };

export function generateStaticParams() {
  return designStyles.map(({ id }) => ({ style: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style: id } = await params;
  const style = getDesignStyle(id);
  if (!style) return { title: "Style not found" };
  return { title: style.name, description: style.description };
}

export default async function DesignStyleRoute({ params }: Props) {
  const { style: id } = await params;
  const style = getDesignStyle(id);
  if (!style) notFound();
  return <DesignStylePage style={style} />;
}
