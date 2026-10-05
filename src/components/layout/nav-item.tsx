import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";
import {
  NavItemContent,
  type NavMatch,
} from "@/components/layout/nav-item-content";

type NavItemProps = {
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  href: string;
  match?: NavMatch;
  badge?: number;
};

export function NavItem({
  label,
  icon,
  activeIcon,
  href,
  match = { prefixes: [href] },
  badge = 0,
}: NavItemProps) {
  const fallback = (
    <span className="flex items-center gap-5 rounded-full py-3 pr-7 pl-3">
      {icon}
      <span className="text-xl">{label}</span>
    </span>
  );

  return (
    <Suspense
      fallback={
        <Link href={href} className="group flex w-full py-1">
          {fallback}
        </Link>
      }
    >
      <NavItemContent
        label={label}
        icon={icon}
        activeIcon={activeIcon ?? icon}
        href={href}
        match={match}
        badge={badge}
      />
    </Suspense>
  );
}
