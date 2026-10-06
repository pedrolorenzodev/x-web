import type { TimelineItem } from "@/types/tweet";
import type { TimelineKind } from "@/features/feed/types/timeline-kind";
import { findUserById, toSummary } from "@/mocks/users";
import {
  byNewest,
  mockRetweets,
  mockTweets,
  toTweet,
  type TweetRecord,
} from "@/mocks/tweets";
import { rankForYou } from "@/features/feed/utils/rank-for-you";

const POPULAR_MIN_LIKES = 50;

export function buildTimelineItems(
  kind: TimelineKind,
  viewerId: string | null,
): TimelineItem[] {
  const isFollowedOrViewer = (userId: string) =>
    userId === viewerId || Boolean(findUserById(userId)?.followedByViewer);

  const findLatestRetweet = (tweetId: string) =>
    mockRetweets
      .filter(
        (entry) => entry.tweetId === tweetId && isFollowedOrViewer(entry.userId),
      )
      .sort(byNewest)[0];

  const isPopular = (record: TweetRecord) =>
    record.stats.likes - Number(record.likedByViewer) >= POPULAR_MIN_LIKES;

  const items = mockTweets
    .filter((record) => record.replyToId === null)
    .sort(byNewest)
    .flatMap((record) => {
      const retweet = findLatestRetweet(record.id);
      const followed = Boolean(retweet) || isFollowedOrViewer(record.authorId);
      if (!followed && !(kind === "for-you" && isPopular(record))) return [];

      const tweet = toTweet(record);
      if (!tweet) return [];

      const retweeter = retweet ? findUserById(retweet.userId) : null;
      return [{ tweet, retweetedBy: retweeter ? toSummary(retweeter) : null }];
    });

  return kind === "for-you" ? rankForYou(items, viewerId) : items;
}
