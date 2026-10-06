import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { UserCell } from "@/components/user/user-cell";
import { getSession } from "@/features/auth/api/get-session";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getConversation } from "@/features/tweet/api/get-conversation";
import { getReposters } from "@/features/tweet/api/get-post-activity";
import { PostActivity } from "@/features/tweet/components/post-activity";

export const metadata: Metadata = { title: "Post activity / X" };

async function Users({ params }: Pick<PageProps<"/[handle]/status/[id]/retweets">, "params">) {
  const { id } = await params;
  const [conversation, users, session] = await Promise.all([
    getConversation(id),
    getReposters(id),
    getSession(),
  ]);
  if (!conversation || !session) notFound();
  const { tweet } = conversation;
  const isOwn = tweet.author.id === session.user.id;

  return (
    <PostActivity
      handle={tweet.author.handle}
      tweetId={tweet.id}
      active="retweets"
      showLikes={isOwn}
    >
      {users.length === 0 ? (
        <EmptyState title="No Reposts yet" body="Share someone else’s post on your timeline by reposting it. When you do, it’ll show up here." />
      ) : (
        users.map((user) => (
          <UserCell
            key={user.id}
            user={user}
            viewerId={session.user.id}
            toggleFollow={toggleFollow}
          />
        ))
      )}
    </PostActivity>
  );
}

export default function ActivityPage({ params }: PageProps<"/[handle]/status/[id]/retweets">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Users params={params} />
    </Suspense>
  );
}
