"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "@/types/pagination";
import type { TimelineItem, TweetActions } from "@/types/tweet";
import { getTimeline } from "@/features/feed/api/get-timeline";
import { TweetCard } from "@/components/tweet/tweet-card";
import { SpinnerRow } from "@/components/ui/spinner";

type TimelineFeedProps = {
  firstPage: Page<TimelineItem>;
  actions: TweetActions;
};

const emptyPage: Page<TimelineItem> = { items: [], nextCursor: null };

export function TimelineFeed({ firstPage, actions }: TimelineFeedProps) {
  const [rest, setRest] = useState(emptyPage);
  const latest = useRef({ firstPage, rest });
  const loading = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latest.current = { firstPage, rest };
  });

  const nextCursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;

  const reloadRest = useCallback(async () => {
    const { firstPage, rest } = latest.current;
    if (!rest.items.length) return;

    const page = firstPage.nextCursor
      ? await getTimeline(firstPage.nextCursor, rest.items.length)
      : emptyPage;
    startTransition(() => setRest(page));
  }, []);

  const loadMore = useCallback(async () => {
    const { firstPage, rest } = latest.current;
    const cursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;
    if (loading.current || !cursor) return;

    loading.current = true;
    const page = await getTimeline(cursor);
    setRest((current) => ({
      items: [...current.items, ...page.items],
      nextCursor: page.nextCursor,
    }));
    loading.current = false;
  }, []);

  useEffect(() => {
    reloadRest();
  }, [firstPage.nextCursor, reloadRest]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !nextCursor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "0px 0px 1000px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [nextCursor, loadMore]);

  const withReload =
    (action: (tweetId: string) => Promise<void>) => async (tweetId: string) => {
      await action(tweetId);
      await reloadRest();
    };

  const restActions: TweetActions = {
    toggleLike: withReload(actions.toggleLike),
    toggleRetweet: withReload(actions.toggleRetweet),
    toggleBookmark: withReload(actions.toggleBookmark),
  };

  const firstIds = new Set(firstPage.items.map(({ tweet }) => tweet.id));

  return (
    <>
      {firstPage.items.map(({ tweet, retweetedBy }) => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          retweetedBy={retweetedBy}
          actions={actions}
        />
      ))}
      {rest.items
        .filter(({ tweet }) => !firstIds.has(tweet.id))
        .map(({ tweet, retweetedBy }) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            retweetedBy={retweetedBy}
            actions={restActions}
          />
        ))}
      <div ref={sentinel}>
        {nextCursor ? <SpinnerRow label="Loading timeline" /> : null}
      </div>
    </>
  );
}
