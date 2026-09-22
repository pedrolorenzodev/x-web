"use server";

import { refresh } from "next/cache";
import { findUserById, mockViewerId } from "@/mocks/users";

export async function toggleFollow(userId: string) {
  const user = findUserById(userId);
  const viewer = findUserById(mockViewerId);
  if (!user || !viewer || user.id === viewer.id) return;

  user.followedByViewer = !user.followedByViewer;
  const delta = user.followedByViewer ? 1 : -1;
  user.followersCount += delta;
  viewer.followingCount += delta;

  refresh();
}
