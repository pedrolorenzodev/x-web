import type { Session } from "@/types/auth";
import { findUserById, mockViewerId, toSummary } from "@/mocks/users";

export async function getSession(): Promise<Session | null> {
  const viewer = findUserById(mockViewerId);
  if (!viewer) return null;

  return { user: toSummary(viewer) };
}
