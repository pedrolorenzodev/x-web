import { connection } from "next/server";
import type { List } from "@/types/list";
import { getMockViewer } from "@/mocks/session";
import { findUserByHandle } from "@/mocks/users";
import { byNewest } from "@/mocks/tweets";
import { mockListMembers, mockLists, toList } from "@/mocks/lists";

export async function getListMemberships(handle: string): Promise<List[]> {
  await connection();
  const viewer = await getMockViewer();
  const user = findUserByHandle(handle);
  if (!user) return [];

  const listIds = new Set(
    mockListMembers
      .filter((member) => member.userId === user.id)
      .map((member) => member.listId),
  );

  return mockLists
    .filter(
      (record) =>
        listIds.has(record.id) &&
        (!record.private || record.ownerId === viewer?.id),
    )
    .sort(byNewest)
    .flatMap((record) => toList(record) ?? []);
}
