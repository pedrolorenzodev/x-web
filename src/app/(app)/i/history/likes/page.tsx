import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { getLikes } from "@/features/history/api/get-likes";
import { LikesEmptyState } from "@/features/history/components/history-empty-state";
import { HistoryHeader } from "@/features/history/components/history-header";
import { HistoryTimeline } from "@/features/history/components/history-timeline";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

export const metadata: Metadata = {
  title: "History / X",
};

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Likes() {
  const firstPage = await getLikes();

  return (
    <HistoryTimeline
      tab="likes"
      firstPage={firstPage}
      actions={tweetActions}
      empty={<LikesEmptyState />}
    />
  );
}

export default function HistoryLikesPage() {
  return (
    <>
      <HistoryHeader tab="likes" />
      <h1 className="sr-only">Likes</h1>
      <Suspense fallback={<SpinnerRow label="Loading likes" />}>
        <Likes />
      </Suspense>
    </>
  );
}
