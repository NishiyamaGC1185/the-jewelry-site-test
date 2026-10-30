import type { Metadata } from "next";
import { IgPostPage } from "@/components/Pages";

// One page for every Instagram post; the post is chosen by ?id= and loaded from posts.json.
export const metadata: Metadata = { title: "Instagram｜THE JEWELRY", robots: { index: false } };

export default function Page() {
  return <IgPostPage lang="ja" />;
}
