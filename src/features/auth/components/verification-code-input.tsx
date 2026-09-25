import { useId, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { RESET_CODE_LENGTH } from "@/config/auth";
import { fieldBorderClass } from "@/features/auth/utils/field-border";
import { FieldError } from "@/features/auth/components/field-error";

type VerificationCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  error?: string;
};

const slots = Array.from({ length: RESET_CODE_LENGTH }, (_, index) => index);

export function VerificationCodeInput({
  value,
  onChange,
  autoFocus,
  error,
}: VerificationCodeInputProps) {
  const errorId = useId();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value.replace(/\D/g, "").slice(0, RESET_CODE_LENGTH));
  }

  return (
    <>
      <fieldset className="group/code">
        <legend className="sr-only">Verification code</legend>
        <div className="relative flex justify-between gap-2">
          {slots.map((slot) => (
            <div
              key={slot}
              className={cn(
                "relative flex size-14 items-center justify-center rounded-[6px] border-2 bg-black p-2 text-[17px] leading-5 font-normal text-white transition-[background-color,border-color] duration-150 select-none",
                fieldBorderClass(Boolean(error)),
              )}
            >
              {value[slot] ??
                (slot === value.length ? (
                  <span className="hidden h-[1.25em] w-0.5 animate-caret-blink rounded-[1px] bg-current group-focus-within/code:block" />
                ) : null)}
            </div>
          ))}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label="Verification code"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            maxLength={RESET_CODE_LENGTH}
            value={value}
            onChange={handleChange}
            autoFocus={autoFocus}
            className="absolute inset-0 size-full cursor-text appearance-none border-0 bg-transparent p-0 text-center text-[16px] text-transparent caret-transparent outline-none selection:bg-transparent"
          />
        </div>
      </fieldset>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </>
  );
}
