import type { Metadata } from "next";
import { Suspense } from "react";
import { TweetCard } from "@/components/tweet/tweet-card";
import { SpinnerRow } from "@/components/ui/spinner";
import { getCommunities } from "@/features/communities/api/get-communities";
import { getCommunitiesFeed } from "@/features/communities/api/get-community-posts";
import { shouldShowCommunitiesWelcome } from "@/features/communities/api/get-communities-welcome";
import { CommunitiesFeed } from "@/features/communities/components/communities-feed";
import { CommunitiesWelcome } from "@/features/communities/components/communities-welcome";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

export const metadata: Metadata = {
  title: "Communities / X",
};

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function CommunitiesHome() {
  const [communities, posts, showWelcome] = await Promise.all([
    getCommunities(),
    getCommunitiesFeed(),
    shouldShowCommunitiesWelcome(),
  ]);
  const byId = new Map(communities.map((community) => [community.id, community]));
  const items = posts.flatMap((tweet) => {
    const community = tweet.community ? byId.get(tweet.community.id) : null;
    if (!community) return [];
    return [
      {
        id: tweet.id,
        topic: community.topic,
        category: community.category,
        post: <TweetCard tweet={tweet} actions={tweetActions} />,
      },
    ];
  });

  return (
    <>
      <CommunitiesFeed items={items} />
      {showWelcome ? <CommunitiesWelcome /> : null}
    </>
  );
}

export default function CommunitiesExplorePage() {
  return (
    <div className="pb-[200px]">
      <Suspense fallback={<SpinnerRow />}>
        <CommunitiesHome />
      </Suspense>
    </div>
  );
}
