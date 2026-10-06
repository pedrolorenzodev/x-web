import { mockLists, type ListRecord } from "@/mocks/lists";

export function findVisibleList(
  listId: string,
  viewerId: string | null,
): ListRecord | null {
  const record = mockLists.find((item) => item.id === listId);
  if (!record || (record.private && record.ownerId !== viewerId)) return null;
  return record;
}

export function findOwnedList(
  listId: string,
  viewerId: string | null,
): ListRecord | null {
  const record = mockLists.find((item) => item.id === listId);
  return record && viewerId && record.ownerId === viewerId ? record : null;
}
