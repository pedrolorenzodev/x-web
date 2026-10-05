import type { UserSummary } from "@/types/user";

export type List = {
  id: string;
  name: string;
  description: string;
  bannerUrl: string | null;
  private: boolean;
  owner: UserSummary;
  memberCount: number;
  followerCount: number;
  createdAt: string;
  followedByViewer: boolean;
  pinnedByViewer: boolean;
  hiddenFromForYou: boolean;
  followersPreview: UserSummary[];
};

export type ListMember = {
  listId: string;
  userId: string;
  addedAt: string;
};
