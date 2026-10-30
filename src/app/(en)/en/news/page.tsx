import { NewsPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "news");

export default function Page() {
  return <NewsPage lang="en" />;
}
