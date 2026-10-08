"use server";

import type { SearchSettings } from "@/types/preferences";
import { findPreferences } from "@/mocks/preferences";
import { getMockViewer } from "@/mocks/session";

export async function getSearchSettings(): Promise<SearchSettings> {
  const viewer = await getMockViewer();
  if (!viewer) {
    return { hideSensitiveContent: true, removeBlockedAndMuted: true };
  }
  return { ...findPreferences(viewer.id).search };
}

export async function updateSearchSettings(settings: SearchSettings) {
  const viewer = await getMockViewer();
  if (!viewer) throw new Error("No viewer session");
  findPreferences(viewer.id).search = { ...settings };
}
