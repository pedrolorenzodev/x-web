"use server";

import type { User } from "@/types/user";
import { getMockViewer } from "@/mocks/session";
import { mockSuggestedUserIds, mockUsers, toUser } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";

const CANDIDATE_LIMIT = 20;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function getListCandidates(query: string): Promise<User[]> {
  const viewer = await getMockViewer();
  const term = normalize(query.trim().replace(/^@/, ""));

  const others = mockUsers.filter((user) => user.id !== viewer?.id);
  const matches = term
    ? others.filter(
        (user) =>
          normalize(user.handle).includes(term) ||
          normalize(user.displayName).includes(term),
      )
    : [
        ...others.filter((user) => user.followedByViewer),
        ...others.filter(
          (user) =>
            !user.followedByViewer && mockSuggestedUserIds.includes(user.id),
        ),
      ];

  return matches
    .slice(0, CANDIDATE_LIMIT)
    .map((user) => toUser(user, findFollowedByPreview(user.id)));
}
