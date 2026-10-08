import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import type { User } from "@/types/user";
import { findFollowedByPreview } from "@/mocks/follows";
import { mockNotifications } from "@/mocks/notifications";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { findUserById, toUser } from "@/mocks/users";
import { engagementScore } from "@/features/tweet/utils/engagement-score";

export type EngagementSort = "top" | "recent";

function sortUsers(users: User[], sort: EngagementSort) {
  if (sort === "recent") return users;
  return [...users].sort((a, b) => b.followersCount - a.followersCount);
}

function toUsers(ids: string[]): User[] {
  return [...new Set(ids)].flatMap((id) => {
    const record = findUserById(id);
    return record ? [toUser(record, findFollowedByPreview(record.id))] : [];
  });
}

export async function getQuotes(
  tweetId: string,
  sort: EngagementSort,
): Promise<Tweet[]> {
  await connection();
  const quotes = mockTweets
    .filter((record) => record.quotedId === tweetId)
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [tweet] : [];
    });
  if (sort === "recent") return quotes;
  return quotes.sort((a, b) => engagementScore(b) - engagementScore(a));
}

export async function getReposters(
  tweetId: string,
  sort: EngagementSort,
): Promise<User[]> {
  await connection();
  const viewer = await getMockViewer();
  const tweet = mockTweets.find((record) => record.id === tweetId);
  const ids = mockRetweets
    .filter((retweet) => retweet.tweetId === tweetId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((retweet) => retweet.userId);
  if (viewer && tweet?.retweetedByViewer) ids.unshift(viewer.id);
  return sortUsers(toUsers(ids), sort);
}

export async function getLikers(
  tweetId: string,
  sort: EngagementSort,
): Promise<User[]> {
  await connection();
  const viewer = await getMockViewer();
  const tweet = mockTweets.find((record) => record.id === tweetId);
  const ids = mockNotifications.flatMap((record) =>
    record.type === "like" && record.tweetId === tweetId ? record.actorIds : [],
  );
  if (viewer && tweet?.likedByViewer) ids.unshift(viewer.id);
  return sortUsers(toUsers(ids), sort);
}
