"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { routes } from "@/config/routes";
import {
  DropdownMenu,
  MenuItem,
  menuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  LikeIcon,
} from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";
import { TabBar } from "@/components/ui/tab-bar";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  ProfileMediaFilter,
  ProfileSort,
  ProfileTab,
} from "@/features/profile/types/profile-tab";
import { profileAllPath } from "@/features/profile/utils/profile-paths";

const POSTS_MENU_SIZE = { width: 146, height: 177 };
const MEDIA_MENU_SIZE = { width: 125, height: 88 };
const SORT_SUBMENU_TOP = 133;

type ProfileTabsProps = {
  handle: string;
  active: ProfileTab;
  sort: ProfileSort;
  mediaFilter: ProfileMediaFilter;
};

const tabClass =
  "flex h-[53px] flex-auto justify-center px-4 transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

type MenuTabProps = {
  label: string;
  menuLabel: string;
  align: "left" | "right";
  size: { width: number; height: number };
  className?: string;
  children: (select: (event: MouseEvent<HTMLElement>) => void) => ReactNode;
  decoration?: (select: (event: MouseEvent<HTMLElement>) => void) => ReactNode;
  onOpen?: () => void;
};

function MenuTab({
  label,
  menuLabel,
  align,
  size,
  className,
  children,
  decoration,
  onOpen,
}: MenuTabProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, size, align),
  );

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        role="tab"
        aria-selected
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={(event) => {
          if (!menu.isOpen) onOpen?.();
          menu.toggle(event);
        }}
        className={tabClass}
      >
        <span className="relative flex h-full items-center text-base font-bold">
          {label}&nbsp;
          <ChevronDownIcon className="size-[18.75px]" />
          <span className="absolute bottom-0 left-1/2 h-1 w-full min-w-[56px] -translate-x-1/2 rounded-full bg-accent" />
        </span>
      </button>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label={menuLabel}
          style={menu.placement.style}
          origin={menu.placement.origin}
          className={cn("w-max", className)}
          menuClassName="rounded-xl py-0"
          decoration={decoration?.(menu.selectItem)}
        >
          {children(menu.selectItem)}
        </DropdownMenu>
      ) : null}
    </>
  );
}

const postsLabels: Partial<Record<ProfileTab, string>> = {
  posts: "Posts",
  all: "All",
  highlights: "Highlights",
};

function PostsTab({
  handle,
  active,
  sort,
}: Pick<ProfileTabsProps, "handle" | "active" | "sort">) {
  const [sortOpen, setSortOpen] = useState(false);
  const label = postsLabels[active];

  if (!label) {
    return <Tab label="Posts" href={routes.profile(handle)} />;
  }

  const sortBase =
    active === "all" ? profileAllPath(handle) : routes.profile(handle);

  return (
    <MenuTab
      label={label}
      menuLabel="Posts options"
      align="right"
      size={POSTS_MENU_SIZE}
      className="min-w-[146px]"
      onOpen={() => setSortOpen(false)}
      decoration={(select) =>
        sortOpen ? (
          <div
            role="menu"
            aria-label="Sort by"
            style={{ top: SORT_SUBMENU_TOP }}
            className="absolute left-0 w-[190px] overflow-hidden rounded-xl bg-elevated shadow-menu"
          >
            <MenuItem
              label="Most recent"
              icon={<ClockIcon />}
              checked={sort === "recent"}
              href={sortBase}
              onSelect={select}
            />
            <MenuItem
              label="Popular"
              icon={<LikeIcon />}
              checked={sort === "popular"}
              href={`${sortBase}?sort=popular`}
              onSelect={select}
            />
          </div>
        ) : null
      }
    >
      {(select) => (
        <>
          <MenuItem
            label="All"
            checked={active === "all"}
            href={profileAllPath(handle)}
            onSelect={select}
          />
          <MenuItem
            label="Posts"
            checked={active === "posts"}
            href={routes.profile(handle)}
            onSelect={select}
          />
          <MenuItem
            label="Highlights"
            checked={active === "highlights"}
            href={routes.profileHighlights(handle)}
            onSelect={select}
          />
          <div role="separator" className="h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((open) => !open)}
            className={cn(menuItem, "gap-3")}
          >
            <span className="grow">Sort by</span>
            <ChevronRightIcon className="size-[18.75px] shrink-0" />
          </button>
        </>
      )}
    </MenuTab>
  );
}

function MediaTab({
  handle,
  active,
  mediaFilter,
}: Pick<ProfileTabsProps, "handle" | "active" | "mediaFilter">) {
  if (active !== "media") {
    return <Tab label="Media" href={routes.profileMedia(handle)} />;
  }

  return (
    <MenuTab
      label={mediaFilter === "photo" ? "Photos" : "Videos"}
      menuLabel="Media options"
      align="right"
      size={MEDIA_MENU_SIZE}
    >
      {(select) => (
        <>
          <MenuItem
            label="Videos"
            checked={mediaFilter === "video"}
            href={routes.profileMedia(handle)}
            onSelect={select}
          />
          <MenuItem
            label="Photos"
            checked={mediaFilter === "photo"}
            href={`${routes.profileMedia(handle)}?filter=photo`}
            onSelect={select}
          />
        </>
      )}
    </MenuTab>
  );
}

export function ProfileTabs({
  handle,
  active,
  sort,
  mediaFilter,
}: ProfileTabsProps) {
  return (
    <TabBar label="Profile timelines">
      <PostsTab handle={handle} active={active} sort={sort} />
      <Tab
        label="Replies"
        href={routes.profileReplies(handle)}
        active={active === "replies"}
      />
      <Tab
        label="Reposts"
        href={routes.profileReposts(handle)}
        active={active === "reposts"}
      />
      <MediaTab handle={handle} active={active} mediaFilter={mediaFilter} />
    </TabBar>
  );
}
