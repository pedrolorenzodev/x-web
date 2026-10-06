"use client";

import { useRef } from "react";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import {
  ExploreIcon,
  MoreHorizontalIcon,
  SettingsIcon,
} from "@/components/ui/icons";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

const MENU_SIZE = { width: 187, height: 88 };

export function SearchOverflowMenu({ advancedHref }: { advancedHref: string }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, MENU_SIZE, "right"),
  );

  return (
    <>
      <IconButton
        ref={anchorRef}
        label="More"
        tone="plain"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="size-9"
      >
        <MoreHorizontalIcon className="size-5" />
      </IconButton>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Search options"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[187px]"
          menuClassName="rounded-xl py-0"
        >
          <MenuItem
            label="Search settings"
            icon={<SettingsIcon />}
            href="/settings/search"
            onSelect={menu.selectItem}
          />
          <MenuItem
            label="Advanced search"
            icon={<ExploreIcon />}
            href={advancedHref}
            onSelect={menu.selectItem}
          />
        </DropdownMenu>
      ) : null}
    </>
  );
}
