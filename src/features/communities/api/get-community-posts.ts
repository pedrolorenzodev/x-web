import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import { byNewest, mockTweets, toTweet } from "@/mocks/tweets";

function engagementOf({ stats }: Tweet) {
  return stats.likes + 2 * stats.retweets + stats.replies + stats.bookmarks;
}

function communityTweets(communityId: string | null) {
  return mockTweets
    .filter(
      (record) =>
        record.community &&
        record.replyToId === null &&
        (communityId === null || record.community.id === communityId),
    )
    .sort(byNewest)
    .flatMap((record) => {
      const tweet = toTweet(record);
      return tweet ? [tweet] : [];
    });
}

export type CommunityPosts = {
  top: Tweet[];
  latest: Tweet[];
  media: Tweet[];
};

export async function getCommunityPosts(
  communityId: string,
): Promise<CommunityPosts> {
  await connection();
  const latest = communityTweets(communityId);

  return {
    top: [...latest].sort((a, b) => engagementOf(b) - engagementOf(a)),
    latest,
    media: latest.filter((tweet) => tweet.media.length > 0),
  };
}

export async function getCommunitiesFeed(): Promise<Tweet[]> {
  await connection();
  return communityTweets(null);
}
