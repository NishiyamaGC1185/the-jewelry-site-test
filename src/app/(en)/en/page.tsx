import { HomePage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "home");

export default function Page() {
  return <HomePage lang="en" />;
}
