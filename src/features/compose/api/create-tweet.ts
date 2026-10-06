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

function findRecord(id: string | null | undefined) {
  return id ? mockTweets.find((item) => item.id === id) : undefined;
}

export async function createTweet({
  text,
  replyToId,
  quotedId = null,
}: NewTweetInput): Promise<CreatedTweet> {
  const viewer = await getMockViewer();
  const body = text.trim();
  if (!viewer) throw new Error("No viewer session");
  if ((!body && !quotedId) || [...body].length > MAX_TWEET_LENGTH) {
    throw new Error("Invalid tweet length");
  }

  const parent = findRecord(replyToId);
  if (replyToId && !parent) throw new Error("Parent tweet not found");

  const quoted = findRecord(quotedId);
  if (quotedId && !quoted) throw new Error("Quoted tweet not found");

  const id = `t${Date.now()}`;
  mockTweets.push({
    id,
    authorId: viewer.id,
    text: body,
    media: [],
    createdAt: new Date().toISOString(),
    replyToId: parent?.id ?? null,
    quotedId: quoted?.id ?? null,
    stats: {
      replies: 0,
      retweets: 0,
      quotes: 0,
      likes: 0,
      bookmarks: 0,
      views: 0,
    },
    likedByViewer: false,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  });

  if (parent) parent.stats.replies += 1;
  if (quoted) quoted.stats.quotes += 1;
  viewer.postsCount += 1;

  refresh();
  return { id, handle: viewer.handle };
}
