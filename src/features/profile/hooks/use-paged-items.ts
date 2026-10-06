"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "@/types/pagination";
import type { TweetActions } from "@/types/tweet";

export type PageLoader<T> = (cursor: string, limit?: number) => Promise<Page<T>>;

const PRELOAD_MARGIN = "0px 0px 1000px 0px";

export function usePagedItems<T>(
  firstPage: Page<T>,
  load: PageLoader<T>,
  getKey: (item: T) => string,
) {
  const [rest, setRest] = useState<Page<T>>({ items: [], nextCursor: null });
  const latest = useRef({ firstPage, rest, load });
  const loading = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latest.current = { firstPage, rest, load };
  });

  const nextCursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;

  const loadMore = useCallback(async () => {
    const { firstPage, rest, load } = latest.current;
    const cursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;
    if (loading.current || !cursor) return;

    loading.current = true;
    const page = await load(cursor);
    setRest((current) => ({
      items: [...current.items, ...page.items],
      nextCursor: page.nextCursor,
    }));
    loading.current = false;
  }, []);

  const reloadRest = useCallback(async () => {
    const { firstPage, rest, load } = latest.current;
    if (!rest.items.length || !firstPage.nextCursor) return;

    const page = await load(firstPage.nextCursor, rest.items.length);
    startTransition(() => setRest(page));
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !nextCursor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [nextCursor, loadMore]);

  const firstKeys = new Set(firstPage.items.map(getKey));
  const restItems = rest.items.filter((item) => !firstKeys.has(getKey(item)));

  function withReload(actions: TweetActions): TweetActions {
    const reloading =
      (action: (tweetId: string) => Promise<void>) =>
      async (tweetId: string) => {
        await action(tweetId);
        await reloadRest();
      };

    return {
      toggleLike: reloading(actions.toggleLike),
      toggleRetweet: reloading(actions.toggleRetweet),
      toggleBookmark: reloading(actions.toggleBookmark),
    };
  }

  return { restItems, nextCursor, sentinelRef, withReload };
}
