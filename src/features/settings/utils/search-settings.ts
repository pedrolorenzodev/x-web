import type { SettingsLink } from "@/features/settings/types/settings";
import { settingsCategories } from "@/features/settings/config/settings-tree";

export type SettingsSearchGroup = {
  label: string;
  href: string;
  matches: SettingsLink[];
};

export function searchSettings(query: string): SettingsSearchGroup[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return settingsCategories.flatMap((category) => {
    const matches = category.sections
      .flatMap((section) => section.links)
      .filter((link) => !link.external && link.label.toLowerCase().includes(term));
    const labelMatches = category.label.toLowerCase().includes(term);
    if (!labelMatches && matches.length === 0) return [];
    return [{ label: category.label, href: category.href, matches }];
  });
}
