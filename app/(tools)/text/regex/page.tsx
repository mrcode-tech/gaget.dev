import type { Metadata } from "next";
import { ToolLayout } from "@/components/tool-layout";
import { RegexWorkbench } from "@/components/regex-workbench";

export const metadata: Metadata = {
  title: "Regex Tester",
  description: "Test JavaScript regular expressions against sample text in your browser.",
  alternates: { canonical: "/text/regex" },
};

export default function RegexTesterPage() {
  return <ToolLayout category="Text" title="Regex Tester" description="Test a JavaScript regular expression against sample text, inspect match positions and capture groups, and stop expensive patterns safely."><RegexWorkbench /></ToolLayout>;
}
