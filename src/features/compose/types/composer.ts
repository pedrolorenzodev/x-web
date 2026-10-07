import type { ReplySettings } from "@/types/tweet";

export type ComposerMedia = {
  id: string;
  kind: "photo" | "gif";
  url: string;
  videoUrl?: string;
  width: number;
  height: number;
  alt: string;
};

export type ComposerPoll = {
  choices: string[];
  days: number;
  hours: number;
  minutes: number;
};

export type ComposerPost = {
  id: string;
  text: string;
  media: ComposerMedia[];
  poll: ComposerPoll | null;
};

export type ContentDisclosure = {
  paidPartnership: boolean;
  madeWithAi: boolean;
};

export type ComposerSnapshot = {
  posts: ComposerPost[];
  activeIndex: number;
  replySettings: ReplySettings;
  scheduledAt: string | null;
  disclosure: ContentDisclosure;
  draftId: string | null;
};
