import { redirect } from "next/navigation";

/** Keep old bookmarks working while UUID generation lives in Data Generator. */
export default function LegacyUuidGeneratorRedirect() {
  redirect("/generators/sample-data");
}
