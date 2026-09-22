import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { NavItemContent } from "@/components/layout/nav-item-content";

type NavItemProps = {
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  href?: string;
};

const row = "group flex w-full py-1";
const pill =
  "flex items-center gap-5 rounded-full py-3 pl-3 pr-7 transition-colors duration-200 ease-[ease] group-hover:bg-foreground/10";

export function NavItem({ label, icon, activeIcon, href }: NavItemProps) {
  if (!href) {
    return (
      <button type="button" className={row}>
        <span className={pill}>
          {icon}
          <span className="text-xl">{label}</span>
        </span>
      </button>
    );
  }

  return (
    <Link href={href} className={row}>
      <span className={pill}>
        <Suspense
          fallback={
            <>
              {icon}
              <span className="text-xl">{label}</span>
            </>
          }
        >
          <NavItemContent
            label={label}
            icon={icon}
            activeIcon={activeIcon ?? icon}
            href={href}
          />
        </Suspense>
      </span>
    </Link>
  );
}
