"use client";

import { useRef, useState } from "react";
import type { NewsStory } from "@/types/news";
import { NewsRow } from "@/components/explore/news-row";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { CloseIcon } from "@/components/ui/icons";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { card } from "@/components/layout/right-panel/styles";

const MENU_SIZE = { width: 167, height: 132 };
const dismissOptions = ["Dismiss for a day", "Dismiss for a week", "Not interested"];

export function NewsCard({ stories }: { stories: NewsStory[] }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(closeRef, (anchor) =>
    placeOverAnchor(anchor, MENU_SIZE, "right"),
  );
  const [hidden, setHidden] = useState(false);

  if (hidden || stories.length === 0) return null;

  return (
    <section className={card}>
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-extrabold">Today’s News</h2>
        <IconButton
          ref={closeRef}
          label="Close"
          tone="plain"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className="size-8"
        >
          <CloseIcon className="size-[18.75px]" />
        </IconButton>
      </div>
      {stories.slice(0, 3).map((story, index) => (
        <NewsRow
          key={story.id}
          story={story}
          variant="panel"
          className={index === 2 ? "rounded-b-2xl" : undefined}
        />
      ))}
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Dismiss Today's News"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max"
          menuClassName="rounded-xl py-0"
        >
          {dismissOptions.map((option) => (
            <MenuItem
              key={option}
              label={option}
              onSelect={(event) => {
                menu.selectItem(event);
                setHidden(true);
              }}
            />
          ))}
        </DropdownMenu>
      ) : null}
    </section>
  );
}
