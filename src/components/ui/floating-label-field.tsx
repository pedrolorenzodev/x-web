"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type FieldFrameProps = {
  label: string;
  controlId: string;
  labelId: string;
  errorId: string;
  filled: boolean;
  error?: string;
  counter?: string;
  className?: string;
  children: ReactNode;
};

function FieldFrame({
  label,
  controlId,
  labelId,
  errorId,
  filled,
  error,
  counter,
  className,
  children,
}: FieldFrameProps) {
  return (
    <div className={className}>
      <label
        htmlFor={controlId}
        data-filled={filled ? "" : undefined}
        className={cn(
          "group relative block cursor-text rounded border border-border-strong transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-within:border-accent focus-within:shadow-[0_0_0_1px_var(--color-accent)]",
          error &&
            "border-danger focus-within:border-danger focus-within:shadow-[0_0_0_1px_var(--color-danger)]",
        )}
      >
        <span
          id={labelId}
          className={cn(
            "pointer-events-none absolute top-0 left-0 max-w-full truncate px-2 pt-4 text-[17px] leading-6 text-muted",
            "transition-[padding,font-size,line-height,color] duration-150 ease-out",
            "group-focus-within:pt-2 group-focus-within:text-xs group-focus-within:leading-4 group-focus-within:text-accent",
            "group-data-[filled]:pt-2 group-data-[filled]:text-xs group-data-[filled]:leading-4",
            error && "text-danger group-focus-within:text-danger",
          )}
        >
          {label}
        </span>
        {counter ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 hidden px-2 pt-2 text-xs text-muted group-focus-within:block"
          >
            {counter}
          </span>
        ) : null}
        <div className="mt-4 px-2 pt-3 pb-2">{children}</div>
      </label>
      {error ? (
        <p id={errorId} className="px-2 pt-0.5 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ValueProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
};

function counterFor(value: string, maxLength: number | undefined) {
  return maxLength === undefined ? undefined : `${value.length} / ${maxLength}`;
}

type FloatingLabelInputProps = ValueProps &
  Omit<ComponentProps<"input">, "value" | "onChange" | "className" | "id">;

export function FloatingLabelInput({
  label,
  value,
  onChange,
  error,
  className,
  maxLength,
  ...inputProps
}: FloatingLabelInputProps) {
  const controlId = useId();
  const labelId = useId();
  const errorId = useId();

  return (
    <FieldFrame
      label={label}
      controlId={controlId}
      labelId={labelId}
      errorId={errorId}
      filled={value !== ""}
      error={error}
      counter={counterFor(value, maxLength)}
      className={className}
    >
      <input
        {...inputProps}
        id={controlId}
        value={value}
        maxLength={maxLength}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="block w-full bg-transparent text-[17px] leading-5 outline-none"
      />
    </FieldFrame>
  );
}

type FloatingLabelTextareaProps = ValueProps &
  Omit<ComponentProps<"textarea">, "value" | "onChange" | "className" | "id">;

export function FloatingLabelTextarea({
  label,
  value,
  onChange,
  error,
  className,
  maxLength,
  rows = 3,
  ...textareaProps
}: FloatingLabelTextareaProps) {
  const controlId = useId();
  const labelId = useId();
  const errorId = useId();

  return (
    <FieldFrame
      label={label}
      controlId={controlId}
      labelId={labelId}
      errorId={errorId}
      filled={value !== ""}
      error={error}
      counter={counterFor(value, maxLength)}
      className={className}
    >
      <textarea
        {...textareaProps}
        id={controlId}
        rows={rows}
        value={value}
        maxLength={maxLength}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="block w-full resize-none bg-transparent text-[17px] leading-5 outline-none"
      />
    </FieldFrame>
  );
}

export type FloatingLabelOption = {
  value: string;
  label: string;
};

type FloatingLabelSelectProps = ValueProps & {
  options: FloatingLabelOption[];
} & Omit<
    ComponentProps<"select">,
    "value" | "onChange" | "className" | "id" | "children"
  >;

export function FloatingLabelSelect({
  label,
  value,
  onChange,
  error,
  className,
  options,
  ...selectProps
}: FloatingLabelSelectProps) {
  const controlId = useId();
  const labelId = useId();
  const errorId = useId();

  return (
    <FieldFrame
      label={label}
      controlId={controlId}
      labelId={labelId}
      errorId={errorId}
      filled={value !== ""}
      error={error}
      className={cn("[&>label]:cursor-pointer", className)}
    >
      <span aria-hidden className="block h-5" />
      <select
        {...selectProps}
        id={controlId}
        value={value}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="absolute inset-0 cursor-pointer appearance-none bg-transparent pt-7 pr-10 pb-2 pl-2 text-[17px] leading-5 outline-none [color-scheme:dark]"
      >
        {value === "" ? <option value="" disabled hidden /> : null}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-background"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-[22px] -translate-y-1/2 text-foreground group-focus-within:text-accent" />
    </FieldFrame>
  );
}
