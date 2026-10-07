import { connection } from "next/server";
import type { Draft, DraftsTab } from "@/types/draft";
import { getMockViewer } from "@/mocks/session";
import { mockDrafts, toDraft } from "@/mocks/drafts";

export async function getDrafts(tab: DraftsTab): Promise<Draft[]> {
  await connection();
  const viewer = await getMockViewer();
  if (!viewer) return [];

  const scheduled = tab === "scheduled";
  return mockDrafts
    .filter(
      (draft) =>
        draft.ownerId === viewer.id && Boolean(draft.scheduledAt) === scheduled,
    )
    .sort((a, b) =>
      scheduled
        ? (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? "")
        : b.updatedAt.localeCompare(a.updatedAt),
    )
    .map(toDraft);
}
