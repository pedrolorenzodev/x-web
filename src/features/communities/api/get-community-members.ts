import { connection } from "next/server";
import type { CommunityMember } from "@/types/community";
import { findCommunity } from "@/mocks/communities";
import { findFollowedByPreview } from "@/mocks/follows";
import { findUserById, toUser } from "@/mocks/users";

const roleOrder = { admin: 0, moderator: 1, member: 2 } as const;

export async function getCommunityMembers(
  communityId: string,
): Promise<CommunityMember[] | null> {
  await connection();
  const record = findCommunity(communityId);
  if (!record) return null;

  return [...record.members]
    .sort((a, b) => roleOrder[a.role] - roleOrder[b.role])
    .flatMap(({ userId, role }) => {
      const user = findUserById(userId);
      return user
        ? [{ user: toUser(user, findFollowedByPreview(user.id)), role }]
        : [];
    });
}
