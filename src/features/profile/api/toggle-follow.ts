"use server";

import { refresh } from "next/cache";
import { findUserById } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";

export async function toggleFollow(userId: string) {
  const user = findUserById(userId);
  const viewer = await getMockViewer();
  if (!user || !viewer || user.id === viewer.id) return;

  user.followedByViewer = !user.followedByViewer;
  const delta = user.followedByViewer ? 1 : -1;
  user.followersCount += delta;
  viewer.followingCount += delta;

  refresh();
}
