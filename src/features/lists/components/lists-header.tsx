"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { routes } from "@/config/routes";
import { searchHref } from "@/utils/search-href";
import { BackButton } from "@/components/layout/back-button";
import { MenuItem } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import {
  ListPlusIcon,
  ListsIcon,
  MoreHorizontalIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { HeaderMenu } from "@/features/lists/components/header-menu";

type ListsHeaderProps = {
  handle: string;
};

export function ListsHeader({ handle }: ListsHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="sticky top-0 z-3 bg-background/65 backdrop-blur-[12px]">
      <div className="flex h-[53px] items-center gap-2 px-4">
        <div className="min-w-14">
          <BackButton />
        </div>
        <form
          role="search"
          className="min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            const term = query.trim();
            if (term) router.push(`${searchHref(term, "typed_query")}&f=list`);
          }}
        >
          <label className="flex h-10 cursor-text items-center rounded-full border border-outline transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:shadow-[0_0_0_1px_var(--color-accent)]">
            <span className="flex w-7 shrink-0 pl-3">
              <SearchIcon className="size-4 text-muted" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Lists"
              aria-label="Search Lists"
              className="h-9 min-w-0 flex-1 bg-transparent pr-4 pl-1 text-sm outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
            />
          </label>
        </form>
        <div className="ml-2 flex shrink-0 items-center gap-2">
          <Tooltip label="Create a new List">
            <IconButton
              label="Create a new List"
              tone="plain"
              onClick={() => router.push(routes.listCreate)}
              className="size-9"
            >
              <ListPlusIcon className="size-5" />
            </IconButton>
          </Tooltip>
          <HeaderMenu
            label="More"
            menuLabel="Lists options"
            icon={<MoreHorizontalIcon className="size-5" />}
            size={{ width: 200, height: 44 }}
          >
            {(select) => (
              <MenuItem
                label="Lists you’re on"
                icon={<ListsIcon />}
                href={`${routes.lists(handle)}/memberships`}
                onSelect={select}
              />
            )}
          </HeaderMenu>
        </div>
      </div>
    </div>
  );
}
