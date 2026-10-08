"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { dispatchNavReselect } from "@/hooks/use-nav-reselect";
import { SidebarTooltip } from "@/components/layout/sidebar-tooltip";
import {
  expandedOnly,
  navLink,
  navPill,
} from "@/components/layout/sidebar-styles";

export type NavMatch = {
  prefixes: string[];
  exact?: boolean;
  exclude?: string[];
};

type NavItemContentProps = {
  label: string;
  icon: ReactNode;
  activeIcon: ReactNode;
  href: string;
  match: NavMatch;
  badge: number;
};

function startsWithSegment(pathname: string, prefix: string) {
  const path = pathname.toLowerCase();
  const base = prefix.toLowerCase();
  return path === base || path.startsWith(`${base}/`);
}

export function isNavActive(
  pathname: string,
  { prefixes, exact, exclude }: NavMatch,
) {
  if (exclude?.some((prefix) => startsWithSegment(pathname, prefix))) {
    return false;
  }
  return prefixes.some((prefix) =>
    exact
      ? pathname.toLowerCase() === prefix.toLowerCase()
      : startsWithSegment(pathname, prefix),
  );
}

export function NavItemContent({
  label,
  icon,
  activeIcon,
  href,
  match,
  badge,
}: NavItemContentProps) {
  const pathname = usePathname();
  const active = isNavActive(pathname, match);
  const badgeLabel = badge > 0 ? `${badge} unread items` : undefined;

  return (
    <SidebarTooltip label={label}>
      <Link
        href={href}
        aria-label={
          badge > 0
            ? `${label} (${badge} unread ${label.toLowerCase()})`
            : label
        }
        aria-current={active ? "page" : undefined}
        onClick={(event) => {
          if (pathname === href && dispatchNavReselect(href)) {
            event.preventDefault();
          }
        }}
        className={navLink}
      >
        <span className={navPill}>
          <span className="relative">
            {active ? activeIcon : icon}
            {badge > 0 ? (
              <span
                aria-label={badgeLabel}
                className="absolute -top-1.5 left-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-background bg-accent px-1 text-[11px] leading-none font-normal text-white"
              >
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </span>
          <span
            data-nav-label
            className={cn("text-xl", expandedOnly, active && "font-bold")}
          >
            {label}
          </span>
        </span>
      </Link>
    </SidebarTooltip>
  );
}
