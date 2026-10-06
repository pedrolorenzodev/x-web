import type { Page } from "@/types/pagination";
import type { User } from "@/types/user";

export type FollowListKind =
  | "verified_followers"
  | "followers_you_follow"
  | "followers"
  | "following";

export type FollowListScreenData = {
  profile: User;
  viewerId: string;
  isViewer: boolean;
  locked: boolean;
  hasFollowersYouKnow: boolean;
  firstPage: Page<User>;
};
