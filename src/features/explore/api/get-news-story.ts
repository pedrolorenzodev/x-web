import { connection } from "next/server";
import type { NewsStory } from "@/types/news";
import type { Tweet } from "@/types/tweet";
import type { User } from "@/types/user";
import { findFollowedByPreview } from "@/mocks/follows";
import { mockNews, toNewsStory } from "@/mocks/news";
import { getMockViewer } from "@/mocks/session";
import { mockTweets, toTweet } from "@/mocks/tweets";
import { findUserById, toUser } from "@/mocks/users";

const RELEVANT_PEOPLE_LIMIT = 3;

export type NewsStoryDetail = {
  story: NewsStory;
  top: Tweet[];
  latest: Tweet[];
  relevantPeople: User[];
};

function toTweets(ids: string[]) {
  return ids.flatMap((id) => {
    const record = mockTweets.find((item) => item.id === id);
    const tweet = record ? toTweet(record) : null;
    return tweet ? [tweet] : [];
  });
}

export async function getNewsStory(id: string): Promise<NewsStoryDetail | null> {
  await connection();
  const record = mockNews.find((item) => item.id === id);
  if (!record) return null;

  const viewer = await getMockViewer();
  const top = toTweets(record.topTweetIds);
  const latest = toTweets(record.latestTweetIds).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const authorIds = [
    ...new Set([...top, ...latest].map((tweet) => tweet.author.id)),
  ].filter((authorId) => authorId !== viewer?.id);
  const relevantPeople = authorIds
    .slice(0, RELEVANT_PEOPLE_LIMIT)
    .flatMap((authorId) => {
      const user = findUserById(authorId);
      return user ? [toUser(user, findFollowedByPreview(user.id))] : [];
    });

  return {
    story: toNewsStory(record, viewer?.id ?? null),
    top,
    latest,
    relevantPeople,
  };
}
