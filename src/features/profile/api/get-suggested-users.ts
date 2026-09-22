import type { User } from "@/types/user";
import { mockUsers, mockViewerId } from "@/mocks/users";

export async function getSuggestedUsers(
  limit = 3,
  excludeId: string | null = null,
): Promise<User[]> {
  return mockUsers
    .filter(
      (user) =>
        user.id !== mockViewerId &&
        user.id !== excludeId &&
        !user.followedByViewer,
    )
    .slice(0, limit);
}
