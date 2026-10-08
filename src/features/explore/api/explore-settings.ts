"use server";

import type { ExploreSettings } from "@/types/preferences";
import { findPreferences } from "@/mocks/preferences";
import { getMockViewer } from "@/mocks/session";

export async function getExploreSettings(): Promise<ExploreSettings> {
  const viewer = await getMockViewer();
  if (!viewer) return { showLocalContent: true };
  return { ...findPreferences(viewer.id).explore };
}

export async function updateExploreSettings(settings: ExploreSettings) {
  const viewer = await getMockViewer();
  if (!viewer) throw new Error("No viewer session");
  findPreferences(viewer.id).explore = { ...settings };
}
