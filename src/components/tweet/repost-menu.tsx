"use client";

import type { MouseEvent } from "react";
import { QuotePencilIcon, RetweetIcon } from "@/components/ui/icons";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import type { DropdownMenuController } from "@/hooks/use-dropdown-menu";

const MENU_SIZE = { width: 114, height: 88 };

type RepostMenuPlacement = MenuPlacement;

export function placeRepostMenu(anchor: DOMRect): RepostMenuPlacement {
  return placeOverAnchor(anchor, MENU_SIZE, "right");
}

type RepostMenuProps = {
  menu: DropdownMenuController<RepostMenuPlacement>;
  retweeted: boolean;
  quoteHref: string;
  onRepost: () => void;
};

export function RepostMenu({
  menu,
  retweeted,
  quoteHref,
  onRepost,
}: RepostMenuProps) {
  if (!menu.placement) return null;

  function repost(event: MouseEvent<HTMLElement>) {
    menu.selectItem(event);
    onRepost();
  }

  return (
    <DropdownMenu
      menu={menu}
      label="Repost options"
      style={menu.placement.style}
      origin={menu.placement.origin}
      className="w-max"
      menuClassName="rounded-xl py-0"
    >
      <MenuItem
        label={retweeted ? "Undo repost" : "Repost"}
        icon={<RetweetIcon />}
        onSelect={repost}
      />
      <MenuItem
        label="Quote"
        icon={<QuotePencilIcon />}
        href={quoteHref}
        onSelect={menu.selectItem}
      />
    </DropdownMenu>
  );
}
