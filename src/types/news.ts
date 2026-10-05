import type { UserSummary } from "@/types/user";

export type NewsCategory =
  | "News"
  | "Sports"
  | "Entertainment"
  | "Technology"
  | "Other";

export type NewsStory = {
  id: string;
  headline: string;
  category: NewsCategory;
  postCount: number;
  publishedAt: string;
  isTrendingNow: boolean;
  facepile: UserSummary[];
  summary: string;
  relatedUserIds: string[];
  topTweetIds: string[];
  latestTweetIds: string[];
};
