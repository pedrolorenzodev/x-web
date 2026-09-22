import type { Tweet } from "@/types/tweet";

// TODO: views are not part of the contract, so they are derived until they are.
export function deriveViews(tweet: Tweet) {
  return (tweet.stats.replies + 1) * 1337;
}
