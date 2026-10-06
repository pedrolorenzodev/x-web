"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import {
  DropdownMenu,
  placeOverAnchor,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

export type SelectMenuItem = (
  event: MouseEvent<HTMLElement>,
  action?: () => void,
) => void;

type HeaderMenuProps = {
  label: string;
  menuLabel: string;
  icon: ReactNode;
  size: { width: number; height: number };
  children: (select: SelectMenuItem) => ReactNode;
};

export function HeaderMenu({
  label,
  menuLabel,
  icon,
  size,
  children,
}: HeaderMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu<MenuPlacement>(anchorRef, (anchor) =>
    placeOverAnchor(anchor, size, "right"),
  );

  const select: SelectMenuItem = (event, action) => {
    menu.selectItem(event);
    action?.();
  };

  return (
    <>
      <Tooltip label={label}>
        <IconButton
          ref={anchorRef}
          label={label}
          tone="plain"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className="size-9"
        >
          {icon}
        </IconButton>
      </Tooltip>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label={menuLabel}
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max max-w-[384px] min-w-[200px]"
          menuClassName="rounded-xl py-0"
        >
          {children(select)}
        </DropdownMenu>
      ) : null}
    </>
  );
}
