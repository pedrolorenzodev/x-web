"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Page } from "@/types/pagination";
import type { Tweet, TweetActions } from "@/types/tweet";
import { TweetCard } from "@/components/tweet/tweet-card";
import { SpinnerRow } from "@/components/ui/spinner";
import { getBookmarks } from "@/features/history/api/get-bookmarks";
import { getLikes } from "@/features/history/api/get-likes";
import type { HistoryTab } from "@/features/history/types/history-tab";

const REMOVAL_DELAY = 900;

type HistoryTimelineProps = {
  tab: HistoryTab;
  query?: string | null;
  firstPage: Page<Tweet>;
  actions: TweetActions;
  empty: ReactNode;
};

const emptyPage: Page<Tweet> = { items: [], nextCursor: null };

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function HistoryTimeline({
  tab,
  query = null,
  firstPage,
  actions,
  empty,
}: HistoryTimelineProps) {
  const [rest, setRest] = useState(emptyPage);
  const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());
  const latest = useRef({ firstPage, rest });
  const loading = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latest.current = { firstPage, rest };
  });

  const nextCursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;

  const loadMore = useCallback(async () => {
    const { firstPage, rest } = latest.current;
    const cursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;
    if (loading.current || !cursor) return;

    loading.current = true;
    const page =
      tab === "bookmarks"
        ? await getBookmarks(cursor, query)
        : await getLikes(cursor);
    setRest((current) => ({
      items: [...current.items, ...page.items],
      nextCursor: page.nextCursor,
    }));
    loading.current = false;
  }, [tab, query]);

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

  const removeLater =
    (action: (tweetId: string) => Promise<void>) => async (tweetId: string) => {
      await wait(REMOVAL_DELAY);
      await action(tweetId);
      setRemoved((current) => {
        const next = new Set(current);
        if (!next.delete(tweetId)) next.add(tweetId);
        return next;
      });
    };

  const listActions: TweetActions =
    tab === "bookmarks"
      ? { ...actions, toggleBookmark: removeLater(actions.toggleBookmark) }
      : { ...actions, toggleLike: removeLater(actions.toggleLike) };

  const firstIds = new Set(firstPage.items.map((tweet) => tweet.id));
  const tweets = [
    ...firstPage.items,
    ...rest.items.filter((tweet) => !firstIds.has(tweet.id)),
  ].filter((tweet) => !removed.has(tweet.id));

  if (!tweets.length && !nextCursor) return empty;

  return (
    <>
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          actions={listActions}
          showReplyingTo
        />
      ))}
      <div ref={sentinel}>
        {nextCursor ? <SpinnerRow label="Loading posts" /> : null}
      </div>
    </>
  );
}
