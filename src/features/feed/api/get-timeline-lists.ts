import { connection } from "next/server";
import type { TimelineList } from "@/features/feed/types/timeline-list";
import { getMockViewer } from "@/mocks/session";
import { findUserById } from "@/mocks/users";
import { byNewest } from "@/mocks/tweets";
import { mockLists, type ListRecord } from "@/mocks/lists";
import { isListVisibleTo } from "@/features/feed/api/find-pinned-list";

function byPinOrder(a: ListRecord, b: ListRecord) {
  return (a.pinnedAt ?? a.createdAt).localeCompare(b.pinnedAt ?? b.createdAt);
}

function toTimelineList(record: ListRecord): TimelineList {
  return {
    id: record.id,
    name: record.name,
    bannerUrl: record.bannerUrl,
    private: record.private,
    ownerHandle: findUserById(record.ownerId)?.handle ?? "",
    pinned: record.pinnedByViewer,
  };
}

export async function getTimelineLists(): Promise<TimelineList[]> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return [];

  const lists = mockLists.filter(
    (record) =>
      (record.ownerId === viewer.id || record.followedByViewer) &&
      isListVisibleTo(record, viewer.id),
  );

  return [
    ...lists.filter((record) => record.pinnedByViewer).sort(byPinOrder),
    ...lists.filter((record) => !record.pinnedByViewer).sort(byNewest),
  ].map(toTimelineList);
}
