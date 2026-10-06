import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import type { FollowListKind } from "@/features/profile/types/follow-list";

export const followListHref: Record<FollowListKind, (handle: string) => string> = {
  verified_followers: routes.verifiedFollowers,
  followers_you_follow: routes.followersYouFollow,
  followers: routes.followers,
  following: routes.following,
};

export const followListLabel: Record<FollowListKind, string> = {
  verified_followers: "Verified Followers",
  followers_you_follow: "Followers you know",
  followers: "Followers",
  following: "Following",
};

const titlePrefix: Record<FollowListKind, string> = {
  verified_followers: "Verified accounts following",
  followers_you_follow: "People you know following",
  followers: "People following",
  following: "People followed by",
};

export function followListTitle(
  kind: FollowListKind,
  profile: Pick<UserSummary, "displayName" | "handle"> | null,
) {
  if (!profile) return "Profile / X";
  return `${titlePrefix[kind]} ${profile.displayName} (@${profile.handle}) / X`;
}
