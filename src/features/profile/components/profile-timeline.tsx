"use client";

import { Fragment, type ReactNode } from "react";
import type { Page } from "@/types/pagination";
import type { TimelineItem, Tweet, TweetActions } from "@/types/tweet";
import { TweetCard } from "@/components/tweet/tweet-card";
import { SpinnerRow } from "@/components/ui/spinner";
import { getProfileTweets } from "@/features/profile/api/get-profile-tweets";
import { getProfileReposts } from "@/features/profile/api/get-profile-reposts";
import { getProfileVideos } from "@/features/profile/api/get-profile-media";
import {
  usePagedItems,
  type PageLoader,
} from "@/features/profile/hooks/use-paged-items";
import type {
  ProfilePostsFilter,
  ProfileSort,
} from "@/features/profile/types/profile-tab";
import { timelineItemKey } from "@/features/profile/utils/timeline-item-key";

const MODULE_AFTER = 5;

export type ProfileTimelineSource =
  | { kind: "posts"; filter: ProfilePostsFilter; sort: ProfileSort }
  | { kind: "reposts" }
  | { kind: "videos" };

type ProfileTimelineProps = {
  handle: string;
  source: ProfileTimelineSource;
  firstPage: Page<TimelineItem>;
  pinned?: Tweet | null;
  actions: TweetActions;
  module?: ReactNode;
  empty?: ReactNode;
};

function loaderFor(
  handle: string,
  source: ProfileTimelineSource,
): PageLoader<TimelineItem> {
  switch (source.kind) {
    case "posts":
      return (cursor, limit) =>
        getProfileTweets(handle, source.filter, source.sort, cursor, limit);
    case "reposts":
      return (cursor, limit) => getProfileReposts(handle, cursor, limit);
    case "videos":
      return (cursor, limit) => getProfileVideos(handle, cursor, limit);
  }
}

export function ProfileTimeline({
  handle,
  source,
  firstPage,
  pinned = null,
  actions,
  module = null,
  empty = null,
}: ProfileTimelineProps) {
  const { restItems, nextCursor, sentinelRef, withReload } = usePagedItems(
    firstPage,
    loaderFor(handle, source),
    timelineItemKey,
  );
  const restActions = withReload(actions);

  const cards = [
    ...(pinned
      ? [
          <TweetCard
            key={`pinned-${pinned.id}`}
            tweet={pinned}
            pinned
            actions={actions}
          />,
        ]
      : []),
    ...firstPage.items.map((item) => (
      <TweetCard
        key={timelineItemKey(item)}
        tweet={item.tweet}
        retweetedBy={item.retweetedBy}
        actions={actions}
      />
    )),
    ...restItems.map((item) => (
      <TweetCard
        key={timelineItemKey(item)}
        tweet={item.tweet}
        retweetedBy={item.retweetedBy}
        actions={restActions}
      />
    )),
  ];

  if (cards.length === 0) {
    return (
      <>
        {empty}
        {module}
      </>
    );
  }

  const moduleIndex = Math.min(MODULE_AFTER, cards.length) - 1;

  return (
    <>
      {cards.map((card, index) => (
        <Fragment key={card.key}>
          {card}
          {index === moduleIndex ? module : null}
        </Fragment>
      ))}
      <div ref={sentinelRef}>
        {nextCursor ? <SpinnerRow label="Loading posts" /> : null}
      </div>
    </>
  );
}
