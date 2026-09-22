import type { UserSummary } from "@/types/user";
import { mockUsers, mockViewerId, toSummary } from "@/mocks/users";

export async function getSuggestedUsers(limit = 3): Promise<UserSummary[]> {
  return mockUsers
    .filter((user) => user.id !== mockViewerId && !user.followedByViewer)
    .slice(0, limit)
    .map(toSummary);
}
