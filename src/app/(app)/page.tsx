import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { redirect } from "next/navigation";
import { TimelineHeader } from "@/features/feed/components/timeline-header";
import { TimelineFeed } from "@/features/feed/components/timeline-feed";
import { Composer } from "@/features/compose/components/composer";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { getTimeline } from "@/features/feed/api/get-timeline";
import { getTimelineKind } from "@/features/feed/api/get-timeline-kind";
import { TimelineTabsProvider } from "@/features/feed/components/timeline-tabs-provider";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";

export const metadata: Metadata = {
  title: "Home / X",
};

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Header() {
  const kind = await getTimelineKind();

  return <TimelineHeader kind={kind} />;
}

async function Timeline() {
  const kind = await getTimelineKind();
  const firstPage = await getTimeline(kind);

  return (
    <TimelineFeed
      key={kind}
      kind={kind}
      firstPage={firstPage}
      actions={tweetActions}
    />
  );
}

async function ViewerComposer() {
  const session = await getSession();
  if (!session) redirect(routes.expiredSession);

  return <Composer viewer={session.user} />;
}

export default function HomePage() {
  return (
    <TimelineTabsProvider>
      <Suspense fallback={<TimelineHeader kind={null} />}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        <ViewerComposer />
      </Suspense>
      <div className="pb-[200px]">
        <Suspense fallback={<SpinnerRow label="Loading timeline" />}>
          <Timeline />
        </Suspense>
      </div>
    </TimelineTabsProvider>
  );
}
