import type { SettingsPage } from "@/features/settings/types/settings";
import {
  hiddenSettingsPages,
  settingsCategories,
} from "@/features/settings/config/settings-tree";

export function findSettingsPage(pathname: string): SettingsPage | null {
  const path = pathname.toLowerCase();

  const category = settingsCategories.find((item) => item.href === path);
  if (category) return { kind: "category", category };

  for (const parent of settingsCategories) {
    for (const section of parent.sections) {
      const link = section.links.find(
        (item) => !item.external && item.href === path,
      );
      if (link) return { kind: "leaf", title: link.label, parent };
    }
  }

  const hidden = hiddenSettingsPages.find((item) => item.href === path);
  const hiddenParent = settingsCategories.find(
    (item) => item.id === hidden?.parentId,
  );
  if (hidden && hiddenParent) {
    return { kind: "leaf", title: hidden.title, parent: hiddenParent };
  }

  return null;
}

export function settingsPageTitle(page: SettingsPage) {
  return page.kind === "category" ? page.category.title : page.title;
}

export function activeCategoryId(pathname: string) {
  const page = findSettingsPage(pathname);
  if (!page) return null;
  return page.kind === "category" ? page.category.id : page.parent.id;
}
