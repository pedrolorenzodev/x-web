import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TweetCard } from "@/components/tweet/tweet-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getList } from "@/features/lists/api/get-list";
import { getListTweets } from "@/features/lists/api/get-list-tweets";
import { ListPageHeader } from "@/features/lists/components/list-page-header";
import { ListProfile } from "@/features/lists/components/list-profile";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function ListContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [list, tweets, session] = await Promise.all([
    getList(id),
    getListTweets(id),
    getSession(),
  ]);
  if (!list || !session) notFound();
  const isOwner = list.owner.id === session.user.id;

  return (
    <>
      <ListPageHeader list={list} isOwner={isOwner} />
      <ListProfile list={list} isOwner={isOwner} />
      {tweets.length ? (
        tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} actions={tweetActions} showReplyingTo />
        ))
      ) : (
        <EmptyState
          title="Waiting for posts"
          body="Posts from people in this List will show up here."
          className="max-w-[400px]"
        />
      )}
    </>
  );
}

export function ListScreen({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="pb-[200px]">
      <Suspense fallback={<SpinnerRow />}>
        <ListContent params={params} />
      </Suspense>
    </div>
  );
}
