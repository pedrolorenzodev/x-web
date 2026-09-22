export type UserSummary = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
};

export type User = UserSummary & {
  bio: string;
  bannerUrl: string | null;
  joinedAt: string;
  followingCount: number;
  followersCount: number;
  postsCount: number;
  followedByViewer: boolean;
};

export type ToggleFollow = (userId: string) => Promise<void>;
