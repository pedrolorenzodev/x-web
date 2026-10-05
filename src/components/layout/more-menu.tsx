"use client";

import { useRef } from "react";
import { routes } from "@/config/routes";
import {
  DropdownMenu,
  MenuItem,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import {
  AdsIcon,
  BusinessIcon,
  CommunitiesIcon,
  ListsIcon,
  MoreIcon,
  SettingsIcon,
  SpacesIcon,
} from "@/components/ui/icons";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

const MENU_WIDTH = 318;

function placeOverMoreButton(anchor: DOMRect): MenuPlacement {
  return {
    style: {
      left: anchor.left,
      bottom: Math.max(window.innerHeight - anchor.bottom, 0),
      width: MENU_WIDTH,
      maxHeight: anchor.bottom,
    },
    origin: "bottom-left",
  };
}

export function MoreMenu({ handle }: { handle: string }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, placeOverMoreButton);

  const items = [
    { label: "Lists", href: routes.lists(handle), icon: <ListsIcon /> },
    {
      label: "Communities",
      href: routes.communities(handle),
      icon: <CommunitiesIcon />,
    },
    { label: "Business", href: routes.business, icon: <BusinessIcon /> },
    { label: "Ads", href: routes.ads, icon: <AdsIcon />, external: true },
    { label: "Create your Space", href: routes.spaces, icon: <SpacesIcon /> },
    {
      label: "Settings and privacy",
      href: routes.settings,
      icon: <SettingsIcon />,
    },
  ];

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label="More menu items"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="group flex w-full py-1 outline-none"
      >
        <span className="flex items-center gap-5 rounded-full py-3 pr-7 pl-3 transition-[background-color,box-shadow] duration-200 ease-[ease] group-hover:bg-foreground/10 group-focus-visible:shadow-[0_0_0_2px_rgb(135,138,140)]">
          <MoreIcon className="size-[26.25px]" />
          <span className="text-xl">More</span>
        </span>
      </button>

      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="More menu items"
          style={menu.placement.style}
          origin={menu.placement.origin}
          menuClassName="rounded-xl py-0"
        >
          {items.map((item) => (
            <MenuItem
              key={item.label}
              size="lg"
              label={item.label}
              icon={item.icon}
              href={item.href}
              external={item.external}
              onSelect={menu.selectItem}
            />
          ))}
        </DropdownMenu>
      ) : null}
    </>
  );
}
