export type VerifiedType = "blue" | "business" | "government" | null;

export type UserAffiliate = {
  handle: string;
  avatarUrl: string;
};

export type UserSummary = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  verified: VerifiedType;
  protected: boolean;
  affiliate?: UserAffiliate | null;
};

export type UserWebsite = {
  url: string;
  display: string;
};

export type BirthDate = {
  year: number;
  month: number;
  day: number;
};

export type FollowedByPreview = {
  users: UserSummary[];
  total: number;
};

export type User = UserSummary & {
  bio: string;
  bannerUrl: string | null;
  location: string | null;
  website: UserWebsite | null;
  birthDate: BirthDate | null;
  professionalCategory: string | null;
  joinedAt: string;
  verifiedSince: string | null;
  followingCount: number;
  followersCount: number;
  postsCount: number;
  mediaCount: number;
  pinnedTweetId: string | null;
  isCreator: boolean;
  hasArticles: boolean;
  followedByViewer: boolean;
  followsViewer: boolean;
  notificationsOn: boolean;
  followedByPreview: FollowedByPreview;
};

export type ToggleFollow = (userId: string) => Promise<void>;
