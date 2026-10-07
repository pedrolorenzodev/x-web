import type { TimelineItem } from "@/types/tweet";
import {
  isListTimelineKind,
  listIdOf,
  type ListTimelineKind,
  type TimelineKind,
} from "@/features/feed/types/timeline-kind";
import { findUserById, toSummary } from "@/mocks/users";
import { mockListMembers } from "@/mocks/lists";
import { isIncomingDelivered } from "@/mocks/incoming-tweets";
import {
  byNewest,
  mockRetweets,
  mockTweets,
  toTweet,
  type TweetRecord,
} from "@/mocks/tweets";
import { rankForYou } from "@/features/feed/utils/rank-for-you";
import { findPinnedList } from "@/features/feed/api/find-pinned-list";

const POPULAR_MIN_LIKES = 50;

function buildListItems(
  kind: ListTimelineKind,
  viewerId: string | null,
): TimelineItem[] {
  const listId = listIdOf(kind);
  if (!findPinnedList(listId, viewerId)) return [];

  const memberIds = new Set(
    mockListMembers
      .filter((member) => member.listId === listId)
      .map((member) => member.userId),
  );

  return mockTweets
    .filter(
      (record) => record.replyToId === null && memberIds.has(record.authorId),
    )
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [{ tweet, retweetedBy: null }] : [];
    });
}

export function buildTimelineItems(
  kind: TimelineKind,
  viewerId: string | null,
): TimelineItem[] {
  if (isListTimelineKind(kind)) return buildListItems(kind, viewerId);

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

  if (kind !== "for-you") return items;

  const isIncoming = (item: TimelineItem) =>
    !item.retweetedBy && isIncomingDelivered(item.tweet.id);
  const isOwn = (item: TimelineItem) =>
    !item.retweetedBy && item.tweet.author.id === viewerId;
  const newestRankedAt = Math.max(
    ...items
      .filter((item) => !isIncoming(item) && !isOwn(item))
      .map((item) => Date.parse(item.tweet.createdAt)),
  );
  const leadsTimeline = (item: TimelineItem) =>
    isIncoming(item) ||
    (isOwn(item) && Date.parse(item.tweet.createdAt) > newestRankedAt);

  return [
    ...items.filter(leadsTimeline),
    ...rankForYou(
      items.filter((item) => !leadsTimeline(item)),
      viewerId,
    ),
  ];
}
