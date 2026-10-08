import type { ExploreSettings, SearchSettings } from "@/types/preferences";

type ViewerPreferences = {
  explore: ExploreSettings;
  search: SearchSettings;
};

const mockPreferences = new Map<string, ViewerPreferences>();

export function findPreferences(viewerId: string): ViewerPreferences {
  const existing = mockPreferences.get(viewerId);
  if (existing) return existing;

  const preferences: ViewerPreferences = {
    explore: { showLocalContent: true },
    search: { hideSensitiveContent: true, removeBlockedAndMuted: true },
  };
  mockPreferences.set(viewerId, preferences);
  return preferences;
}
