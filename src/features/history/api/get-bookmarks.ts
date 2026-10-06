"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { Tweet } from "@/types/tweet";
import { getMockViewer } from "@/mocks/session";
import { mockTweets, toTweet } from "@/mocks/tweets";
import { matchesTweet } from "@/features/history/utils/match-tweet";
import {
  paginateByDate,
  type DatedEntry,
} from "@/features/history/utils/paginate-by-date";

const PAGE_SIZE = 10;

export async function getBookmarks(
  cursor: string | null = null,
  query: string | null = null,
): Promise<Page<Tweet>> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return { items: [], nextCursor: null };

  const entries = mockTweets.flatMap((record): DatedEntry<Tweet>[] => {
    if (!record.bookmarkedByViewer) return [];
    const tweet = toTweet(record);
    if (!tweet || (query && !matchesTweet(tweet, query))) return [];
    return [
      {
        item: tweet,
        id: record.id,
        at: record.bookmarkedAt ?? record.createdAt,
      },
    ];
  });

  return paginateByDate(entries, cursor, PAGE_SIZE);
}
