"use server";

import { connection } from "next/server";
import type { Notification, NotificationTab } from "@/types/notification";
import type { Page } from "@/types/pagination";
import { getMockViewer } from "@/mocks/session";
import { byNewest } from "@/mocks/tweets";
import { mockNotifications, toNotification } from "@/mocks/notifications";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 20;
const MENTION_TYPES = new Set(["mention", "reply", "quote"]);

export async function getNotifications(
  tab: NotificationTab = "all",
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<Notification>> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return { items: [], nextCursor: null };

  const items = mockNotifications
    .filter(
      (record) =>
        record.recipientId === viewer.id &&
        (tab !== "mentions" || MENTION_TYPES.has(record.type)),
    )
    .sort(byNewest)
    .flatMap((record) => toNotification(record) ?? []);

  return paginate(items, cursor, limit, (item) => item.id);
}
