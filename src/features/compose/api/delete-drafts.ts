"use server";

import { refresh } from "next/cache";
import { getMockViewer } from "@/mocks/session";
import { mockDrafts } from "@/mocks/drafts";

export async function deleteDrafts(ids: string[]) {
  const viewer = await getMockViewer();
  if (!viewer) throw new Error("No viewer session");

  const targets = new Set(ids);
  for (let index = mockDrafts.length - 1; index >= 0; index -= 1) {
    const draft = mockDrafts[index];
    if (draft.ownerId === viewer.id && targets.has(draft.id)) {
      mockDrafts.splice(index, 1);
    }
  }

  refresh();
}
