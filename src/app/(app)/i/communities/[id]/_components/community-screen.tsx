import { Suspense } from "react";
import { notFound } from "next/navigation";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { TweetCard } from "@/components/tweet/tweet-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getCommunity } from "@/features/communities/api/get-community";
import { getCommunityMembers } from "@/features/communities/api/get-community-members";
import { getCommunityPosts } from "@/features/communities/api/get-community-posts";
import { CommunitiesSearchLink } from "@/features/communities/components/communities-search-link";
import { CommunityAbout } from "@/features/communities/components/community-about";
import { CommunityHashtags } from "@/features/communities/components/community-hashtags";
import { CommunityMediaGrid } from "@/features/communities/components/community-media-grid";
import { CommunityMoreMenu } from "@/features/communities/components/community-more-menu";
import { CommunityProfile } from "@/features/communities/components/community-profile";
import {
  CommunityTabs,
  type CommunityFeedTab,
} from "@/features/communities/components/community-tabs";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";
import type { Tweet } from "@/types/tweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

export type CommunityScreenTab = CommunityFeedTab | "about";

function PostList({ tweets, empty }: { tweets: Tweet[]; empty: string }) {
  if (tweets.length === 0) {
    return <EmptyState title="Nothing to see here — yet" body={empty} />;
  }
  return tweets.map((tweet) => (
    <TweetCard key={tweet.id} tweet={tweet} actions={tweetActions} />
  ));
}

async function CommunityContent({
  id,
  tab,
}: {
  id: string;
  tab: CommunityScreenTab;
}) {
  const [community, session] = await Promise.all([getCommunity(id), getSession()]);
  if (!community || !session) notFound();

  const header = (
    <PageHeader
      title={community.name}
      action={
        <div className="flex items-center gap-2">
          <CommunitiesSearchLink href={routes.communitySearch(community.id)} />
          <CommunityMoreMenu />
        </div>
      }
    />
  );

  if (tab === "about") {
    const members = (await getCommunityMembers(id)) ?? [];
    return (
      <>
        {header}
        <CommunityProfile community={community} />
        <CommunityTabs communityId={community.id} initialTab="about">
          <CommunityAbout
            community={community}
            members={members}
            viewerId={session.user.id}
            toggleFollow={toggleFollow}
          />
        </CommunityTabs>
      </>
    );
  }

  const posts = await getCommunityPosts(id);
  return (
    <>
      {header}
      <CommunityProfile community={community} />
      <CommunityTabs
        key={tab}
        communityId={community.id}
        initialTab={tab}
        panels={{
          top: (
            <>
              <CommunityHashtags
                communityId={community.id}
                hashtags={community.hashtags}
              />
              <PostList
                tweets={posts.top}
                empty="Posts in this Community will show up here."
              />
            </>
          ),
          latest: (
            <PostList
              tweets={posts.latest}
              empty="Posts in this Community will show up here."
            />
          ),
          media: posts.media.length ? (
            <CommunityMediaGrid tweets={posts.media} />
          ) : (
            <EmptyState
              title="Nothing to see here — yet"
              body="Photos and videos posted in this Community will show up here."
            />
          ),
        }}
      />
    </>
  );
}

export function CommunityScreen({
  params,
  tab,
}: {
  params: Promise<{ id: string }>;
  tab: CommunityScreenTab | Promise<CommunityScreenTab>;
}) {
  return (
    <div className="pb-[200px]">
      <Suspense fallback={<SpinnerRow />}>
        <ResolvedCommunity params={params} tab={tab} />
      </Suspense>
    </div>
  );
}

async function ResolvedCommunity({
  params,
  tab,
}: {
  params: Promise<{ id: string }>;
  tab: CommunityScreenTab | Promise<CommunityScreenTab>;
}) {
  const [{ id }, resolvedTab] = await Promise.all([params, tab]);
  return <CommunityContent id={id} tab={resolvedTab} />;
}
