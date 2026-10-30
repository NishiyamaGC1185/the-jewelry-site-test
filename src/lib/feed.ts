import { content, type Lang } from "@/content/site";

export type FeedKind = "news" | "event";

/** One card on the News / Events lists: a manual news item or an Instagram post. */
export type FeedItem = {
  id: string;
  kind: FeedKind;
  date: string; // "YYYY.MM.DD"
  title: string;
  desc: string;
  image: string;
  permalink?: string; // Instagram posts only
};

/** Manual news written in the site content (Instagram posts are added in the browser, see Feed.tsx). */
export function feed(lang: Lang, kind?: FeedKind): FeedItem[] {
  if (kind && kind !== "news") return [];
  return content[lang].news.items.map((n) => ({ id: n.id, kind: "news", date: n.date, title: n.title, desc: n.body, image: n.image }));
}

export const feedItem = (lang: Lang, id: string) => feed(lang).find((i) => i.id === id);

/** Static page ids for manual news; never empty. */
export const feedIds = () => feed("ja").map((i) => ({ id: i.id }));
