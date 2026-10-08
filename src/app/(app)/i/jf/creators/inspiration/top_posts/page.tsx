import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { SpinnerRow } from "@/components/ui/spinner";
import { TweetCard } from "@/components/tweet/tweet-card";
import { getTopPosts } from "@/features/creator-studio/api/get-top-posts";
import { InspirationHeader } from "@/features/creator-studio/components/inspiration-header";
import { inspirationCountry } from "@/features/creator-studio/config/creator-studio";
import { parseInspirationParams } from "@/features/creator-studio/utils/parse-inspiration-params";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

export const metadata: Metadata = {
  title: "Inspiration / X",
};

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

type InspirationProps = Pick<
  PageProps<"/i/jf/creators/inspiration/top_posts">,
  "searchParams"
>;

async function Inspiration({ searchParams }: InspirationProps) {
  const { window, sort } = parseInspirationParams(await searchParams);
  const posts = await getTopPosts(window, sort);

  return (
    <>
      <InspirationHeader
        window={window}
        sort={sort}
        country={inspirationCountry}
      />
      {posts.length > 0 ? (
        posts.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} actions={tweetActions} />
        ))
      ) : (
        <EmptyState
          title="No top posts yet"
          body="Posts with the most engagement in this time range will show up here."
        />
      )}
    </>
  );
}

export default function InspirationPage({ searchParams }: InspirationProps) {
  return (
    <Suspense fallback={<SpinnerRow label="Loading top posts" />}>
      <Inspiration searchParams={searchParams} />
    </Suspense>
  );
}
