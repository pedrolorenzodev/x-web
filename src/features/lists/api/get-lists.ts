import { connection } from "next/server";
import type { List } from "@/types/list";
import { findUserByHandle } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";
import { byNewest } from "@/mocks/tweets";
import { mockLists, toList, type ListRecord } from "@/mocks/lists";

function byPinnedFirst(a: ListRecord, b: ListRecord) {
  if (a.pinnedByViewer !== b.pinnedByViewer) return a.pinnedByViewer ? -1 : 1;
  return byNewest(a, b);
}

export async function getLists(handle: string): Promise<List[]> {
  await connection();
  const viewer = await getMockViewer();
  const owner = findUserByHandle(handle);
  if (!owner) return [];
  const isViewer = owner.id === viewer?.id;

  return mockLists
    .filter((record) =>
      isViewer
        ? record.ownerId === owner.id || record.followedByViewer
        : record.ownerId === owner.id && !record.private,
    )
    .sort(isViewer ? byPinnedFirst : byNewest)
    .flatMap((record) => toList(record) ?? []);
}
