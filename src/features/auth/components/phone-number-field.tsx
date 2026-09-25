import { useId, useRef, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { PHONE_PATTERN } from "@/config/auth";
import type { PhoneCountry } from "@/config/phone-countries";
import { useSettledTransitions } from "@/features/auth/hooks/use-settled-transitions";
import { fieldBorderClass } from "@/features/auth/utils/field-border";
import { stripDisallowedCharacters } from "@/features/auth/utils/strip-disallowed-characters";
import { CountryPicker } from "@/features/auth/components/country-picker";
import { FieldError } from "@/features/auth/components/field-error";

type PhoneNumberFieldProps = {
  country: PhoneCountry;
  phone: string;
  error?: string;
  autoFocus?: boolean;
  onCountryChange: (country: PhoneCountry) => void;
  onPhoneChange: (phone: string) => void;
};

export function PhoneNumberField({
  country,
  phone,
  error,
  autoFocus = false,
  onCountryChange,
  onPhoneChange,
}: PhoneNumberFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const settled = useSettledTransitions(autoFocus);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onPhoneChange(stripDisallowedCharacters(event.currentTarget.value, PHONE_PATTERN));
  }

  function handleCountrySelect(next: PhoneCountry) {
    onCountryChange(next);
    inputRef.current?.focus();
  }

  return (
    <>
      <label
        htmlFor={inputId}
        className={cn(
          "relative flex w-full cursor-text items-stretch gap-2 rounded-[6px] border-2 bg-black p-4 text-[17px] leading-5 font-normal text-white transition-[border-color] duration-150 ease-[ease]",
          fieldBorderClass(Boolean(error)),
          !settled && "transition-none!",
        )}
      >
        <CountryPicker country={country} onSelect={handleCountrySelect} />
        <input
          ref={inputRef}
          id={inputId}
          name="phone"
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="Phone number"
          aria-label="Phone number"
          autoComplete="tel"
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-5 min-w-0 flex-1 bg-transparent caret-white outline-none placeholder:text-white/50"
        />
      </label>
      {error ? <FieldError id={errorId} message={error} /> : null}
    </>
  );
}
