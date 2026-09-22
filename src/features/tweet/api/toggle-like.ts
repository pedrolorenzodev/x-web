"use server";

import { refresh } from "next/cache";
import { mockTweets } from "@/mocks/tweets";

export async function toggleLike(tweetId: string) {
  const record = mockTweets.find((item) => item.id === tweetId);
  if (!record) return;

  record.likedByViewer = !record.likedByViewer;
  record.stats.likes += record.likedByViewer ? 1 : -1;

  refresh();
}
