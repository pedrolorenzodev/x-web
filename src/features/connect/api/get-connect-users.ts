"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { User } from "@/types/user";
import { mockUsers, toUser, type UserRecord } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";
import { getMockViewer } from "@/mocks/session";
import type { ConnectTab } from "@/features/connect/types/connect";

const PAGE_SIZE = 20;

function stableFollowerCount(user: UserRecord) {
  return user.followersCount - (user.followedByViewer ? 1 : 0);
}

function byFollowers(a: UserRecord, b: UserRecord) {
  return stableFollowerCount(b) - stableFollowerCount(a) || a.id.localeCompare(b.id);
}

export async function getConnectUsers(
  tab: ConnectTab,
  excludeId: string | null = null,
  cursor: string | null = null,
): Promise<Page<User>> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return { items: [], nextCursor: null };

  const ranked = mockUsers
    .filter(
      (user) =>
        user.id !== viewer.id &&
        user.id !== excludeId &&
        (tab === "who-to-follow" || user.isCreator),
    )
    .sort(byFollowers);

  const start = cursor ? ranked.findIndex((user) => user.id === cursor) + 1 : 0;
  const listed = ranked
    .slice(start)
    .filter((user) => tab === "creators" || !user.followedByViewer);
  const page = listed.slice(0, PAGE_SIZE);
  const last = page.at(-1);

  return {
    items: page.map((user) => toUser(user, findFollowedByPreview(user.id))),
    nextCursor: listed.length > PAGE_SIZE && last ? last.id : null,
  };
}
