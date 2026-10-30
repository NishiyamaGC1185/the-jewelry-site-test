import { VisitPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "visit");

export default function Page() {
  return <VisitPage lang="en" />;
}
