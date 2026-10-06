"use client";

import { createContext, use, type ReactNode } from "react";

type TweetServices = {
  pinnedTweetId: string | null;
  deleteTweet: (tweetId: string) => Promise<void>;
  togglePinTweet: (tweetId: string) => Promise<void>;
};

const TweetServicesContext = createContext<TweetServices | null>(null);

export function TweetServicesProvider({
  children,
  ...services
}: TweetServices & { children: ReactNode }) {
  return (
    <TweetServicesContext value={services}>{children}</TweetServicesContext>
  );
}

export function useTweetServices() {
  return use(TweetServicesContext);
}
