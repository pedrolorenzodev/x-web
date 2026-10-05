"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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

function isActive(pathname: string, { prefixes, exact, exclude }: NavMatch) {
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
  const active = isActive(usePathname(), match);
  const badgeLabel = badge > 0 ? `${badge} unread items` : undefined;

  return (
    <Link
      href={href}
      aria-label={badge > 0 ? `${label} (${badgeLabel})` : label}
      aria-current={active ? "page" : undefined}
      className="group flex w-full py-1 outline-none"
    >
      <span className="flex items-center gap-5 rounded-full py-3 pr-7 pl-3 transition-[background-color,box-shadow] duration-200 ease-[ease] group-hover:bg-foreground/10 group-focus-visible:shadow-[0_0_0_2px_rgb(135,138,140)]">
        <span className="relative">
          {active ? activeIcon : icon}
          {badge > 0 ? (
            <span
              aria-label={badgeLabel}
              className="absolute -top-1.5 left-3 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-background bg-accent px-1 text-[11px] leading-none font-bold text-white"
            >
              {badge > 99 ? "99+" : badge}
            </span>
          ) : null}
        </span>
        <span className={cn("text-xl", active && "font-bold")}>{label}</span>
      </span>
    </Link>
  );
}
