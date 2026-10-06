import type { ComponentProps } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type RadioProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
};

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center justify-between gap-4 px-8 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3",
        className,
      )}
    >
      <span className="text-base font-bold">{label}</span>
      <span className="relative flex size-[34.75px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] group-hover:bg-accent/10">
        <input type="radio" className="peer absolute inset-0 opacity-0" {...props} />
        <span className="flex size-5 items-center justify-center rounded-full border-2 border-outline peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
          <CheckIcon className="size-3.5 text-white" />
        </span>
      </span>
    </label>
  );
}
