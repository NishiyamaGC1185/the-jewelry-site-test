import { SpacesPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "spaces");

export default function Page() {
  return <SpacesPage lang="en" />;
}
