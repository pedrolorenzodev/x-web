"use client";

import { Fragment, type ReactNode } from "react";
import type { Page } from "@/types/pagination";
import type { TweetActions } from "@/types/tweet";
import type { ProfileReply } from "@/features/profile/types/profile-reply";
import { TweetCard } from "@/components/tweet/tweet-card";
import { SpinnerRow } from "@/components/ui/spinner";
import { getProfileReplies } from "@/features/profile/api/get-profile-replies";
import { usePagedItems } from "@/features/profile/hooks/use-paged-items";

type ProfileRepliesProps = {
  handle: string;
  firstPage: Page<ProfileReply>;
  actions: TweetActions;
  empty: ReactNode;
};

function replyKey({ reply }: ProfileReply) {
  return reply.id;
}

function ReplyThread({
  item,
  actions,
}: {
  item: ProfileReply;
  actions: TweetActions;
}) {
  return (
    <>
      {item.parent ? (
        <TweetCard tweet={item.parent} actions={actions} threaded />
      ) : null}
      <TweetCard tweet={item.reply} actions={actions} />
    </>
  );
}

export function ProfileReplies({
  handle,
  firstPage,
  actions,
  empty,
}: ProfileRepliesProps) {
  const { restItems, nextCursor, sentinelRef, withReload } = usePagedItems(
    firstPage,
    (cursor, limit) => getProfileReplies(handle, cursor, limit),
    replyKey,
  );
  const restActions = withReload(actions);

  if (firstPage.items.length === 0) return empty;

  return (
    <>
      {firstPage.items.map((item) => (
        <Fragment key={replyKey(item)}>
          <ReplyThread item={item} actions={actions} />
        </Fragment>
      ))}
      {restItems.map((item) => (
        <Fragment key={replyKey(item)}>
          <ReplyThread item={item} actions={restActions} />
        </Fragment>
      ))}
      <div ref={sentinelRef}>
        {nextCursor ? <SpinnerRow label="Loading replies" /> : null}
      </div>
    </>
  );
}
