import type { ComponentProps } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<ComponentProps<"input">, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <span
      className={cn(
        "group/checkbox relative flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-accent/10 has-focus-visible:bg-accent/10",
        className,
      )}
    >
      <input
        type="checkbox"
        className="peer absolute inset-0 cursor-pointer opacity-0"
        {...props}
      />
      <span className="pointer-events-none flex size-5 items-center justify-center rounded-[4px] border-2 border-muted transition-colors duration-200 ease-[ease] peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:shadow-[0_0_0_2px_var(--color-accent)] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
        <CheckIcon className="size-[18px] text-white" />
      </span>
    </span>
  );
}
