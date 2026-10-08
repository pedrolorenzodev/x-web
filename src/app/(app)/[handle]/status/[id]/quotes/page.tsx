import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Tweet } from "@/types/tweet";
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

function renderQuotes(quotes: Tweet[]) {
  if (quotes.length === 0) {
    return (
      <EmptyState
        title="No Quotes yet"
        body="You will find a list of everyone who quoted this post here."
      />
    );
  }
  return quotes.map((quote) => (
    <TweetCard key={quote.id} tweet={quote} actions={tweetActions} />
  ));
}

async function Quotes({ params }: Pick<PageProps<"/[handle]/status/[id]/quotes">, "params">) {
  const { id } = await params;
  const [conversation, top, recent, session] = await Promise.all([
    getConversation(id),
    getQuotes(id, "top"),
    getQuotes(id, "recent"),
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
      lists={{ top: renderQuotes(top), recent: renderQuotes(recent) }}
    />
  );
}

export default function QuotesPage({ params }: PageProps<"/[handle]/status/[id]/quotes">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Quotes params={params} />
    </Suspense>
  );
}
