import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fieldBorderClass } from "@/features/auth/utils/field-border";

type FloatingLabelFieldProps = {
  label: string;
  htmlFor: string;
  hasValue: boolean;
  invalid?: boolean;
  settled?: boolean;
  className?: string;
  children: ReactNode;
};

const raised =
  "group-focus-within/field:[transform:translateY(0)_scale(1)] group-data-has-value/field:[transform:translateY(0)_scale(1)] group-has-[input:autofill]/field:[transform:translateY(0)_scale(1)]";

export function FloatingLabelField({
  label,
  htmlFor,
  hasValue,
  invalid = false,
  settled = true,
  className,
  children,
}: FloatingLabelFieldProps) {
  return (
    <label
      htmlFor={htmlFor}
      data-has-value={hasValue || undefined}
      className={cn(
        "group/field relative flex w-full cursor-text flex-col justify-end rounded-[6px] border-2 bg-black p-2 text-[17px] leading-5 font-normal text-white transition-[border-color] duration-150 ease-[ease]",
        fieldBorderClass(invalid),
        !settled && "transition-none! **:transition-none!",
        className,
      )}
    >
      <span className="relative flex flex-col justify-end">
        <span
          className={cn(
            "pointer-events-none absolute start-0 top-0 max-w-[calc(100%-16px)] origin-top-left overflow-hidden text-[12px] leading-[18px] text-ellipsis whitespace-nowrap [transform:translateY(50%)_scale(1.333)] [transition:transform_150ms_cubic-bezier(0.4,0,0.2,1),color_150ms,opacity_150ms]",
            raised,
            invalid
              ? "text-auth-error opacity-100"
              : "opacity-50 group-focus-within/field:text-auth-focus group-focus-within/field:opacity-100",
          )}
        >
          {label}
        </span>
        <span aria-hidden className="invisible mb-1 text-[12px] leading-[18px]">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}
