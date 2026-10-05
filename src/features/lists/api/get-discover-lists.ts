import { connection } from "next/server";
import type { List } from "@/types/list";
import { getMockViewer } from "@/mocks/session";
import { mockLists, toList } from "@/mocks/lists";

export async function getDiscoverLists(limit = 3): Promise<List[]> {
  await connection();
  const viewer = await getMockViewer();

  return mockLists
    .filter(
      (record) =>
        !record.private &&
        record.ownerId !== viewer?.id &&
        !record.followedByViewer,
    )
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, limit)
    .flatMap((record) => toList(record) ?? []);
}
