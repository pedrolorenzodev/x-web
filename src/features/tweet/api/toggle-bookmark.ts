"use server";

import { refresh } from "next/cache";
import { mockTweets } from "@/mocks/tweets";

export async function toggleBookmark(tweetId: string) {
  const record = mockTweets.find((item) => item.id === tweetId);
  if (!record) return;

  record.bookmarkedByViewer = !record.bookmarkedByViewer;
  record.bookmarkedAt = record.bookmarkedByViewer
    ? new Date().toISOString()
    : undefined;
  record.stats.bookmarks += record.bookmarkedByViewer ? 1 : -1;

  refresh();
}
