import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-inverted text-inverted-foreground hover:bg-inverted/90",
  outline: "border border-border-strong text-foreground hover:bg-foreground/10",
  accent: "bg-accent text-white hover:bg-accent/90",
} as const;

const sizes = {
  sm: "h-8 px-4 text-sm",
  md: "h-9 px-4 text-base",
  lg: "h-13 px-8 text-lg",
} as const;

type ButtonStyle = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

type ButtonProps = ComponentProps<"button"> & ButtonStyle;

export function buttonStyles({ variant = "primary", size = "md" }: ButtonStyle) {
  return cn(
    "inline-flex items-center justify-center rounded-full border border-transparent font-bold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
  );
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
