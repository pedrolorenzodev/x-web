import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  info: "bg-black/77",
  label: "bg-black/30 font-bold",
} as const;

export function MediaBadge({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none flex h-5 items-center rounded-[4px] px-2 text-xs text-white",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
