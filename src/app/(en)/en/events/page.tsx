import { EventsPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "events");

export default function Page() {
  return <EventsPage lang="en" />;
}
