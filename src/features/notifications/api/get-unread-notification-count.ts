import { connection } from "next/server";
import { getMockViewer } from "@/mocks/session";
import { mockNotifications } from "@/mocks/notifications";

export async function getUnreadNotificationCount(): Promise<number> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return 0;

  return mockNotifications.filter(
    (record) => record.recipientId === viewer.id && !record.read,
  ).length;
}
