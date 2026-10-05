import { connection } from "next/server";
import type { List } from "@/types/list";
import { findUserByHandle } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";
import { byNewest } from "@/mocks/tweets";
import { mockLists, toList } from "@/mocks/lists";

export async function getLists(handle: string): Promise<List[]> {
  await connection();
  const viewer = await getMockViewer();
  const owner = findUserByHandle(handle);
  if (!owner) return [];

  return mockLists
    .filter(
      (record) =>
        record.ownerId === owner.id &&
        (!record.private || record.ownerId === viewer?.id),
    )
    .sort(byNewest)
    .flatMap((record) => toList(record) ?? []);
}
