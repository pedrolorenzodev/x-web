import type { Session } from "@/types/auth";
import { toSummary } from "@/mocks/users";
import { getMockViewer } from "@/mocks/session";

export async function getSession(): Promise<Session | null> {
  const viewer = await getMockViewer();
  if (!viewer) return null;

  return { user: toSummary(viewer) };
}
