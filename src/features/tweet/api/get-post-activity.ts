import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import type { User } from "@/types/user";
import { findFollowedByPreview } from "@/mocks/follows";
import { mockNotifications } from "@/mocks/notifications";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockRetweets, mockTweets, toTweet } from "@/mocks/tweets";
import { findUserById, toUser } from "@/mocks/users";

function toUsers(ids: string[]): User[] {
  return [...new Set(ids)].flatMap((id) => {
    const record = findUserById(id);
    return record ? [toUser(record, findFollowedByPreview(record.id))] : [];
  });
}

export async function getQuotes(tweetId: string): Promise<Tweet[]> {
  await connection();
  return mockTweets
    .filter((record) => record.quotedId === tweetId)
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [tweet] : [];
    });
}

export async function getReposters(tweetId: string): Promise<User[]> {
  await connection();
  const viewer = await getMockViewer();
  const tweet = mockTweets.find((record) => record.id === tweetId);
  const ids = mockRetweets
    .filter((retweet) => retweet.tweetId === tweetId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((retweet) => retweet.userId);
  if (viewer && tweet?.retweetedByViewer) ids.unshift(viewer.id);
  return toUsers(ids);
}

export async function getLikers(tweetId: string): Promise<User[]> {
  await connection();
  const viewer = await getMockViewer();
  const tweet = mockTweets.find((record) => record.id === tweetId);
  const ids = mockNotifications.flatMap((record) =>
    record.type === "like" && record.tweetId === tweetId ? record.actorIds : [],
  );
  if (viewer && tweet?.likedByViewer) ids.unshift(viewer.id);
  return toUsers(ids);
}
