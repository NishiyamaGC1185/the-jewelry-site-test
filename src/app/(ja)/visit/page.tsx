import { VisitPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("ja", "visit");

export default function Page() {
  return <VisitPage lang="ja" />;
}
