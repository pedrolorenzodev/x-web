import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import { findUserByHandle } from "@/mocks/users";
import { byNewest, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 20;

type ProfileFeed = "posts" | "replies";

export async function getProfileTweets(
  handle: string,
  feed: ProfileFeed,
  cursor: string | null = null,
): Promise<Page<TimelineItem>> {
  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };

  const items = mockTweets
    .filter((record) => record.authorId === author.id)
    .filter((record) =>
      feed === "posts" ? record.replyToId === null : record.replyToId !== null,
    )
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [{ tweet, retweetedBy: null }] : [];
    });

  return paginate(items, cursor, PAGE_SIZE, (item) => item.tweet.id);
}
