import type { Page } from "@/types/pagination";
import type { Tweet } from "@/types/tweet";
import { byNewest, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 20;

export async function getReplies(
  tweetId: string,
  cursor: string | null = null,
): Promise<Page<Tweet>> {
  const replies = mockTweets
    .filter((record) => record.replyToId === tweetId)
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [tweet] : [];
    });

  return paginate(replies, cursor, PAGE_SIZE, (tweet) => tweet.id);
}
