"use server";

import { refresh } from "next/cache";
import { mockLists } from "@/mocks/lists";
import { getMockViewer } from "@/mocks/session";

export async function toggleListFollow(listId: string) {
  const list = mockLists.find((record) => record.id === listId);
  const viewer = await getMockViewer();
  if (!list || !viewer || list.ownerId === viewer.id) return;

  list.followedByViewer = !list.followedByViewer;
  list.followerCount += list.followedByViewer ? 1 : -1;

  refresh();
}
