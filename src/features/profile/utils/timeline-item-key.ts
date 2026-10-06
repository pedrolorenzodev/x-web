import type { TimelineItem } from "@/types/tweet";

export function timelineItemKey({ tweet, retweetedBy }: TimelineItem) {
  return retweetedBy ? `repost-${tweet.id}` : tweet.id;
}
