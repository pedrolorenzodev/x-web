import type { UserSummary } from "@/types/user";
import { toSummary, type UserRecord } from "@/mocks/users";

export function toReposter(
  author: UserRecord,
  viewerId: string | null,
): UserSummary {
  const summary = toSummary(author);
  return author.id === viewerId ? { ...summary, displayName: "You" } : summary;
}
