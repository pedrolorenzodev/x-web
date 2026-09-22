import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabProps = {
  label: string;
  active?: boolean;
  href?: string;
  icon?: ReactNode;
};

const tab =
  "flex h-[53px] flex-auto justify-center px-4 transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

export function Tab({ label, active = false, href, icon }: TabProps) {
  const content = (
    <span
      className={cn(
        "relative flex h-full items-center text-base",
        active ? "font-bold" : "font-medium text-muted",
      )}
    >
      {label}
      {icon ? <>&nbsp;{icon}</> : null}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-1 w-full min-w-[56px] -translate-x-1/2 rounded-full bg-accent" />
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} role="tab" aria-selected={active} className={tab}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" role="tab" aria-selected={active} className={tab}>
      {content}
    </button>
  );
}
