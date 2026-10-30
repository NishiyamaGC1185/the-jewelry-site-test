import { NewsPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("ja", "news");

export default function Page() {
  return <NewsPage lang="ja" />;
}
