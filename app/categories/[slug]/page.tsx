import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryLanding } from "@/components/category-landing";
import { categories } from "@/lib/tools/registry";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) return {};

  return {
    title: `${category.name} Developer Tools`,
    description: `Browse ${category.name} utilities on GaGet.dev.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  // Pass only serializable data across the Server/Client Component boundary.
  return <CategoryLanding category={category.name} />;
}
