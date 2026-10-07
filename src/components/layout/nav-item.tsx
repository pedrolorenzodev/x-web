import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";
import {
  NavItemContent,
  type NavMatch,
} from "@/components/layout/nav-item-content";
import {
  expandedOnly,
  navLink,
  navPill,
} from "@/components/layout/sidebar-styles";

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
    <span className={navPill}>
      {icon}
      <span className={`text-xl ${expandedOnly}`}>{label}</span>
    </span>
  );

  return (
    <Suspense
      fallback={
        <Link href={href} className={navLink}>
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
