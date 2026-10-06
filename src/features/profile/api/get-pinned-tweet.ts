import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import { findUserByHandle } from "@/mocks/users";
import { mockTweets, toTweet } from "@/mocks/tweets";

export async function getPinnedTweet(handle: string): Promise<Tweet | null> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author?.pinnedTweetId) return null;

  const record = mockTweets.find(
    (item) => item.id === author.pinnedTweetId && item.authorId === author.id,
  );
  return record ? toTweet(record) : null;
}
