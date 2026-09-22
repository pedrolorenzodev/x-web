import type { UserSummary } from "@/types/user";

export type TweetStats = {
  replies: number;
  retweets: number;
  likes: number;
};

export type TweetMedia = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type Tweet = {
  id: string;
  author: UserSummary;
  text: string;
  media: TweetMedia[];
  createdAt: string;
  replyingTo: UserSummary | null;
  stats: TweetStats;
  likedByViewer: boolean;
  retweetedByViewer: boolean;
  bookmarkedByViewer: boolean;
};

export type TimelineItem = {
  tweet: Tweet;
  retweetedBy: UserSummary | null;
};

export type NewTweetInput = {
  text: string;
  replyToId: string | null;
};

export type TweetActions = {
  toggleLike: (tweetId: string) => Promise<void>;
  toggleRetweet: (tweetId: string) => Promise<void>;
  toggleBookmark: (tweetId: string) => Promise<void>;
};
