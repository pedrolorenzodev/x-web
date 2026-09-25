"use client";

import type { CSSProperties, MouseEvent } from "react";
import { QuoteIcon, RetweetIcon } from "@/components/ui/icons";
import {
  DropdownMenu,
  menuItem,
  type DropdownOrigin,
} from "@/components/ui/dropdown-menu";
import type { DropdownMenuController } from "@/hooks/use-dropdown-menu";
import { cn } from "@/lib/utils";

const MENU_WIDTH = 200;
const MENU_HEIGHT = 112;

type RepostMenuPlacement = {
  style: CSSProperties;
  origin: DropdownOrigin;
};

export function placeOverAnchor(anchor: DOMRect): RepostMenuPlacement {
  const fitsRight = anchor.left + MENU_WIDTH <= window.innerWidth;
  const fitsBelow = anchor.top + MENU_HEIGHT <= window.innerHeight;
  return {
    style: {
      ...(fitsRight
        ? { left: anchor.left }
        : { right: window.innerWidth - anchor.right }),
      ...(fitsBelow
        ? { top: anchor.top }
        : { bottom: window.innerHeight - anchor.bottom }),
    },
    origin: `${fitsBelow ? "top" : "bottom"}-${fitsRight ? "left" : "right"}`,
  };
}

type RepostMenuProps = {
  menu: DropdownMenuController<RepostMenuPlacement>;
  retweeted: boolean;
  onRepost: () => void;
};

export function RepostMenu({ menu, retweeted, onRepost }: RepostMenuProps) {
  if (!menu.placement) return null;

  function repost(event: MouseEvent<HTMLButtonElement>) {
    menu.selectItem(event);
    onRepost();
  }

  return (
    <DropdownMenu
      menu={menu}
      label="Repost options"
      style={menu.placement.style}
      origin={menu.placement.origin}
      className="w-max min-w-[150px]"
    >
      <button
        type="button"
        role="menuitem"
        onClick={repost}
        className={cn(menuItem, "gap-3")}
      >
        <RetweetIcon className="size-[18.75px] shrink-0" />
        {retweeted ? "Undo repost" : "Repost"}
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={menu.selectItem}
        className={cn(menuItem, "gap-3")}
      >
        <QuoteIcon className="size-[18.75px] shrink-0" />
        Quote
      </button>
    </DropdownMenu>
  );
}
