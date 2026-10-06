import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ViewerButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
};

export function ViewerButton({
  label,
  onClick,
  className,
  children,
}: ViewerButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "z-1 flex size-9 items-center justify-center rounded-full border border-transparent bg-black/75 text-white backdrop-blur-[4px]",
        "transition-colors duration-200 ease-[ease] hover:bg-media-control-hover/75",
        className,
      )}
    >
      {children}
    </button>
  );
}
