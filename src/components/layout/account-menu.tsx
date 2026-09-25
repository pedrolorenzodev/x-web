"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { routes } from "@/config/routes";
import { PopoverArrowIcon } from "@/components/ui/icons";
import { DropdownMenu, menuItem } from "@/components/ui/dropdown-menu";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

type AccountMenuProps = {
  handle: string;
  children: ReactNode;
};

type Placement = {
  left: number;
  bottom: number;
  arrowLeft: number;
};

const MENU_WIDTH = 300;
const ANCHOR_GAP = 10;

function placeAbove(anchor: DOMRect): Placement {
  const viewportWidth = window.innerWidth;
  const center = anchor.left + anchor.width / 2;
  const bottom = window.innerHeight - anchor.top + ANCHOR_GAP;

  if (center >= MENU_WIDTH / 2 && viewportWidth - center >= MENU_WIDTH / 2) {
    return { left: center - MENU_WIDTH / 2, bottom, arrowLeft: MENU_WIDTH / 2 };
  }
  if (viewportWidth - anchor.left >= MENU_WIDTH) {
    return { left: anchor.left, bottom, arrowLeft: anchor.width / 2 };
  }
  if (anchor.right >= MENU_WIDTH) {
    return {
      left: anchor.right - MENU_WIDTH,
      bottom,
      arrowLeft: MENU_WIDTH - anchor.width / 2,
    };
  }
  return { left: 0, bottom, arrowLeft: center };
}

function ItemLabel({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="min-w-0 grow truncate">{children}</span>
      <span className="ml-5 w-5 shrink-0" />
    </>
  );
}

export function AccountMenu({ handle, children }: AccountMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, placeAbove);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="mt-auto mb-3 flex w-full items-center gap-3 rounded-full p-3 transition-colors duration-200 ease-[ease] hover:bg-foreground/10 active:bg-foreground/20"
      >
        {children}
      </button>

      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Account menu"
          style={{ left: menu.placement.left, bottom: menu.placement.bottom }}
          className="w-[300px]"
          decoration={
            <PopoverArrowIcon
              style={{ left: menu.placement.arrowLeft - 12 }}
              className="absolute -bottom-[11px] h-[16.25px] w-6 rotate-180 text-elevated"
            />
          }
        >
          <button
            type="button"
            role="menuitem"
            onClick={menu.selectItem}
            className={menuItem}
          >
            <ItemLabel>Add an existing account</ItemLabel>
          </button>
          <Link
            href={routes.logout}
            role="menuitem"
            onClick={menu.selectItem}
            className={menuItem}
          >
            <ItemLabel>Log out @{handle}</ItemLabel>
          </Link>
        </DropdownMenu>
      ) : null}
    </>
  );
}
