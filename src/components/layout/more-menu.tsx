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
import { SidebarTooltip } from "@/components/layout/sidebar-tooltip";
import {
  expandedOnly,
  navLink,
  navPill,
} from "@/components/layout/sidebar-styles";

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
      <SidebarTooltip label="More">
        <button
          ref={anchorRef}
          type="button"
          aria-label="More menu items"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className={navLink}
        >
          <span className={navPill}>
            <MoreIcon className="size-[26.25px]" />
            <span data-nav-label className={`text-xl ${expandedOnly}`}>
              More
            </span>
          </span>
        </button>
      </SidebarTooltip>

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
