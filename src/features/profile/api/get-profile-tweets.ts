import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import { findUserByHandle, toSummary } from "@/mocks/users";
import { byNewest, mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 20;

export async function getProfileTweets(
  handle: string,
  cursor: string | null = null,
): Promise<Page<TimelineItem>> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };

  const repostedIds = new Set(
    mockRetweets
      .filter((entry) => entry.userId === author.id)
      .map((entry) => entry.tweetId),
  );

  const items = mockTweets
    .filter(
      (record) =>
        (record.authorId === author.id && record.replyToId === null) ||
        repostedIds.has(record.id),
    )
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      if (!tweet) return [];

      const reposted = repostedIds.has(record.id);
      return [{ tweet, retweetedBy: reposted ? toSummary(author) : null }];
    });

  return paginate(items, cursor, PAGE_SIZE, (item) => item.tweet.id);
}
