import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tones = {
  accent: "text-muted hover:bg-accent/10 hover:text-accent",
  plain: "text-inverted hover:bg-inverted/10",
} as const;

type IconButtonProps = ComponentProps<"button"> & {
  label: string;
  tone?: keyof typeof tones;
};

export function IconButton({
  label,
  tone = "accent",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-[34.8px] shrink-0 items-center justify-center rounded-full",
        "transition-colors duration-200 ease-[ease]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
