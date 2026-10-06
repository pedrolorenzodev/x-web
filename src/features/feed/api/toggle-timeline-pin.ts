"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockLists } from "@/mocks/lists";
import {
  TIMELINE_KIND_COOKIE,
  listTimelineKind,
} from "@/features/feed/types/timeline-kind";

export async function toggleTimelinePin(listId: string) {
  const record = mockLists.find((item) => item.id === listId);
  const viewer = await getMockViewer();
  if (!record || !viewer) return;
  if (record.ownerId !== viewer.id && !record.followedByViewer) return;

  record.pinnedByViewer = !record.pinnedByViewer;
  record.pinnedAt = record.pinnedByViewer ? new Date().toISOString() : undefined;

  const cookieStore = await cookies();
  if (
    !record.pinnedByViewer &&
    cookieStore.get(TIMELINE_KIND_COOKIE)?.value === listTimelineKind(listId)
  ) {
    cookieStore.delete(TIMELINE_KIND_COOKIE);
  }
  refresh();
}
