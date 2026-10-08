import type { Tweet } from "@/types/tweet";

export function engagementScore(tweet: Tweet) {
  const { likes, retweets, replies, quotes } = tweet.stats;
  return likes + retweets * 2 + replies * 3 + quotes;
}
