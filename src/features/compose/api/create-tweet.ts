"use server";

import { refresh } from "next/cache";
import type { NewTweetInput } from "@/types/tweet";
import { getMockViewer } from "@/mocks/session";
import { mockTweets } from "@/mocks/tweets";
import { MAX_TWEET_LENGTH } from "@/config/tweet";

type CreatedTweet = {
  id: string;
  handle: string;
};

export async function createTweet({
  text,
  replyToId,
}: NewTweetInput): Promise<CreatedTweet> {
  const viewer = await getMockViewer();
  const body = text.trim();
  if (!viewer) throw new Error("No viewer session");
  if (!body || [...body].length > MAX_TWEET_LENGTH) {
    throw new Error("Invalid tweet length");
  }

  const parent = replyToId
    ? mockTweets.find((item) => item.id === replyToId)
    : null;
  if (replyToId && !parent) throw new Error("Parent tweet not found");

  const id = `t${Date.now()}`;
  mockTweets.push({
    id,
    authorId: viewer.id,
    text: body,
    media: [],
    createdAt: new Date().toISOString(),
    replyToId: parent?.id ?? null,
    stats: { replies: 0, retweets: 0, likes: 0 },
    likedByViewer: false,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  });

  if (parent) parent.stats.replies += 1;
  viewer.postsCount += 1;

  refresh();
  return { id, handle: viewer.handle };
}
