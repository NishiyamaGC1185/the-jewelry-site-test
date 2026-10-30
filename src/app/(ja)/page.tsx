import { HomePage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("ja", "home");

export default function Page() {
  return <HomePage lang="ja" />;
}
