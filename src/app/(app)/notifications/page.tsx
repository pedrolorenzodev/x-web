import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { getSession } from "@/features/auth/api/get-session";
import { getNotifications } from "@/features/notifications/api/get-notifications";
import { getUnreadNotificationCount } from "@/features/notifications/api/get-unread-notification-count";
import { NotificationsTimeline } from "@/features/notifications/components/notifications-timeline";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

export const metadata: Metadata = {
  title: "Notifications / X",
};

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function AllNotifications() {
  const [session, firstPage, unreadCount] = await Promise.all([
    getSession(),
    getNotifications("all"),
    getUnreadNotificationCount(),
  ]);
  if (!session) redirect(routes.expiredSession);

  return (
    <NotificationsTimeline
      tab="all"
      firstPage={firstPage}
      hasUnread={unreadCount > 0}
      viewerHandle={session.user.handle}
      actions={tweetActions}
    />
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<SpinnerRow label="Loading notifications" />}>
      <AllNotifications />
    </Suspense>
  );
}
