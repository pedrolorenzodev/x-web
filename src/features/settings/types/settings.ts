import type { ComponentType, SVGProps } from "react";

export type SettingsIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SettingsLink = {
  label: string;
  href: string;
  description?: string;
  icon?: SettingsIcon;
  external?: boolean;
};

export type SettingsSection = {
  heading?: string;
  links: SettingsLink[];
};

export type SettingsCategory = {
  id: string;
  label: string;
  title: string;
  href: string;
  description: string;
  sections: SettingsSection[];
};

export type SettingsNavItem = {
  label: string;
  href: string;
  external?: boolean;
  categoryId?: string;
};

export type SettingsPage =
  | { kind: "category"; category: SettingsCategory }
  | { kind: "leaf"; title: string; parent: SettingsCategory };
