"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import type {
  ProfilePostsFilter,
  ProfileSort,
} from "@/features/profile/types/profile-tab";
import { findUserByHandle } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";
import { mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";
import { toReposter } from "@/features/profile/api/to-reposter";
import { timelineItemKey } from "@/features/profile/utils/timeline-item-key";

const PAGE_SIZE = 20;

type Entry = { item: TimelineItem; at: string };

function byRecency(a: Entry, b: Entry) {
  return b.at.localeCompare(a.at);
}

function byPopularity(a: Entry, b: Entry) {
  return b.item.tweet.stats.likes - a.item.tweet.stats.likes || byRecency(a, b);
}

export async function getProfileTweets(
  handle: string,
  filter: ProfilePostsFilter = "posts",
  sort: ProfileSort = "recent",
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<TimelineItem>> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };
  const viewer = await getMockViewer();

  const posts = mockTweets.flatMap((record): Entry[] => {
    if (record.authorId !== author.id || record.replyToId !== null) return [];
    if (record.id === author.pinnedTweetId) return [];
    const tweet = toTweet(record);
    return tweet ? [{ item: { tweet, retweetedBy: null }, at: record.createdAt }] : [];
  });

  const reposter = toReposter(author, viewer?.id ?? null);
  const reposts =
    filter === "all"
      ? mockRetweets.flatMap((entry): Entry[] => {
          if (entry.userId !== author.id) return [];
          const record = mockTweets.find((item) => item.id === entry.tweetId);
          const tweet = record ? toTweet(record) : null;
          return tweet
            ? [{ item: { tweet, retweetedBy: reposter }, at: entry.createdAt }]
            : [];
        })
      : [];

  const entries = [...posts, ...reposts].sort(
    sort === "popular" ? byPopularity : byRecency,
  );

  return paginate(
    entries.map((entry) => entry.item),
    cursor,
    limit,
    timelineItemKey,
  );
}
