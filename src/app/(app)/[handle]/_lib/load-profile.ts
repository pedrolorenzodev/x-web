import { notFound, redirect } from "next/navigation";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { canViewPosts } from "@/features/profile/utils/can-view-posts";
import { toggleBookmark } from "@/features/tweet/api/toggle-bookmark";
import { toggleLike } from "@/features/tweet/api/toggle-like";
import { toggleRetweet } from "@/features/tweet/api/toggle-retweet";

export const tweetActions = { toggleLike, toggleRetweet, toggleBookmark };

export async function loadProfile(
  handle: string,
  canonicalPath: (handle: string) => string,
) {
  const [profile, session] = await Promise.all([
    getProfile(handle),
    getSession(),
  ]);
  if (!session) notFound();
  if (!profile) return null;
  if (profile.handle !== handle) redirect(canonicalPath(profile.handle));

  const isViewer = profile.id === session.user.id;

  return {
    profile,
    isViewer,
    viewerId: session.user.id,
    postsVisible: canViewPosts(profile, isViewer),
  };
}
