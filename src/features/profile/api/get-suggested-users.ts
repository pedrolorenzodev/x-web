import type { User } from "@/types/user";
import { findUserById, mockSuggestedUserIds, toUser } from "@/mocks/users";
import { findFollowedByPreview } from "@/mocks/follows";

export async function getSuggestedUsers(
  limit = 3,
  excludeId: string | null = null,
): Promise<User[]> {
  return mockSuggestedUserIds
    .filter((id) => id !== excludeId)
    .flatMap((id) => findUserById(id) ?? [])
    .slice(0, limit)
    .map((user) => toUser(user, findFollowedByPreview(user.id)));
}
