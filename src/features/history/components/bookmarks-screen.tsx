"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Page } from "@/types/pagination";
import type { Tweet, TweetActions } from "@/types/tweet";
import { routes } from "@/config/routes";
import { HistoryHeader } from "@/features/history/components/history-header";
import { HistorySearchHeader } from "@/features/history/components/history-search-header";
import { HistoryTimeline } from "@/features/history/components/history-timeline";
import {
  BookmarksEmptyState,
  BookmarksNoResults,
} from "@/features/history/components/history-empty-state";

type BookmarksScreenProps = {
  query: string | null;
  firstPage: Page<Tweet>;
  actions: TweetActions;
};

export function BookmarksScreen({
  query,
  firstPage,
  actions,
}: BookmarksScreenProps) {
  const router = useRouter();
  const [searching, setSearching] = useState(query !== null);
  const showList = searching ? query !== null : query === null;

  function search(value: string) {
    router.replace(`${routes.history}?q=${encodeURIComponent(value)}`, {
      scroll: false,
    });
  }

  function exitSearch() {
    setSearching(false);
    if (query !== null) router.replace(routes.history, { scroll: false });
  }

  return (
    <>
      {searching ? (
        <HistorySearchHeader
          defaultValue={query ?? ""}
          onSubmit={search}
          onExit={exitSearch}
        />
      ) : (
        <HistoryHeader tab="bookmarks" onSearch={() => setSearching(true)} />
      )}
      {showList ? (
        <>
          <h1 className="sr-only">
            {query === null ? "Bookmarks" : "Bookmarks search"}
          </h1>
          <HistoryTimeline
            key={query ?? ""}
            tab="bookmarks"
            query={query}
            firstPage={firstPage}
            actions={actions}
            empty={
              query === null ? (
                <BookmarksEmptyState />
              ) : (
                <BookmarksNoResults query={query} />
              )
            }
          />
        </>
      ) : null}
    </>
  );
}
