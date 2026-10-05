import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { notFound, redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { getProfileReplies } from "@/features/profile/api/get-profile-replies";
import { ProfileReplies } from "@/features/profile/components/profile-replies";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Replies({
  params,
}: {
  params: PageProps<"/[handle]/with_replies">["params"];
}) {
  const { handle } = await params;
  const [profile, session, replies] = await Promise.all([
    getProfile(handle),
    getSession(),
    getProfileReplies(handle),
  ]);
  if (!session) notFound();
  if (!profile) return <ProfileNotFound />;
  if (profile.handle !== handle) {
    redirect(routes.profileReplies(profile.handle));
  }

  return (
    <ProfileScreen
      profile={profile}
      isViewer={profile.id === session.user.id}
      tab="replies"
      toggleFollow={toggleFollow}
    >
      <ProfileReplies items={replies.items} actions={tweetActions} />
    </ProfileScreen>
  );
}

export default function ProfileRepliesPage({
  params,
}: PageProps<"/[handle]/with_replies">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Replies params={params} />
    </Suspense>
  );
}
