import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { SpinnerRow } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { UserCell } from "@/components/user/user-cell";
import { getSession } from "@/features/auth/api/get-session";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getConversation } from "@/features/tweet/api/get-conversation";
import { getLikers } from "@/features/tweet/api/get-post-activity";
import { PostActivity } from "@/features/tweet/components/post-activity";

export const metadata: Metadata = { title: "Post activity / X" };

function renderUsers(users: User[], viewerId: string) {
  if (users.length === 0) {
    return (
      <EmptyState title="No likes yet" body="When someone taps the heart to Like this post, it’ll show up here." />
    );
  }
  return users.map((user) => (
    <UserCell
      key={user.id}
      user={user}
      viewerId={viewerId}
      toggleFollow={toggleFollow}
    />
  ));
}

async function Users({ params }: Pick<PageProps<"/[handle]/status/[id]/likes">, "params">) {
  const { id } = await params;
  const [conversation, top, recent, session] = await Promise.all([
    getConversation(id),
    getLikers(id, "top"),
    getLikers(id, "recent"),
    getSession(),
  ]);
  if (!conversation || !session) notFound();
  const { tweet } = conversation;
  const isOwn = tweet.author.id === session.user.id;
  if (!isOwn) redirect(routes.tweet(tweet.author.handle, tweet.id));

  return (
    <PostActivity
      handle={tweet.author.handle}
      tweetId={tweet.id}
      active="likes"
      showLikes={isOwn}
      lists={{
        top: renderUsers(top, session.user.id),
        recent: renderUsers(recent, session.user.id),
      }}
    />
  );
}

export default function ActivityPage({ params }: PageProps<"/[handle]/status/[id]/likes">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Users params={params} />
    </Suspense>
  );
}
