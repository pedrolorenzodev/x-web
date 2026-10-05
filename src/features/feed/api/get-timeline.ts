"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import { findUserById, toSummary } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 10;

export async function getTimeline(
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<TimelineItem>> {
  await connection();
  const viewer = await getMockViewer();

  const isFollowedOrViewer = (userId: string) =>
    userId === viewer?.id || Boolean(findUserById(userId)?.followedByViewer);

  const findLatestRetweet = (tweetId: string) =>
    mockRetweets
      .filter(
        (entry) => entry.tweetId === tweetId && isFollowedOrViewer(entry.userId),
      )
      .sort(byNewest)[0];

  const items = mockTweets
    .filter((record) => record.replyToId === null)
    .sort(byNewest)
    .flatMap((record) => {
      const retweet = findLatestRetweet(record.id);
      if (!retweet && !isFollowedOrViewer(record.authorId)) return [];

      const tweet = toTweet(record);
      if (!tweet) return [];

      const retweeter = retweet ? findUserById(retweet.userId) : null;
      return [{ tweet, retweetedBy: retweeter ? toSummary(retweeter) : null }];
    });

  return paginate(items, cursor, limit, (item) => item.tweet.id);
}
