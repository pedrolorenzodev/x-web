"use client";

import { useRef } from "react";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import {
  FlagIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
} from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { communityLinks } from "@/features/communities/config/links";

const MENU_SIZE = { width: 208, height: 88 };

export function CommunityMoreMenu() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu<MenuPlacement>(anchorRef, (anchor) =>
    placeOverAnchor(anchor, MENU_SIZE, "right"),
  );

  return (
    <>
      <Tooltip label="More">
        <IconButton
          ref={anchorRef}
          label="More"
          tone="plain"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className="-mr-2 size-9"
        >
          <MoreHorizontalIcon className="size-5" />
        </IconButton>
      </Tooltip>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Community options"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[200px]"
          menuClassName="rounded-xl py-0"
        >
          <MenuItem
            label="Report Community"
            icon={<FlagIcon />}
            href={communityLinks.report}
            external
            onSelect={menu.selectItem}
          />
          <MenuItem
            label="About Communities"
            icon={<HelpCircleIcon />}
            href={communityLinks.about}
            external
            onSelect={menu.selectItem}
          />
        </DropdownMenu>
      ) : null}
    </>
  );
}
