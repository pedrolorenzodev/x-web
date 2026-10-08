"use client";

import Link from "next/link";
import { useState, type FocusEvent } from "react";
import { SearchCombobox } from "@/components/search/search-combobox";
import { IconButton } from "@/components/ui/icon-button";
import { BackIcon, SettingsIcon } from "@/components/ui/icons";

export function ExploreSearchRow() {
  const [searching, setSearching] = useState(false);

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setSearching(false);
  }

  function stopSearching() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSearching(false);
  }

  return (
    <div className="flex h-[53px] items-start pt-2 pr-[7px] pl-4">
      <div
        onFocus={() => setSearching(true)}
        onBlur={onBlur}
        className="flex min-w-0 flex-1 items-start"
      >
        {searching ? (
          <div className="min-w-14">
            <IconButton
              label="Back"
              tone="plain"
              onClick={stopSearching}
              className="-ml-2 size-9"
            >
              <BackIcon className="size-5" />
            </IconButton>
          </div>
        ) : null}
        <SearchCombobox className="min-w-0 flex-1" />
      </div>
      <Link
        href="/settings/explore"
        aria-label="Settings"
        className="mt-1.5 ml-[29px] flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
      >
        <SettingsIcon className="size-5" />
      </Link>
    </div>
  );
}
