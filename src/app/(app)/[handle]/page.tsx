import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { notFound, redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { getProfileTweets } from "@/features/profile/api/get-profile-tweets";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { ProfilePosts } from "@/features/profile/components/profile-posts";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

async function Profile({ params }: { params: PageProps<"/[handle]">["params"] }) {
  const { handle } = await params;
  const [profile, session] = await Promise.all([
    getProfile(handle),
    getSession(),
  ]);
  if (!session) notFound();
  if (!profile) return <ProfileNotFound />;
  if (profile.handle !== handle) {
    redirect(routes.profile(profile.handle));
  }

  const [posts, suggestions] = await Promise.all([
    getProfileTweets(handle),
    getSuggestedUsers(3, profile.id),
  ]);

  return (
    <ProfileScreen
      profile={profile}
      isViewer={profile.id === session.user.id}
      tab="posts"
      toggleFollow={toggleFollow}
    >
      <ProfilePosts
        items={posts.items}
        suggestions={suggestions}
        viewerId={session.user.id}
        actions={tweetActions}
        toggleFollow={toggleFollow}
      />
    </ProfileScreen>
  );
}

export default function ProfilePage({ params }: PageProps<"/[handle]">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Profile params={params} />
    </Suspense>
  );
}
