import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TimelineHeader } from "@/features/feed/components/timeline-header";
import { Composer } from "@/features/compose/components/composer";
import { getSession } from "@/features/auth/api/get-session";
import { getTimeline } from "@/features/feed/api/get-timeline";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { TweetCard } from "@/components/tweet/tweet-card";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Timeline() {
  const timeline = await getTimeline();

  return timeline.items.map(({ tweet, retweetedBy }) => (
    <TweetCard
      key={tweet.id}
      tweet={tweet}
      retweetedBy={retweetedBy}
      actions={tweetActions}
    />
  ));
}

export default async function HomePage() {
  const session = await getSession();
  if (!session) notFound();

  return (
    <>
      <TimelineHeader />
      <Composer viewer={session.user} />
      <div className="pb-[200px]">
        <Suspense fallback={null}>
          <Timeline />
        </Suspense>
      </div>
    </>
  );
}
