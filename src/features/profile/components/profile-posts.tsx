import { Fragment } from "react";
import type { TimelineItem, TweetActions } from "@/types/tweet";
import type { User } from "@/types/user";
import { TweetCard } from "@/components/tweet/tweet-card";
import { WhoToFollowModule } from "@/features/profile/components/who-to-follow-module";

const MODULE_AFTER = 5;

type ProfilePostsProps = {
  items: TimelineItem[];
  suggestions: User[];
  viewerId: string;
  actions: TweetActions;
};

export function ProfilePosts({
  items,
  suggestions,
  viewerId,
  actions,
}: ProfilePostsProps) {
  const moduleIndex = Math.min(MODULE_AFTER, items.length) - 1;
  const whoToFollow =
    suggestions.length > 0 ? (
      <WhoToFollowModule users={suggestions} viewerId={viewerId} />
    ) : null;

  if (items.length === 0) return whoToFollow;

  return items.map(({ tweet, retweetedBy }, index) => (
    <Fragment key={tweet.id}>
      <TweetCard tweet={tweet} retweetedBy={retweetedBy} actions={actions} />
      {index === moduleIndex ? whoToFollow : null}
    </Fragment>
  ));
}
