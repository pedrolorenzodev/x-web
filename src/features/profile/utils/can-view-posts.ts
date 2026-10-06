import type { User } from "@/types/user";

export function canViewPosts(profile: User, isViewer: boolean) {
  return isViewer || !profile.protected || profile.followedByViewer;
}
