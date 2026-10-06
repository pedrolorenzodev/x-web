import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { getBookmarks } from "@/features/history/api/get-bookmarks";
import { BookmarksScreen } from "@/features/history/components/bookmarks-screen";
import { HistoryHeader } from "@/features/history/components/history-header";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

export const metadata: Metadata = {
  title: "History / X",
};

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

function readQuery(value: string | string[] | undefined) {
  const query = (Array.isArray(value) ? value[0] : value)?.trim();
  return query ? query : null;
}

async function Bookmarks({ searchParams }: Pick<PageProps<"/i/history">, "searchParams">) {
  const query = readQuery((await searchParams).q);
  const firstPage = await getBookmarks(null, query);

  return (
    <BookmarksScreen
      key={query === null ? "browse" : "search"}
      query={query}
      firstPage={firstPage}
      actions={tweetActions}
    />
  );
}

export default function HistoryPage({ searchParams }: PageProps<"/i/history">) {
  return (
    <Suspense
      fallback={
        <>
          <HistoryHeader tab="bookmarks" />
          <SpinnerRow label="Loading bookmarks" />
        </>
      }
    >
      <Bookmarks searchParams={searchParams} />
    </Suspense>
  );
}
