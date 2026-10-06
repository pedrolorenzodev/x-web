"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockLists } from "@/mocks/lists";

export async function toggleListFollow(listId: string) {
  const record = mockLists.find((item) => item.id === listId);
  const viewer = await getMockViewer();
  if (!record || !viewer || record.ownerId === viewer.id || record.private) {
    return;
  }

  record.followedByViewer = !record.followedByViewer;
  record.followerCount += record.followedByViewer ? 1 : -1;
  if (!record.followedByViewer) {
    record.pinnedByViewer = false;
    record.pinnedAt = undefined;
  }
  refresh();
}

export async function toggleListPin(listId: string) {
  const record = mockLists.find((item) => item.id === listId);
  const viewer = await getMockViewer();
  if (!record || !viewer) return;
  if (record.ownerId !== viewer.id && !record.followedByViewer) return;

  record.pinnedByViewer = !record.pinnedByViewer;
  record.pinnedAt = record.pinnedByViewer ? new Date().toISOString() : undefined;
  refresh();
}

export async function toggleListHiddenFromForYou(listId: string) {
  const record = mockLists.find((item) => item.id === listId);
  const viewer = await getMockViewer();
  if (!record || record.ownerId !== viewer?.id) return;

  record.hiddenFromForYou = !record.hiddenFromForYou;
  refresh();
}
