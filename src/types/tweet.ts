import type { UserSummary } from "@/types/user";

export type TweetStats = {
  replies: number;
  retweets: number;
  likes: number;
};

export type Tweet = {
  id: string;
  author: UserSummary;
  text: string;
  createdAt: string;
  replyingTo: UserSummary | null;
  stats: TweetStats;
  likedByViewer: boolean;
  retweetedByViewer: boolean;
};

export type TimelineItem = {
  tweet: Tweet;
  retweetedBy: UserSummary | null;
};

export type NewTweetInput = {
  text: string;
  replyToId: string | null;
};
