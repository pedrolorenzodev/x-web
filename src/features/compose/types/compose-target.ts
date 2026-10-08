import type { Draft } from "@/types/draft";
import type { Tweet } from "@/types/tweet";

export type ComposeTarget = {
  kind: "reply" | "quote";
  tweet: Tweet;
};

export type ComposeSetup = {
  target: ComposeTarget | null;
  draft: Draft | null;
  text: string;
};

export type ComposeSearchParams = {
  in_reply_to?: string | string[];
  quote?: string | string[];
  draft?: string | string[];
  text?: string | string[];
};
