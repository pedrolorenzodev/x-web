import type { NewPost, ReplySettings } from "@/types/tweet";

export type Draft = {
  id: string;
  posts: NewPost[];
  replySettings: ReplySettings;
  replyToId: string | null;
  quotedId: string | null;
  scheduledAt: string | null;
  updatedAt: string;
};

export type DraftInput = Omit<Draft, "id" | "updatedAt"> & {
  id: string | null;
};

export type DraftsTab = "drafts" | "scheduled";
