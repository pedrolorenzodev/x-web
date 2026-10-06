"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockRetweets, mockTweets } from "@/mocks/tweets";

export async function deleteTweet(tweetId: string) {
  const viewer = await getMockViewer();
  const index = mockTweets.findIndex((item) => item.id === tweetId);
  const record = mockTweets[index];
  if (!viewer || !record || record.authorId !== viewer.id) return;

  mockTweets.splice(index, 1);
  const parent = mockTweets.find((item) => item.id === record.replyToId);
  if (parent) parent.stats.replies = Math.max(0, parent.stats.replies - 1);
  const quoted = mockTweets.find((item) => item.id === record.quotedId);
  if (quoted) quoted.stats.quotes = Math.max(0, quoted.stats.quotes - 1);
  for (let i = mockRetweets.length - 1; i >= 0; i -= 1) {
    if (mockRetweets[i].tweetId === tweetId) mockRetweets.splice(i, 1);
  }
  if (viewer.pinnedTweetId === tweetId) viewer.pinnedTweetId = null;
  viewer.postsCount = Math.max(0, viewer.postsCount - 1);

  refresh();
}
