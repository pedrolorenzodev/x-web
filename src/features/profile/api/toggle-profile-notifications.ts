"use server";

import { refresh } from "next/cache";
import { findUserById } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";

export async function toggleProfileNotifications(userId: string) {
  const user = findUserById(userId);
  const viewer = await getMockViewer();
  if (!user || !viewer || user.id === viewer.id || !user.followedByViewer) {
    return;
  }

  user.notificationsOn = !user.notificationsOn;

  refresh();
}
