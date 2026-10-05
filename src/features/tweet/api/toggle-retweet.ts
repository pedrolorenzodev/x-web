"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockRetweets, mockTweets } from "@/mocks/tweets";

export async function toggleRetweet(tweetId: string) {
  const record = mockTweets.find((item) => item.id === tweetId);
  const viewer = await getMockViewer();
  if (!record || !viewer) return;

  record.retweetedByViewer = !record.retweetedByViewer;
  record.stats.retweets += record.retweetedByViewer ? 1 : -1;

  const index = mockRetweets.findIndex(
    (entry) => entry.tweetId === tweetId && entry.userId === viewer.id,
  );
  if (record.retweetedByViewer && index === -1) {
    mockRetweets.push({
      tweetId,
      userId: viewer.id,
      createdAt: new Date().toISOString(),
    });
  }
  if (!record.retweetedByViewer && index !== -1) mockRetweets.splice(index, 1);

  refresh();
}
