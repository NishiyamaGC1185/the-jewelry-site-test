import { AboutPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("ja", "about");

export default function Page() {
  return <AboutPage lang="ja" />;
}
