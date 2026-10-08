"use client";

import { useRef, useState, type ReactNode } from "react";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { FiltersIcon } from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";
import type { EngagementSort } from "@/features/tweet/api/get-post-activity";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

type ActivityTab = "quotes" | "retweets" | "likes";

const SORTS: { value: EngagementSort; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "recent", label: "Recent" },
];

type PostActivityProps = {
  handle: string;
  tweetId: string;
  active: ActivityTab;
  showLikes: boolean;
  lists: Record<EngagementSort, ReactNode>;
};

export function PostActivity({
  handle,
  tweetId,
  active,
  showLikes,
  lists,
}: PostActivityProps) {
  const [sort, setSort] = useState<EngagementSort>("top");
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, { width: 166, height: 141 }, "right"),
  );

  return (
    <>
      <PageHeader
        title="Post activity"
        action={
          <IconButton
            ref={anchorRef}
            label="Sort engagements"
            tone="plain"
            aria-haspopup="menu"
            aria-expanded={menu.isOpen}
            onClick={menu.toggle}
            className="size-9"
          >
            <FiltersIcon className="size-5" />
          </IconButton>
        }
      >
        <nav role="tablist" className="flex border-b border-border">
          <Tab
            label="Quotes"
            href={routes.tweetQuotes(handle, tweetId)}
            active={active === "quotes"}
          />
          <Tab
            label="Reposts"
            href={routes.tweetRetweets(handle, tweetId)}
            active={active === "retweets"}
          />
          {showLikes ? (
            <Tab
              label="Likes"
              href={routes.tweetLikes(handle, tweetId)}
              active={active === "likes"}
            />
          ) : null}
        </nav>
      </PageHeader>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Sort engagements"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[166px]"
          menuClassName="rounded-xl py-0"
        >
          <div className="flex h-[53px] items-center border-b border-border px-5 text-base text-muted">
            Sort engagements
          </div>
          {SORTS.map((option) => (
            <MenuItem
              key={option.value}
              label={option.label}
              checked={option.value === sort}
              onSelect={(event) => {
                menu.selectItem(event);
                setSort(option.value);
              }}
            />
          ))}
        </DropdownMenu>
      ) : null}
      {lists[sort]}
    </>
  );
}
