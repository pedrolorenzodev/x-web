"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export const PASSCODE_LENGTH = 4;

type PasscodeDigitsProps = {
  digits: string[];
  onChange: (digits: string[]) => void;
};

export function PasscodeDigits({ digits, onChange }: PasscodeDigitsProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function focusAt(index: number) {
    inputs.current[Math.min(Math.max(index, 0), PASSCODE_LENGTH - 1)]?.focus();
  }

  function write(index: number, value: string) {
    const next = [...digits];
    next[index] = value;
    onChange(next);
  }

  function onInput(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    write(index, digit);
    focusAt(index + 1);
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        write(index, "");
      } else if (index > 0) {
        write(index - 1, "");
        focusAt(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  function onPaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    const next = [...digits];
    [...pasted].slice(0, PASSCODE_LENGTH - index).forEach((digit, offset) => {
      next[index + offset] = digit;
    });
    onChange(next);
    focusAt(index + pasted.length);
  }

  return (
    <div className="flex gap-6">
      {digits.map((digit, index) => (
        <label key={index} className="group relative block size-[60px]">
          <input
            ref={(element) => {
              inputs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            autoFocus={index === 0}
            value={digit}
            aria-label={`Digit ${index + 1} of ${PASSCODE_LENGTH}`}
            onChange={(event) => onInput(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            onPaste={(event) => onPaste(index, event)}
            className="size-full rounded-full border-2 border-outline bg-transparent text-center text-transparent caret-transparent outline-none transition-colors duration-200 ease-[cubic-bezier(0,0,0.2,1)] focus:border-foreground"
          />
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-1/2 rounded-full bg-foreground transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
              digit ? "scale-100" : "scale-0",
            )}
          />
        </label>
      ))}
    </div>
  );
}
