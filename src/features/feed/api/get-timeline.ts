import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import { findUserById, toSummary } from "@/mocks/users";
import { byNewest, mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 10;

export async function getTimeline(
  cursor: string | null = null,
): Promise<Page<TimelineItem>> {
  await connection();

  const items = mockTweets
    .filter((record) => record.replyToId === null)
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      if (!tweet) return [];

      const retweet = mockRetweets.find((entry) => entry.tweetId === record.id);
      const retweeter = retweet ? findUserById(retweet.userId) : null;

      return [{ tweet, retweetedBy: retweeter ? toSummary(retweeter) : null }];
    });

  return paginate(items, cursor, PAGE_SIZE, (item) => item.tweet.id);
}
