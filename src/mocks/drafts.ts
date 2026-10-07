import type { Draft } from "@/types/draft";

export type DraftRecord = Draft & {
  ownerId: string;
};

let draftSequence = 0;

export function createDraftId() {
  draftSequence += 1;
  return `d${Date.now()}${draftSequence}`;
}

export const mockDrafts: DraftRecord[] = [];

export function toDraft(record: DraftRecord): Draft {
  return {
    id: record.id,
    posts: record.posts,
    replySettings: record.replySettings,
    replyToId: record.replyToId,
    quotedId: record.quotedId,
    scheduledAt: record.scheduledAt,
    updatedAt: record.updatedAt,
  };
}
