import { Fragment } from "react";
import type { TweetActions } from "@/types/tweet";
import type { ProfileReply } from "@/features/profile/types/profile-reply";
import { TweetCard } from "@/components/tweet/tweet-card";

type ProfileRepliesProps = {
  items: ProfileReply[];
  actions: TweetActions;
};

export function ProfileReplies({ items, actions }: ProfileRepliesProps) {
  return items.map(({ parent, reply }) => (
    <Fragment key={reply.id}>
      {parent ? (
        <TweetCard tweet={parent} actions={actions} threaded />
      ) : null}
      <TweetCard tweet={reply} actions={actions} />
    </Fragment>
  ));
}
