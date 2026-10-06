import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { notFound, redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { TweetCard } from "@/components/tweet/tweet-card";
import { ScrollAnchor } from "@/components/ui/scroll-anchor";
import { getSession } from "@/features/auth/api/get-session";
import { ReplyComposer } from "@/features/compose/components/reply-composer";
import { getConversation } from "@/features/tweet/api/get-conversation";
import { getReplies } from "@/features/tweet/api/get-replies";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import { FocalTweet } from "@/features/tweet/components/focal-tweet";
import { RepliesSection } from "@/features/tweet/components/replies-section";
import { getProfile } from "@/features/profile/api/get-profile";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Conversation({
  params,
}: {
  params: PageProps<"/[handle]/status/[id]">["params"];
}) {
  const { handle, id } = await params;
  const [conversation, replies, session] = await Promise.all([
    getConversation(id),
    getReplies(id, null, 100),
    getSession(),
  ]);
  if (!conversation || !session) notFound();

  const { ancestors, tweet } = conversation;
  if (tweet.author.handle.toLowerCase() !== handle.toLowerCase()) {
    redirect(routes.tweet(tweet.author.handle, tweet.id));
  }
  const author = await getProfile(tweet.author.handle);
  const showFollow =
    tweet.author.id !== session.user.id && !author?.followedByViewer;

  return (
    <>
      {ancestors.map((ancestor) => (
        <TweetCard
          key={ancestor.id}
          tweet={ancestor}
          actions={tweetActions}
          threaded
        />
      ))}
      <div className="min-h-[calc(100dvh-43px)] pb-[200px]">
        {ancestors.length > 0 ? (
          <ScrollAnchor className="scroll-mt-[43px]" />
        ) : null}
        <FocalTweet
          tweet={tweet}
          actions={tweetActions}
          threaded={ancestors.length > 0}
          showFollow={showFollow}
          toggleFollow={toggleFollow}
        />
        <RepliesSection
          replies={replies.items}
          quotesHref={routes.tweetQuotes(tweet.author.handle, tweet.id)}
          actions={tweetActions}
          composer={
            <ReplyComposer
              viewer={session.user}
              replyTo={tweet.author}
              tweetId={tweet.id}
            />
          }
        />
      </div>
    </>
  );
}

export default function TweetPage({
  params,
}: PageProps<"/[handle]/status/[id]">) {
  return (
    <>
      <PageHeader title="Post" />
      <Suspense fallback={<SpinnerRow />}>
        <Conversation params={params} />
      </Suspense>
    </>
  );
}
