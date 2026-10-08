import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { TweetCard } from "@/components/tweet/tweet-card";
import { UserCell } from "@/components/user/user-cell";
import { getSession } from "@/features/auth/api/get-session";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import {
  searchLists,
  searchMediaTweets,
  searchTweets,
  searchUsers,
} from "@/features/search/api/search";
import { toggleListFollow } from "@/features/search/api/toggle-list-follow";
import { ListCell } from "@/features/search/components/list-cell";
import { MediaGrid } from "@/features/search/components/media-grid";
import { PeopleModule } from "@/features/search/components/people-module";
import { SearchEmptyState } from "@/features/search/components/search-empty-state";
import { SearchHeader } from "@/features/search/components/search-header";
import { SearchTabs } from "@/features/search/components/search-tabs";
import type {
  SearchFilters,
  SearchSource,
  SearchTab,
} from "@/features/search/types/search-tab";
import {
  advancedSearchHref,
  searchTabHref,
  sourceQuery,
} from "@/features/search/utils/search-tabs";
import { parseQuery } from "@/features/search/utils/match-query";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import type { Tweet } from "@/types/tweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };
const PEOPLE_MODULE_SIZE = 3;

type SearchRouteProps = {
  source: SearchSource;
  tab: SearchTab;
  filters: SearchFilters;
};

function highlightTerms(query: string) {
  const { words, phrases } = parseQuery(query);
  return [...phrases, ...words];
}

function TweetList({ tweets, query }: { tweets: Tweet[]; query: string }) {
  const terms = highlightTerms(query);
  return tweets.map((tweet) => (
    <TweetCard
      key={tweet.id}
      tweet={tweet}
      actions={tweetActions}
      showReplyingTo
      highlightTerms={terms}
    />
  ));
}

async function SearchResults({ source, tab, filters }: SearchRouteProps) {
  const query = sourceQuery(source);
  const session = await getSession();
  if (!session) notFound();
  const viewerId = session.user.id;
  const empty = <SearchEmptyState query={query} />;

  if (tab === "top") {
    const [users, tweets] = await Promise.all([
      searchUsers(query, PEOPLE_MODULE_SIZE, filters),
      searchTweets(query, "top", filters),
    ]);
    if (!users.length && !tweets.length) return empty;
    return (
      <>
        {users.length ? (
          <PeopleModule
            users={users}
            viewAllHref={searchTabHref(source, "user", filters)}
            viewerId={viewerId}
            toggleFollow={toggleFollow}
          />
        ) : null}
        <TweetList tweets={tweets} query={query} />
      </>
    );
  }

  if (tab === "live") {
    const tweets = await searchTweets(query, "latest", filters);
    return tweets.length ? (
      <TweetList tweets={tweets} query={query} />
    ) : (
      empty
    );
  }

  if (tab === "user") {
    const users = await searchUsers(query, undefined, filters);
    return users.length
      ? users.map((user) => (
          <UserCell
            key={user.id}
            user={user}
            viewerId={viewerId}
            toggleFollow={toggleFollow}
          />
        ))
      : empty;
  }

  if (tab === "media") {
    const tweets = await searchMediaTweets(query, filters);
    return tweets.length ? <MediaGrid tweets={tweets} /> : empty;
  }

  const lists = await searchLists(query, filters);
  return lists.length
    ? lists.map((list) => (
        <ListCell
          key={list.id}
          list={list}
          viewerId={viewerId}
          toggleListFollow={toggleListFollow}
        />
      ))
    : empty;
}

export function SearchRoute({ source, tab, filters }: SearchRouteProps) {
  const query = sourceQuery(source);

  return (
    <div className="min-h-dvh pb-16">
      <SearchHeader query={query} advancedHref={advancedSearchHref(source)}>
        <SearchTabs source={source} active={tab} filters={filters} />
      </SearchHeader>
      <Suspense
        key={`${query}-${tab}-${filters.peopleYouFollow}-${filters.nearYou}`}
        fallback={<SpinnerRow />}
      >
        <SearchResults source={source} tab={tab} filters={filters} />
      </Suspense>
    </div>
  );
}
