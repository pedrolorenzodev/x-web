"use client";

import { useRef, type ComponentProps } from "react";
import { ClearCircleFillIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type PillSearchInputProps = Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "className"
> & {
  value: string;
  label: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export function PillSearchInput({
  value,
  label,
  onValueChange,
  className,
  ...inputProps
}: PillSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      className={cn(
        "flex h-11 cursor-text items-center rounded-full border border-border-strong transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:shadow-[0_0_0_1px_var(--color-accent)]",
        className,
      )}
    >
      <span className="flex w-7 shrink-0 pl-3">
        <SearchIcon className="size-4 text-muted" />
      </span>
      <input
        {...inputProps}
        ref={inputRef}
        value={value}
        aria-label={label}
        autoComplete="off"
        onChange={(event) => onValueChange(event.target.value)}
        className="h-10 min-w-0 flex-1 bg-transparent pr-4 pl-1 text-sm outline-none placeholder:text-muted"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear"
          onClick={() => {
            onValueChange("");
            inputRef.current?.focus();
          }}
          className="mr-[13px] flex size-[22px] shrink-0 items-center justify-center rounded-full"
        >
          <ClearCircleFillIcon className="size-[22px] text-inverted" />
        </button>
      ) : null}
    </label>
  );
}
