"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import { findUserByHandle } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";
import { toReposter } from "@/features/profile/api/to-reposter";
import { timelineItemKey } from "@/features/profile/utils/timeline-item-key";

const PAGE_SIZE = 20;

export async function getProfileReposts(
  handle: string,
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<TimelineItem>> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };
  const viewer = await getMockViewer();
  const reposter = toReposter(author, viewer?.id ?? null);

  const items = mockRetweets
    .filter((entry) => entry.userId === author.id)
    .sort(byNewest)
    .flatMap((entry) => {
      const record = mockTweets.find((item) => item.id === entry.tweetId);
      const tweet = record ? toTweet(record) : null;
      return tweet ? [{ tweet, retweetedBy: reposter }] : [];
    });

  return paginate(items, cursor, limit, timelineItemKey);
}
