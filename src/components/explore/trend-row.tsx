"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Trend } from "@/types/trend";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { FrownIcon, MoreHorizontalIcon } from "@/components/ui/icons";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { cn } from "@/lib/utils";
import { formatCount } from "@/utils/format-count";
import { trendSearchHref } from "@/utils/search-href";
import { insetRect } from "@/utils/floating-position";

const CARET_INSET = 8;
const MENU_SIZE = { width: 337, height: 264 };

const feedbackOptions = [
  "The associated content is not relevant",
  "This trend is spam",
  "This trend is abusive or harmful",
  "Not interested in this",
  "This trend is a duplicate",
  "This trend is harmful or spammy",
];

type TrendRowProps = {
  trend: Trend;
  rank?: number;
  onDismiss: (trendId: string) => void;
  className?: string;
};

function trendContext(trend: Trend) {
  return trend.context.kind === "location"
    ? `Trending in ${trend.context.location}`
    : `${trend.context.category} · Trending`;
}

export function TrendRow({ trend, rank, onDismiss, className }: TrendRowProps) {
  const caretRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(caretRef, (anchor) =>
    placeOverAnchor(insetRect(anchor, CARET_INSET), MENU_SIZE, "right"),
  );

  return (
    <div
      data-testid="trend"
      className={cn(
        "relative flex items-start px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3",
        className,
      )}
    >
      <Link
        href={trendSearchHref(trend.name)}
        aria-label={trend.name}
        className="absolute inset-0"
      />
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate text-xs text-muted">
          {rank ? `${rank} · ` : null}
          {trendContext(trend)}
        </span>
        <span className="mt-0.5 truncate text-base font-bold">{trend.name}</span>
        {trend.postCount ? (
          <span className="mt-0.5 text-xs text-muted">
            {formatCount(trend.postCount)} posts
          </span>
        ) : null}
      </span>
      <IconButton
        ref={caretRef}
        label="More"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="relative -m-2 ml-2"
      >
        <MoreHorizontalIcon className="size-[18.75px]" />
      </IconButton>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Trend feedback"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-[337px]"
          menuClassName="rounded-xl py-0"
        >
          {feedbackOptions.map((option) => (
            <MenuItem
              key={option}
              label={option}
              icon={<FrownIcon />}
              onSelect={(event) => {
                menu.selectItem(event);
                onDismiss(trend.id);
              }}
            />
          ))}
        </DropdownMenu>
      ) : null}
    </div>
  );
}
