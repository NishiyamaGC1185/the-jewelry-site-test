import { EventsPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("ja", "events");

export default function Page() {
  return <EventsPage lang="ja" />;
}
