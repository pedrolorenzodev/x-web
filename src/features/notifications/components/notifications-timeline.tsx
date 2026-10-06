"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Notification, NotificationTab } from "@/types/notification";
import type { Page } from "@/types/pagination";
import type { TweetActions } from "@/types/tweet";
import { TweetCard } from "@/components/tweet/tweet-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SpinnerRow } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getNotifications } from "@/features/notifications/api/get-notifications";
import { markNotificationsRead } from "@/features/notifications/api/mark-notifications-read";
import { NotificationRow } from "@/features/notifications/components/notification-row";

type NotificationsTimelineProps = {
  tab: NotificationTab;
  firstPage: Page<Notification>;
  hasUnread: boolean;
  viewerHandle: string;
  actions: TweetActions;
};

const emptyPage: Page<Notification> = { items: [], nextCursor: null };

const emptyCopy: Record<NotificationTab, string> = {
  all: "From likes to reposts and a whole lot more, this is where all the action happens.",
  mentions: "When someone mentions you, you’ll find it here.",
};

function unreadIds(page: Page<Notification>) {
  return new Set(
    page.items.flatMap((notification) =>
      notification.read ? [] : notification.id,
    ),
  );
}

type NotificationItemProps = {
  notification: Notification;
  unread: boolean;
  viewerHandle: string;
  actions: TweetActions;
};

function NotificationItem({
  notification,
  unread,
  viewerHandle,
  actions,
}: NotificationItemProps) {
  switch (notification.type) {
    case "mention":
    case "reply":
    case "quote":
      return (
        <div className={cn(unread && "bg-accent/10")}>
          <TweetCard
            tweet={notification.tweet}
            actions={actions}
            showReplyingTo
          />
        </div>
      );
    default:
      return (
        <NotificationRow
          notification={notification}
          viewerHandle={viewerHandle}
          unread={unread}
        />
      );
  }
}

export function NotificationsTimeline({
  tab,
  firstPage,
  hasUnread,
  viewerHandle,
  actions,
}: NotificationsTimelineProps) {
  const [rest, setRest] = useState(emptyPage);
  const [unread] = useState(() => unreadIds(firstPage));
  const latest = useRef({ firstPage, rest });
  const loading = useRef(false);
  const markedRead = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latest.current = { firstPage, rest };
  });

  useEffect(() => {
    if (!hasUnread || markedRead.current) return;
    markedRead.current = true;
    markNotificationsRead();
  }, [hasUnread]);

  const nextCursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;

  const reloadRest = useCallback(async () => {
    const { firstPage, rest } = latest.current;
    if (!rest.items.length || !firstPage.nextCursor) return;

    const page = await getNotifications(
      tab,
      firstPage.nextCursor,
      rest.items.length,
    );
    startTransition(() => setRest(page));
  }, [tab]);

  const loadMore = useCallback(async () => {
    const { firstPage, rest } = latest.current;
    const cursor = rest.items.length ? rest.nextCursor : firstPage.nextCursor;
    if (loading.current || !cursor) return;

    loading.current = true;
    const page = await getNotifications(tab, cursor);
    setRest((current) => ({
      items: [...current.items, ...page.items],
      nextCursor: page.nextCursor,
    }));
    loading.current = false;
  }, [tab]);

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

  if (firstPage.items.length === 0) {
    return <EmptyState title="Nothing to see here — yet" body={emptyCopy[tab]} />;
  }

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

  const firstIds = new Set(firstPage.items.map(({ id }) => id));

  return (
    <>
      {firstPage.items.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          unread={unread.has(notification.id)}
          viewerHandle={viewerHandle}
          actions={actions}
        />
      ))}
      {rest.items
        .filter(({ id }) => !firstIds.has(id))
        .map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            unread={unread.has(notification.id)}
            viewerHandle={viewerHandle}
            actions={restActions}
          />
        ))}
      <div ref={sentinel}>
        {nextCursor ? <SpinnerRow label="Loading notifications" /> : null}
      </div>
    </>
  );
}
