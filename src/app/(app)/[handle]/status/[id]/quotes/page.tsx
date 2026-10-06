import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { TweetCard } from "@/components/tweet/tweet-card";
import { getSession } from "@/features/auth/api/get-session";
import { getConversation } from "@/features/tweet/api/get-conversation";
import { getQuotes } from "@/features/tweet/api/get-post-activity";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import { PostActivity } from "@/features/tweet/components/post-activity";

export const metadata: Metadata = { title: "Post activity / X" };

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Quotes({ params }: Pick<PageProps<"/[handle]/status/[id]/quotes">, "params">) {
  const { id } = await params;
  const [conversation, quotes, session] = await Promise.all([
    getConversation(id),
    getQuotes(id),
    getSession(),
  ]);
  if (!conversation || !session) notFound();
  const { tweet } = conversation;

  return (
    <PostActivity
      handle={tweet.author.handle}
      tweetId={tweet.id}
      active="quotes"
      showLikes={tweet.author.id === session.user.id}
    >
      {quotes.length === 0 ? (
        <EmptyState
          title="No Quotes yet"
          body="You will find a list of everyone who quoted this post here."
        />
      ) : (
        quotes.map((quote) => (
          <TweetCard key={quote.id} tweet={quote} actions={tweetActions} />
        ))
      )}
    </PostActivity>
  );
}

export default function QuotesPage({ params }: PageProps<"/[handle]/status/[id]/quotes">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Quotes params={params} />
    </Suspense>
  );
}
