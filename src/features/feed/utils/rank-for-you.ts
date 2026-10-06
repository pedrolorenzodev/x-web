import type { TimelineItem, Tweet } from "@/types/tweet";

const HOUR_MS = 60 * 60 * 1000;
const AGE_OFFSET_HOURS = 2;
const GRAVITY = 1.5;

function engagementOf({ stats, ...tweet }: Tweet) {
  const likes = stats.likes - Number(tweet.likedByViewer);
  const retweets = stats.retweets - Number(tweet.retweetedByViewer);
  const bookmarks = stats.bookmarks - Number(tweet.bookmarkedByViewer);

  return likes + 2 * retweets + 2 * stats.quotes + stats.replies + bookmarks;
}

function scoreOf(tweet: Tweet, referenceMs: number) {
  const ageHours = Math.max(0, referenceMs - Date.parse(tweet.createdAt)) / HOUR_MS;
  return (engagementOf(tweet) + 1) / (ageHours + AGE_OFFSET_HOURS) ** GRAVITY;
}

export function rankForYou(items: TimelineItem[], viewerId: string | null) {
  const isOwn = (item: TimelineItem) =>
    item.tweet.author.id === viewerId && !item.retweetedBy;
  const referenceMs = Math.max(
    ...items
      .filter((item) => !isOwn(item))
      .map((item) => Date.parse(item.tweet.createdAt)),
  );
  const isFreshOwn = (item: TimelineItem) =>
    isOwn(item) && Date.parse(item.tweet.createdAt) > referenceMs;

  const scored = items
    .filter((item) => !isFreshOwn(item))
    .map((item) => ({ item, score: scoreOf(item.tweet, referenceMs) }))
    .sort((a, b) => b.score - a.score || b.item.tweet.id.localeCompare(a.item.tweet.id))
    .map(({ item }) => item);

  return [...items.filter(isFreshOwn), ...scored];
}
