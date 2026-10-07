"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import {
  ChatActiveIcon,
  ChatIcon,
  ComposeIcon,
  ExploreIcon,
  GrokActiveIcon,
  GrokIcon,
  HomeActiveIcon,
  HomeIcon,
  NotificationsActiveIcon,
  NotificationsIcon,
  SearchIcon,
} from "@/components/ui/icons";
import {
  isNavActive,
  type NavMatch,
} from "@/components/layout/nav-item-content";
import { useScrollingDown } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

const icon = "size-[26.25px]";

type MobileTab = {
  label: string;
  href: string;
  match: NavMatch;
  icon: ReactNode;
  activeIcon: ReactNode;
  badge?: number;
};

const fade = "transition-opacity duration-[170ms] ease-linear";

export function MobileNav({
  unreadNotifications,
}: {
  unreadNotifications: number;
}) {
  const pathname = usePathname();
  const scrollingDown = useScrollingDown();

  const tabs: MobileTab[] = [
    {
      label: "Home",
      href: routes.home,
      match: { prefixes: [routes.home, "/home"], exact: true },
      icon: <HomeIcon className={icon} />,
      activeIcon: <HomeActiveIcon className={icon} />,
    },
    {
      label: "Search and explore",
      href: routes.explore,
      match: {
        prefixes: [routes.explore, routes.search, "/hashtag", "/i/trending"],
      },
      icon: <ExploreIcon className={icon} />,
      activeIcon: <SearchIcon className={icon} />,
    },
    {
      label: "Grok",
      href: routes.grok,
      match: { prefixes: [routes.grok] },
      icon: <GrokIcon className={icon} />,
      activeIcon: <GrokActiveIcon className={icon} />,
    },
    {
      label: "Notifications",
      href: routes.notifications,
      match: { prefixes: [routes.notifications] },
      icon: <NotificationsIcon className={icon} />,
      activeIcon: <NotificationsActiveIcon className={icon} />,
      badge: unreadNotifications,
    },
    {
      label: "Direct Messages",
      href: routes.chat,
      match: { prefixes: [routes.chat, "/messages"], exclude: [routes.chatShare] },
      icon: <ChatIcon className={icon} />,
      activeIcon: <ChatActiveIcon className={icon} />,
    },
  ];

  return (
    <div className="min-[500px]:hidden">
      <Link
        href={routes.composePost}
        aria-label="Compose a post"
        className={cn(
          "fixed right-5 bottom-[73px] z-30 flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_5px_rgb(217_217_217/0.2),0_1px_4px_1px_rgb(217_217_217/0.25)] layout-fullwidth:hidden",
          fade,
          scrollingDown && "opacity-30",
        )}
      >
        <ComposeIcon className="size-6" />
      </Link>
      <nav
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex h-[53.5px] border-t border-border bg-background",
          fade,
          scrollingDown && "opacity-30",
        )}
      >
        {tabs.map((tab) => {
          const active = isNavActive(pathname, tab.match);
          const badge = tab.badge ?? 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={badge > 0 ? `${tab.label} (${badge} unread items)` : tab.label}
              aria-current={active ? "page" : undefined}
              className="group flex flex-1 items-center justify-center outline-none"
            >
              <span className="relative flex size-[42.3px] items-center justify-center rounded-full transition-colors duration-200 ease-[ease] group-hover:bg-foreground/10 group-focus-visible:shadow-[0_0_0_2px_rgb(135,138,140)]">
                {active ? tab.activeIcon : tab.icon}
                {badge > 0 ? (
                  <span className="absolute top-0.5 left-[22px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-background bg-accent px-1 text-[11px] leading-none font-bold text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
