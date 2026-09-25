import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillButtonProps = {
  icon: ReactNode;
  children: ReactNode;
  pressable?: boolean;
  onClick?: () => void;
};

export function PillButton({
  icon,
  children,
  pressable = false,
  onClick,
}: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group block w-full rounded-full",
        pressable && "transition-all duration-75 ease-[ease-in-out] active:opacity-80",
      )}
    >
      <span className="flex items-center justify-center rounded-full bg-auth-pill px-6 py-3 group-hover:bg-auth-pill/90">
        <span className="me-2 flex text-black">{icon}</span>
        <span className="text-[15px] leading-5 font-medium text-black">
          {children}
        </span>
      </span>
    </button>
  );
}
