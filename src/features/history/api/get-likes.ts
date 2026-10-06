"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { Tweet } from "@/types/tweet";
import { getMockViewer } from "@/mocks/session";
import { mockTweets, toTweet } from "@/mocks/tweets";
import {
  paginateByDate,
  type DatedEntry,
} from "@/features/history/utils/paginate-by-date";

const PAGE_SIZE = 10;

export async function getLikes(
  cursor: string | null = null,
): Promise<Page<Tweet>> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return { items: [], nextCursor: null };

  const entries = mockTweets.flatMap((record): DatedEntry<Tweet>[] => {
    if (!record.likedByViewer) return [];
    const tweet = toTweet(record);
    if (!tweet) return [];
    return [
      { item: tweet, id: record.id, at: record.likedAt ?? record.createdAt },
    ];
  });

  return paginateByDate(entries, cursor, PAGE_SIZE);
}
