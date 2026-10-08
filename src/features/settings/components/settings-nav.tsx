"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BackIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { PillSearchInput } from "@/components/ui/pill-search-input";
import { settingsNavItems } from "@/features/settings/config/settings-tree";
import {
  SettingsTrailingIcon,
  settingsRowHover,
} from "@/features/settings/components/settings-link-row";
import { activeCategoryId } from "@/features/settings/utils/find-settings-page";
import { searchSettings } from "@/features/settings/utils/search-settings";
import { cn } from "@/lib/utils";

const navRow = cn("flex h-12 items-center px-4 text-base", settingsRowHover);

function SearchResults({ query }: { query: string }) {
  const groups = searchSettings(query);

  if (groups.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-base text-muted">
        No results for “{query.trim()}”
      </p>
    );
  }

  return (
    <div role="tablist" aria-label="Search results">
      {groups.map((group) => (
        <div key={group.href}>
          <Link href={group.href} role="tab" className={cn(navRow, "h-[52px] font-bold")}>
            <span className="min-w-0 grow truncate">{group.label}</span>
            <SettingsTrailingIcon />
          </Link>
          {group.matches.map((link) => (
            <Link key={link.href} href={link.href} role="tab" className={cn(navRow, "h-[52px]")}>
              <span className="min-w-0 grow truncate">{link.label}</span>
              <SettingsTrailingIcon />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SettingsNavPanel({ activeId }: { activeId: string | null }) {
  const [query, setQuery] = useState("");
  const searching = query !== "";

  return (
    <>
      <div className="flex h-[53px] items-center px-4">
        <h2 className="text-xl font-bold">Settings</h2>
      </div>
      <div className="mt-2 flex items-center gap-2 px-2 pb-2">
        {searching ? (
          <IconButton
            label="Back"
            tone="plain"
            onClick={() => setQuery("")}
            className="ml-2 size-9"
          >
            <BackIcon className="size-5" />
          </IconButton>
        ) : null}
        <PillSearchInput
          value={query}
          label="Search Settings"
          placeholder="Search Settings"
          onValueChange={setQuery}
          className="flex-1"
        />
      </div>
      {searching ? (
        <SearchResults query={query} />
      ) : (
        <div role="tablist" aria-label="Settings">
          {settingsNavItems.map((item) => {
            const selected = Boolean(item.categoryId) && item.categoryId === activeId;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="tab"
                aria-selected={selected}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  navRow,
                  selected &&
                    "bg-menu-hover shadow-[inset_-2px_0_0_var(--color-accent)]",
                )}
              >
                <span className="min-w-0 grow truncate">{item.label}</span>
                <SettingsTrailingIcon external={item.external} />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export function SettingsNav() {
  const pathname = usePathname();
  return <SettingsNavPanel activeId={activeCategoryId(pathname)} />;
}
