import type { Tweet } from "@/types/tweet";

export type ProfileReply = {
  parent: Tweet | null;
  reply: Tweet;
};
