"use server";

import { refresh } from "next/cache";
import type { DraftInput } from "@/types/draft";
import { getMockViewer } from "@/mocks/session";
import { createDraftId, mockDrafts } from "@/mocks/drafts";

export async function saveDraft({ id, ...draft }: DraftInput) {
  const viewer = await getMockViewer();
  if (!viewer) throw new Error("No viewer session");

  const updatedAt = new Date().toISOString();
  const existing = id
    ? mockDrafts.find((item) => item.id === id && item.ownerId === viewer.id)
    : undefined;

  if (existing) {
    Object.assign(existing, draft, { updatedAt });
  } else {
    mockDrafts.push({
      ...draft,
      id: createDraftId(),
      ownerId: viewer.id,
      updatedAt,
    });
  }

  refresh();
}
