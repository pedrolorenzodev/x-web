"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavItemContentProps = {
  label: string;
  icon: ReactNode;
  activeIcon: ReactNode;
  href: string;
};

export function NavItemContent({
  label,
  icon,
  activeIcon,
  href,
}: NavItemContentProps) {
  const active = usePathname() === href;

  return (
    <>
      {active ? activeIcon : icon}
      <span className={cn("text-xl", active && "font-bold")}>
        {label}
      </span>
    </>
  );
}
