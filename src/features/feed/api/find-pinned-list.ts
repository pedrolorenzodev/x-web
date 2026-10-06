import { mockLists, type ListRecord } from "@/mocks/lists";

export function isListVisibleTo(record: ListRecord, viewerId: string | null) {
  return !record.private || record.ownerId === viewerId;
}

export function findPinnedList(listId: string, viewerId: string | null) {
  const record = mockLists.find((item) => item.id === listId);
  if (!record || !record.pinnedByViewer || !isListVisibleTo(record, viewerId)) {
    return null;
  }
  return record;
}
