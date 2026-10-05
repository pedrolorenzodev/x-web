"use client";

import { useRef } from "react";
import {
  DropdownMenu,
  MenuItem,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "@/components/ui/icons";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { cn } from "@/lib/utils";

const items = [
  { label: "About", href: "https://about.x.com" },
  { label: "Get App", href: "https://help.x.com/using-x/download-the-x-app" },
  { label: "Developers", href: "https://developer.x.com" },
];

function placeAbove(anchor: DOMRect): MenuPlacement {
  return {
    style: {
      left: anchor.left,
      bottom: window.innerHeight - anchor.bottom,
    },
    origin: "bottom-left",
  };
}

export function FooterMoreMenu() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, placeAbove);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className={cn(
          "my-0.5 flex h-5 items-center gap-0.5 pr-3 text-[11px] leading-3 text-muted hover:underline",
        )}
      >
        More
        <MoreHorizontalIcon className="size-3" />
      </button>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="More"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max"
          menuClassName="rounded-xl py-0"
        >
          {items.map((item) => (
            <MenuItem
              key={item.label}
              label={item.label}
              href={item.href}
              external
              onSelect={menu.selectItem}
            />
          ))}
        </DropdownMenu>
      ) : null}
    </>
  );
}
