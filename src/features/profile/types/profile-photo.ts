import type { TweetMedia } from "@/types/tweet";

export type ProfilePhoto = {
  tweetId: string;
  handle: string;
  photo: TweetMedia;
  count: number;
};
