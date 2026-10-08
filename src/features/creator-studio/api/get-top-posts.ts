import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import type {
  InspirationSort,
  InspirationWindow,
} from "@/features/creator-studio/types/inspiration";
import { mockTweets, toTweet } from "@/mocks/tweets";

const HOUR_MS = 60 * 60 * 1000;
const TOP_POSTS_LIMIT = 20;

const windowMs: Record<InspirationWindow, number> = {
  "24h": 24 * HOUR_MS,
  "7d": 7 * 24 * HOUR_MS,
  "30d": 30 * 24 * HOUR_MS,
};

export async function getTopPosts(
  window: InspirationWindow,
  sort: InspirationSort,
): Promise<Tweet[]> {
  await connection();
  const since = Date.now() - windowMs[window];

  return mockTweets
    .filter(
      (record) =>
        record.replyToId === null && Date.parse(record.createdAt) >= since,
    )
    .sort((a, b) => b.stats[sort] - a.stats[sort])
    .slice(0, TOP_POSTS_LIMIT)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [tweet] : [];
    });
}
