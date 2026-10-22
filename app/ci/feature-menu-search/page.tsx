import { notFound } from "next/navigation";
import { FeatureSearchThresholdHarness } from "./harness";

export const dynamic = "force-dynamic";

export default async function FeatureMenuSearchThresholdPage({
  searchParams,
}: {
  searchParams: Promise<{ count?: string }>;
}) {
  if (process.env.GITHUB_ACTIONS !== "true") notFound();
  const count = Number((await searchParams).count);
  if (count !== 8 && count !== 9) notFound();
  return <FeatureSearchThresholdHarness count={count} />;
}
