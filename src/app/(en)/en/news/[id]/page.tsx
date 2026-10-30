import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedDetailPage } from "@/components/Pages";
import { feedIds, feedItem } from "@/lib/feed";
import { INDEX } from "@/lib/meta";

// One page per news item / Instagram post, generated at build time from the feed.
export const generateStaticParams = feedIds;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const item = feedItem("en", (await params).id);
  return { title: item ? `${item.title} | THE JEWELRY` : "THE JEWELRY", description: item?.desc.slice(0, 120), robots: { index: INDEX } };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const item = feedItem("en", (await params).id);
  if (!item) notFound();
  return <FeedDetailPage lang="en" item={item} />;
}
