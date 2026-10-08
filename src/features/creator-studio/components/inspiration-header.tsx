import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import {
  BookmarkActiveIcon,
  BookmarkIcon,
  ChevronRightIcon,
  LikeActiveIcon,
  LikeIcon,
  QuoteIcon,
  ReplyIcon,
} from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";
import { TabBar } from "@/components/ui/tab-bar";
import type {
  InspirationSort,
  InspirationWindow,
} from "@/features/creator-studio/types/inspiration";
import { cn } from "@/lib/utils";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const windows: { id: InspirationWindow; label: string }[] = [
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7d" },
  { id: "30d", label: "Last 30d" },
];

const sorts: {
  id: InspirationSort;
  label: string;
  icon: Icon;
  activeIcon: Icon;
}[] = [
  { id: "likes", label: "Most Likes", icon: LikeIcon, activeIcon: LikeActiveIcon },
  { id: "replies", label: "Most Replies", icon: ReplyIcon, activeIcon: ReplyIcon },
  { id: "quotes", label: "Most Quotes", icon: QuoteIcon, activeIcon: QuoteIcon },
  {
    id: "bookmarks",
    label: "Most Bookmarks",
    icon: BookmarkIcon,
    activeIcon: BookmarkActiveIcon,
  },
];

type InspirationHeaderProps = {
  window: InspirationWindow;
  sort: InspirationSort;
  country: string;
};

export function InspirationHeader({
  window,
  sort,
  country,
}: InspirationHeaderProps) {
  return (
    <PageHeader
      title="Inspiration"
      align="center"
      action={
        <span className="flex h-8 items-center gap-1 rounded-full border border-border-strong pr-2 pl-3 text-sm font-bold">
          {country}
          <ChevronRightIcon className="size-4 text-muted" />
        </span>
      }
    >
      <TabBar label="Time range" className="border-b-0">
        {windows.map((item) => (
          <Tab
            key={item.id}
            label={item.label}
            active={item.id === window}
            href={routes.creatorInspirationFor(item.id, sort)}
          />
        ))}
      </TabBar>
      <div className="flex gap-2 overflow-x-auto border-y border-border px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sorts.map((item) => {
          const active = item.id === sort;
          const ChipIcon = active ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.id}
              href={routes.creatorInspirationFor(window, item.id)}
              replace
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-base font-bold transition-colors duration-200 ease-[ease]",
                active
                  ? "border-accent bg-accent text-white"
                  : "border-border-strong hover:bg-foreground/10",
              )}
            >
              <ChipIcon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </PageHeader>
  );
}
