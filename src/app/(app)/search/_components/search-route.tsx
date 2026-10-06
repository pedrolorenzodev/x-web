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
import type { SearchSource, SearchTab } from "@/features/search/types/search-tab";
import {
  advancedSearchHref,
  searchTabHref,
  sourceQuery,
} from "@/features/search/utils/search-tabs";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import type { Tweet } from "@/types/tweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };
const PEOPLE_MODULE_SIZE = 3;

type SearchRouteProps = {
  source: SearchSource;
  tab: SearchTab;
};

function TweetList({ tweets }: { tweets: Tweet[] }) {
  return tweets.map((tweet) => (
    <TweetCard key={tweet.id} tweet={tweet} actions={tweetActions} showReplyingTo />
  ));
}

async function SearchResults({ source, tab }: SearchRouteProps) {
  const query = sourceQuery(source);
  const session = await getSession();
  if (!session) notFound();
  const viewerId = session.user.id;
  const empty = <SearchEmptyState query={query} />;

  if (tab === "top") {
    const [users, tweets] = await Promise.all([
      searchUsers(query, PEOPLE_MODULE_SIZE),
      searchTweets(query, "top"),
    ]);
    if (!users.length && !tweets.length) return empty;
    return (
      <>
        {users.length ? (
          <PeopleModule
            users={users}
            viewAllHref={searchTabHref(source, "user")}
            viewerId={viewerId}
            toggleFollow={toggleFollow}
          />
        ) : null}
        <TweetList tweets={tweets} />
      </>
    );
  }

  if (tab === "live") {
    const tweets = await searchTweets(query, "latest");
    return tweets.length ? <TweetList tweets={tweets} /> : empty;
  }

  if (tab === "user") {
    const users = await searchUsers(query);
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
    const tweets = await searchMediaTweets(query);
    return tweets.length ? <MediaGrid tweets={tweets} /> : empty;
  }

  const lists = await searchLists(query);
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

export function SearchRoute({ source, tab }: SearchRouteProps) {
  const query = sourceQuery(source);

  return (
    <div className="min-h-dvh pb-16">
      <SearchHeader query={query} advancedHref={advancedSearchHref(source)}>
        <SearchTabs source={source} active={tab} />
      </SearchHeader>
      <Suspense key={`${query}-${tab}`} fallback={<SpinnerRow />}>
        <SearchResults source={source} tab={tab} />
      </Suspense>
    </div>
  );
}
