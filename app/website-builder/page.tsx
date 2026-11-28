import WebsiteBuilderWorkspace from "@/components/website-builder/workspace";

export const metadata = {
  title: "Website Design Builder | GaGet",
  description: "Create a website by choosing and composing professionally designed sections.",
  robots: { index: false, follow: false },
};

export default function WebsiteBuilderPage() {
  return <WebsiteBuilderWorkspace />;
}
