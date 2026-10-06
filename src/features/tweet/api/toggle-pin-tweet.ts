"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockTweets } from "@/mocks/tweets";

export async function togglePinTweet(tweetId: string) {
  const viewer = await getMockViewer();
  const record = mockTweets.find((item) => item.id === tweetId);
  if (!viewer || !record || record.authorId !== viewer.id) return;

  viewer.pinnedTweetId = viewer.pinnedTweetId === tweetId ? null : tweetId;

  refresh();
}
