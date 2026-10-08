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

export type CommunityNote = {
  id: string;
  text: string;
};

export type SensitiveMediaWarning = "adult_content" | "graphic_violence" | "other";

export type ReplySettings =
  | "everyone"
  | "following"
  | "following_extended"
  | "mentioned"
  | "verified";

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
  sensitiveMedia: SensitiveMediaWarning[];
  communityNote: CommunityNote | null;
  stats: TweetStats;
  likedByViewer: boolean;
  retweetedByViewer: boolean;
  bookmarkedByViewer: boolean;
  likedAt: string | null;
  bookmarkedAt: string | null;
  quotedTweet: QuotedTweet | null;
  quoteUnavailable?: boolean;
};

export type NestedQuote = Pick<
  Tweet,
  "id" | "author" | "text" | "createdAt"
> & {
  thumbnail: TweetMedia | null;
};

export type QuotedTweet = Pick<
  Tweet,
  "id" | "author" | "text" | "media" | "createdAt" | "replyingTo"
> & {
  nestedQuote?: NestedQuote | null;
  nestedQuoteUnavailable?: boolean;
};

export type TimelineItem = {
  tweet: Tweet;
  retweetedBy: UserSummary | null;
};

export type NewPollInput = {
  choices: string[];
  durationMinutes: number;
};

export type NewPost = {
  text: string;
  media: TweetMedia[];
  poll: NewPollInput | null;
};

export type NewTweetInput = {
  posts: NewPost[];
  replyToId: string | null;
  quotedId: string | null;
  replySettings: ReplySettings;
  scheduledAt: string | null;
  draftId: string | null;
};

export type TweetActions = {
  toggleLike: (tweetId: string) => Promise<void>;
  toggleRetweet: (tweetId: string) => Promise<void>;
  toggleBookmark: (tweetId: string) => Promise<void>;
};
