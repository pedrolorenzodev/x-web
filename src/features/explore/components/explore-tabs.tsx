"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ExploreTabId } from "@/types/trend";
import { TabBar } from "@/components/ui/tab-bar";
import { cn } from "@/lib/utils";

export const EXPLORE_TABS: { id: ExploreTabId; label: string }[] = [
  { id: "for_you", label: "Explore" },
  { id: "trending", label: "Trending" },
  { id: "news", label: "News" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
];

export function exploreTabHref(id: ExploreTabId) {
  return `/explore/tabs/${id}`;
}

function activeTab(pathname: string): ExploreTabId {
  const match = EXPLORE_TABS.find(({ id }) => pathname === exploreTabHref(id));
  return match?.id ?? "for_you";
}

export function ExploreTabs() {
  const active = activeTab(usePathname());

  return (
    <TabBar label="Explore tabs">
      {EXPLORE_TABS.map(({ id, label }) => {
        const selected = id === active;
        return (
          <Link
            key={id}
            href={exploreTabHref(id)}
            role="tab"
            aria-selected={selected}
            className="flex h-[53px] shrink-0 grow justify-center px-4 transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
          >
            <span
              className={cn(
                "relative flex h-full items-center text-base whitespace-nowrap",
                selected ? "font-bold" : "font-medium text-muted",
              )}
            >
              {label}
              {selected ? (
                <span className="absolute bottom-0 left-1/2 h-1 w-full min-w-14 -translate-x-1/2 rounded-full bg-accent" />
              ) : null}
            </span>
          </Link>
        );
      })}
    </TabBar>
  );
}
