"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { findUserById } from "@/mocks/users";
import { createListId, mockListMembers, mockLists } from "@/mocks/lists";
import {
  LIST_DESCRIPTION_MAX,
  LIST_NAME_MAX,
  type ListDraft,
} from "@/features/lists/types/list-draft";
import { findOwnedList } from "@/features/lists/api/find-list-record";

function sanitize(draft: ListDraft) {
  const name = draft.name.trim().slice(0, LIST_NAME_MAX);
  if (!name) return null;

  return {
    name,
    description: draft.description.trim().slice(0, LIST_DESCRIPTION_MAX),
    private: draft.private,
    bannerUrl: draft.bannerUrl,
  };
}

function addMember(listId: string, userId: string) {
  const exists = mockListMembers.some(
    (member) => member.listId === listId && member.userId === userId,
  );
  if (exists || !findUserById(userId)) return;
  mockListMembers.push({ listId, userId, addedAt: new Date().toISOString() });
}

function removeMember(listId: string, userId: string) {
  const index = mockListMembers.findIndex(
    (member) => member.listId === listId && member.userId === userId,
  );
  if (index !== -1) mockListMembers.splice(index, 1);
}

export async function createList(
  draft: ListDraft,
  memberIds: string[],
): Promise<string | null> {
  const viewer = await getMockViewer();
  const fields = sanitize(draft);
  if (!viewer || !fields) return null;

  const id = createListId();
  mockLists.push({
    id,
    ownerId: viewer.id,
    ...fields,
    followerCount: 0,
    createdAt: new Date().toISOString(),
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [],
  });
  memberIds.forEach((userId) => addMember(id, userId));

  refresh();
  return id;
}

export async function updateList(listId: string, draft: ListDraft) {
  const viewer = await getMockViewer();
  const record = findOwnedList(listId, viewer?.id ?? null);
  const fields = sanitize(draft);
  if (!record || !fields) return;

  Object.assign(record, fields);
  refresh();
}

export async function deleteList(listId: string) {
  const viewer = await getMockViewer();
  if (!findOwnedList(listId, viewer?.id ?? null)) return;

  const index = mockLists.findIndex((record) => record.id === listId);
  mockLists.splice(index, 1);
  for (let i = mockListMembers.length - 1; i >= 0; i--) {
    if (mockListMembers[i].listId === listId) mockListMembers.splice(i, 1);
  }
  refresh();
}

export async function removeListMember(listId: string, userId: string) {
  const viewer = await getMockViewer();
  if (!findOwnedList(listId, viewer?.id ?? null)) return;

  removeMember(listId, userId);
  refresh();
}

export async function saveUserLists(userId: string, listIds: string[]) {
  const viewer = await getMockViewer();
  if (!viewer || !findUserById(userId)) return;

  const selected = new Set(listIds);
  mockLists
    .filter((record) => record.ownerId === viewer.id)
    .forEach((record) => {
      if (selected.has(record.id)) addMember(record.id, userId);
      else removeMember(record.id, userId);
    });
  refresh();
}
