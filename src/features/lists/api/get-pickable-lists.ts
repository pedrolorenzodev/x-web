import { connection } from "next/server";
import type { PickableList } from "@/features/lists/types/pickable-list";
import { getMockViewer } from "@/mocks/session";
import { findUserById } from "@/mocks/users";
import { byNewest } from "@/mocks/tweets";
import { mockListMembers, mockLists, toList } from "@/mocks/lists";

export async function getPickableLists(
  userId: string,
): Promise<PickableList[] | null> {
  await connection();
  const viewer = await getMockViewer();
  const user = findUserById(userId);
  if (!viewer || !user) return null;

  return mockLists
    .filter((record) => record.ownerId === viewer.id)
    .sort(byNewest)
    .flatMap((record) => {
      const list = toList(record);
      if (!list) return [];
      const isMember = mockListMembers.some(
        (member) => member.listId === record.id && member.userId === userId,
      );
      return [{ list, isMember }];
    });
}
