import type { UserSummary } from "@/types/user";

export type TweetStats = {
  replies: number;
  retweets: number;
  quotes: number;
  likes: number;
  bookmarks: number;
  views: number;
};

export type TweetMedia = {
  type: "photo" | "video";
  url: string;
  width: number;
  height: number;
  alt: string;
  videoUrl?: string;
  durationMs?: number;
  isGif?: boolean;
};

export type ReplySettings = "everyone" | "following" | "verified" | "mentioned";

export type PollOption = {
  label: string;
  votes: number;
};

export type Poll = {
  options: PollOption[];
  endsAt: string;
  viewerVoteIndex: number | null;
};

export type LinkCard = {
  kind: "summary" | "summary_large_image";
  url: string;
  domain: string;
  title: string;
  description?: string;
  imageUrl: string;
};

export type TweetCommunity = {
  id: string;
  name: string;
};

export type Tweet = {
  id: string;
  author: UserSummary;
  text: string;
  media: TweetMedia[];
  createdAt: string;
  editedAt: string | null;
  replyingTo: UserSummary | null;
  replySettings: ReplySettings;
  poll?: Poll;
  card?: LinkCard;
  community?: TweetCommunity;
  sensitive: boolean;
  stats: TweetStats;
  likedByViewer: boolean;
  retweetedByViewer: boolean;
  bookmarkedByViewer: boolean;
  likedAt: string | null;
  bookmarkedAt: string | null;
  quotedTweet: QuotedTweet | null;
};

export type QuotedTweet = Pick<
  Tweet,
  "id" | "author" | "text" | "media" | "createdAt" | "replyingTo"
>;

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
