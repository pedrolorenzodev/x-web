import type { UserSummary } from "@/types/user";

export type NewPostsPreview = {
  count: number;
  authors: UserSummary[];
};
