import type { User, UserSummary } from "@/types/user";

export type CommunityTopic =
  | "Sports"
  | "Technology"
  | "Art"
  | "Entertainment"
  | "Gaming"
  | "Politics"
  | "Business"
  | "Culture"
  | "Science"
  | "Food"
  | "Animals"
  | "Education"
  | "Fashion & Beauty"
  | "Health & Fitness"
  | "News"
  | "Cryptocurrency"
  | "Travel"
  | "X Official";

export type CommunityRole = "admin" | "moderator" | "member";

export type CommunityRule = {
  title: string;
  description: string;
};

export type Community = {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  category: string;
  topic: CommunityTopic;
  memberCount: number;
  membersPreview: UserSummary[];
  hashtags: string[];
  rules: CommunityRule[];
  joinPolicy: "open" | "request";
  createdAt: string;
  createdBy: UserSummary;
  viewerRole: CommunityRole | null;
  pinnedByViewer: boolean;
};

export type CommunityMember = {
  user: User;
  role: CommunityRole;
};
