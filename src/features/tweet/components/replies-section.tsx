"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import type { Tweet, TweetActions } from "@/types/tweet";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/ui/icons";
import { TweetCard } from "@/components/tweet/tweet-card";
import { engagementScore } from "@/features/tweet/utils/engagement-score";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

type ReplySort = "Relevant" | "Recent" | "Likes";

const SORTS: ReplySort[] = ["Relevant", "Recent", "Likes"];

function sortReplies(replies: Tweet[], sort: ReplySort) {
  const newest = (a: Tweet, b: Tweet) => b.createdAt.localeCompare(a.createdAt);
  return [...replies].sort((a, b) => {
    if (sort === "Recent") return newest(a, b);
    const score =
      sort === "Likes"
        ? b.stats.likes - a.stats.likes
        : engagementScore(b) - engagementScore(a);
    return score || newest(a, b);
  });
}

type RepliesSectionProps = {
  replies: Tweet[];
  quotesHref: string;
  actions: TweetActions;
  composer: ReactNode;
};

export function RepliesSection({
  replies,
  quotesHref,
  actions,
  composer,
}: RepliesSectionProps) {
  const [sort, setSort] = useState<ReplySort>("Relevant");
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, { width: 135, height: 186 }, "right"),
  );

  return (
    <>
      <div className="flex h-[29px] items-center justify-between border-b border-border px-4 text-sm font-medium text-muted">
        <button
          ref={anchorRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className="flex items-center gap-1 hover:text-foreground"
        >
          {sort}
          <ChevronDownIcon className="size-3" />
        </button>
        <Link href={quotesHref} className="flex items-center gap-1 hover:text-foreground">
          View quotes
          <ChevronRightIcon className="size-3" />
        </Link>
      </div>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Sort replies"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-[135px]"
          menuClassName="rounded-xl py-0"
        >
          <div className="flex h-[53px] items-center border-b border-border px-5 text-base text-muted">
            Sort replies
          </div>
          {SORTS.map((option) => (
            <MenuItem
              key={option}
              label={option}
              checked={option === sort}
              onSelect={(event) => {
                menu.selectItem(event);
                setSort(option);
              }}
            />
          ))}
        </DropdownMenu>
      ) : null}
      {composer}
      {sortReplies(replies, sort).map((reply) => (
        <TweetCard key={reply.id} tweet={reply} actions={actions} />
      ))}
    </>
  );
}
