"use server";

import type { RecentSearch } from "@/types/search";
import { mockRecentSearches } from "@/mocks/recent-searches";
import { getMockViewer } from "@/mocks/session";
import { findUserByHandle, findUserById, toSummary } from "@/mocks/users";

const RECENT_LIMIT = 10;

function toRecentSearch(
  record: (typeof mockRecentSearches)[number],
): RecentSearch[] {
  if (record.query !== null) {
    return [
      {
        id: record.id,
        kind: "query",
        query: record.query,
        searchedAt: record.searchedAt,
      },
    ];
  }
  const user = record.userId ? findUserById(record.userId) : null;
  return user
    ? [
        {
          id: record.id,
          kind: "user",
          user: toSummary(user),
          searchedAt: record.searchedAt,
        },
      ]
    : [];
}

function removeWhere(
  matches: (record: (typeof mockRecentSearches)[number]) => boolean,
) {
  for (let index = mockRecentSearches.length - 1; index >= 0; index--) {
    if (matches(mockRecentSearches[index])) mockRecentSearches.splice(index, 1);
  }
}

async function save(query: string | null, userId: string | null) {
  const viewer = await getMockViewer();
  if (!viewer) return;

  removeWhere(
    (record) =>
      record.viewerId === viewer.id &&
      record.query?.toLowerCase() === query?.toLowerCase() &&
      record.userId === userId,
  );
  mockRecentSearches.unshift({
    id: crypto.randomUUID(),
    viewerId: viewer.id,
    query,
    userId,
    searchedAt: new Date().toISOString(),
  });

  const overflow = mockRecentSearches
    .filter((record) => record.viewerId === viewer.id)
    .slice(RECENT_LIMIT);
  removeWhere((record) => overflow.includes(record));
}

export async function getRecentSearches(): Promise<RecentSearch[]> {
  const viewer = await getMockViewer();
  if (!viewer) return [];

  return mockRecentSearches
    .filter((record) => record.viewerId === viewer.id)
    .flatMap(toRecentSearch);
}

export async function saveRecentQuery(query: string) {
  const trimmed = query.trim();
  if (trimmed) await save(trimmed, null);
}

export async function saveRecentUser(handle: string) {
  const user = findUserByHandle(handle);
  if (user) await save(null, user.id);
}

export async function removeRecentSearch(id: string) {
  const viewer = await getMockViewer();
  if (!viewer) return;
  removeWhere((record) => record.viewerId === viewer.id && record.id === id);
}

export async function clearRecentSearches() {
  const viewer = await getMockViewer();
  if (!viewer) return;
  removeWhere((record) => record.viewerId === viewer.id);
}
