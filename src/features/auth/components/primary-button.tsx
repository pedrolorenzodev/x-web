import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/features/auth/components/spinner";

type PrimaryButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

const label = "text-center text-[17px] leading-5 font-medium";

export function PrimaryButton({
  children,
  disabled = false,
  loading = false,
  className,
}: PrimaryButtonProps) {
  if (disabled && !loading) {
    return (
      <div
        aria-disabled
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-full bg-auth-cta-disabled",
          className,
        )}
      >
        <span className={cn(label, "text-auth-cta-disabled-text")}>
          {children}
        </span>
      </div>
    );
  }

  return (
    <button
      type={loading ? "button" : "submit"}
      aria-busy={loading || undefined}
      className={cn(
        "group block w-full rounded-full transition-all duration-75 ease-[ease-in-out] active:opacity-80",
        className,
      )}
    >
      <span className="flex h-12 items-center justify-center rounded-full bg-white group-hover:bg-white/90">
        {loading ? (
          <Spinner />
        ) : (
          <span className={cn(label, "text-black")}>{children}</span>
        )}
      </span>
    </button>
  );
}
