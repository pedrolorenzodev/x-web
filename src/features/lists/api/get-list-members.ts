import { connection } from "next/server";
import type { User } from "@/types/user";
import { getMockViewer } from "@/mocks/session";
import { findUserById, toUser } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";
import { byNewest } from "@/mocks/tweets";
import { mockListMembers } from "@/mocks/lists";
import { findVisibleList } from "@/features/lists/api/find-list-record";

function toUsers(ids: string[]): User[] {
  return ids.flatMap((id) => {
    const user = findUserById(id);
    return user ? [toUser(user, findFollowedByPreview(user.id))] : [];
  });
}

export async function getListMembers(listId: string): Promise<User[] | null> {
  await connection();
  const viewer = await getMockViewer();
  if (!findVisibleList(listId, viewer?.id ?? null)) return null;

  return toUsers(
    mockListMembers
      .filter((member) => member.listId === listId)
      .map((member) => ({ ...member, createdAt: member.addedAt }))
      .sort(byNewest)
      .map((member) => member.userId),
  );
}

export async function getListFollowers(listId: string): Promise<User[] | null> {
  await connection();
  const viewer = await getMockViewer();
  const record = findVisibleList(listId, viewer?.id ?? null);
  if (!record) return null;

  const ids = [
    ...(record.followedByViewer && viewer ? [viewer.id] : []),
    ...record.followerPreviewIds,
  ];
  return toUsers([...new Set(ids)]);
}
