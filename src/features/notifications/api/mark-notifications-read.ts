"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockNotifications } from "@/mocks/notifications";

export async function markNotificationsRead() {
  const viewer = await getMockViewer();
  if (!viewer) return;

  for (const record of mockNotifications) {
    if (record.recipientId === viewer.id) record.read = true;
  }

  refresh();
}
