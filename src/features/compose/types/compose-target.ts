import type { Tweet } from "@/types/tweet";

export type ComposeTarget = {
  kind: "reply" | "quote";
  tweet: Tweet;
};

export type ComposeSearchParams = {
  in_reply_to?: string | string[];
  quote?: string | string[];
};
