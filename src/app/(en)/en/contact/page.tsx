import { ContactPage } from "@/components/Pages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("en", "contact");

export default function Page() {
  return <ContactPage lang="en" />;
}
