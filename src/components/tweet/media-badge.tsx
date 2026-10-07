import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MediaBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none flex h-5 items-center rounded-[4px] bg-black/77 px-2 text-xs text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
