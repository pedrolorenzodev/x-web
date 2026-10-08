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
} from "@/components/ui/icons";
import { PillSearchInput } from "@/components/ui/pill-search-input";
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
      <div className="flex h-[53px] items-center px-4">
        <div className="min-w-14">
          <BackButton />
        </div>
        <form
          role="search"
          className="min-w-0 flex-1 self-start pt-[8.5px]"
          onSubmit={(event) => {
            event.preventDefault();
            const term = query.trim();
            if (term) router.push(`${searchHref(term, "typed_query")}&f=list`);
          }}
        >
          <PillSearchInput
            type="search"
            value={query}
            onValueChange={setQuery}
            placeholder="Search Lists"
            label="Search Lists"
            className="[&_input]:[&::-webkit-search-cancel-button]:hidden"
          />
        </form>
        <div className="-mr-[5px] flex shrink-0 items-center gap-[3px]">
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
