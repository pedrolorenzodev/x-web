import type { FollowedByPreview } from "@/types/user";
import { mockUsers, toSummary } from "@/mocks/users";
import { mockRetweets, mockTweets } from "@/mocks/tweets";

const PREVIEW_SIZE = 3;

function findEngagedUserIds(userId: string) {
  const authoredIds = new Set(
    mockTweets
      .filter((record) => record.authorId === userId)
      .map((record) => record.id),
  );
  const engagedIds = new Set<string>();

  for (const record of mockTweets) {
    const repliedTo = record.replyToId && authoredIds.has(record.replyToId);
    const quoted = record.quotedId && authoredIds.has(record.quotedId);
    if (repliedTo || quoted) engagedIds.add(record.authorId);
  }
  for (const retweet of mockRetweets) {
    if (authoredIds.has(retweet.tweetId)) engagedIds.add(retweet.userId);
  }

  engagedIds.delete(userId);
  return engagedIds;
}

export function findFollowedByPreview(userId: string): FollowedByPreview {
  const engagedIds = findEngagedUserIds(userId);
  const followers = mockUsers.filter(
    (user) => user.followedByViewer && engagedIds.has(user.id),
  );

  return {
    users: followers.slice(0, PREVIEW_SIZE).map(toSummary),
    total: followers.length,
  };
}
