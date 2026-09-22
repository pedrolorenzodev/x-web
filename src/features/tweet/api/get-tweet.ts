import type { Tweet } from "@/types/tweet";
import { mockTweets, toTweet } from "@/mocks/tweets";

export async function getTweet(id: string): Promise<Tweet | null> {
  const record = mockTweets.find((item) => item.id === id);
  if (!record) return null;

  return toTweet(record);
}
