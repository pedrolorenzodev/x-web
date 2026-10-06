"use client";

import { useState, type FormEvent } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { BackIcon, ExploreIcon } from "@/components/ui/icons";

type HistorySearchHeaderProps = {
  defaultValue: string;
  onSubmit: (query: string) => void;
  onExit: () => void;
};

export function HistorySearchHeader({
  defaultValue,
  onSubmit,
  onExit,
}: HistorySearchHeaderProps) {
  const [value, setValue] = useState(defaultValue);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (query) onSubmit(query);
  }

  return (
    <div className="sticky top-0 z-3 bg-background">
      <div className="flex h-[53px] items-start px-4 pt-2">
        <div className="min-w-14">
          <IconButton
            label="Back"
            tone="plain"
            onClick={onExit}
            className="-ml-2 size-9"
          >
            <BackIcon className="size-5" />
          </IconButton>
        </div>
        <form role="search" onSubmit={submit} className="min-w-0 flex-1">
          <label className="flex h-11 w-full cursor-text items-center rounded-full border border-border-strong bg-background transition-[border-color,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] focus-within:border-accent focus-within:shadow-[inset_0_0_0_1px_var(--color-accent),0_0_0_1px_var(--color-accent)]">
            <span className="flex w-7 shrink-0 pl-3">
              <ExploreIcon className="size-4 text-muted" />
            </span>
            <input
              type="text"
              value={value}
              autoFocus
              placeholder="Search Bookmarks"
              aria-label="Search Bookmarks"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              onChange={(event) => setValue(event.target.value)}
              className="h-10 min-w-0 flex-1 bg-transparent pr-4 pl-1 text-sm text-foreground outline-none placeholder:text-muted"
            />
          </label>
        </form>
      </div>
    </div>
  );
}
