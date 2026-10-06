import type { Tweet } from "@/types/tweet";

export function matchesTweet(tweet: Tweet, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return [tweet.text, tweet.author.displayName, tweet.author.handle].some(
    (value) => value.toLowerCase().includes(needle),
  );
}
