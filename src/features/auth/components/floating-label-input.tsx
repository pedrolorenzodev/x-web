import {
  useId,
  type ChangeEvent,
  type HTMLInputTypeAttribute,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useSettledTransitions } from "@/features/auth/hooks/use-settled-transitions";
import { stripDisallowedCharacters } from "@/features/auth/utils/strip-disallowed-characters";
import { FieldError } from "@/features/auth/components/field-error";
import { FloatingLabelField } from "@/features/auth/components/floating-label-field";

type FloatingLabelInputProps = {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  autoFocus?: boolean;
  pattern?: string;
  maxLength?: number;
  showCounter?: boolean;
  disabled?: boolean;
  error?: string;
  prefix?: string;
  trailing?: ReactNode;
};

function withoutPrefix(value: string, prefix: string) {
  let result = value;
  while (result.startsWith(prefix)) result = result.slice(prefix.length);
  return result;
}

export function FloatingLabelInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  autoFocus,
  pattern,
  maxLength,
  showCounter = false,
  disabled,
  error,
  prefix,
  trailing,
}: FloatingLabelInputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const settled = useSettledTransitions(Boolean(autoFocus));

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (pattern) {
      const filtered = stripDisallowedCharacters(input.value, pattern);
      if (filtered !== input.value) {
        const caret = input.selectionStart ?? input.value.length;
        const nextCaret = stripDisallowedCharacters(
          input.value.slice(0, caret),
          pattern,
        ).length;
        input.value = filtered;
        input.setSelectionRange(nextCaret, nextCaret);
      }
    }
    onChange?.(prefix ? withoutPrefix(input.value, prefix) : input.value);
  }

  const input = (
    <input
      id={inputId}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      pattern={pattern}
      maxLength={maxLength}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      className="h-5 w-full bg-transparent caret-white outline-none disabled:cursor-default"
    />
  );

  return (
    <>
      <FloatingLabelField
        label={label}
        htmlFor={inputId}
        hasValue={value !== ""}
        invalid={Boolean(error)}
        settled={settled}
      >
        {prefix ? (
          <span className="flex">
            <span
              aria-hidden
              className={cn(
                "invisible group-focus-within/field:visible group-data-has-value/field:visible",
                value === "" && "opacity-50",
              )}
            >
              {prefix}
            </span>
            {input}
          </span>
        ) : (
          input
        )}
        {showCounter && maxLength ? (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute end-2 top-1 hidden text-[12px] leading-3 group-focus-within/field:block",
              error ? "text-auth-error" : "text-auth-focus",
            )}
          >
            {value.length} / {maxLength}
          </span>
        ) : null}
        {trailing ? (
          <span className="absolute end-2 top-1/2 flex -translate-y-1/2">
            {trailing}
          </span>
        ) : null}
      </FloatingLabelField>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </>
  );
}
