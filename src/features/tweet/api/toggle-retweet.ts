"use server";

import { refresh } from "next/cache";
import { mockTweets } from "@/mocks/tweets";

export async function toggleRetweet(tweetId: string) {
  const record = mockTweets.find((item) => item.id === tweetId);
  if (!record) return;

  record.retweetedByViewer = !record.retweetedByViewer;
  record.stats.retweets += record.retweetedByViewer ? 1 : -1;

  refresh();
}
