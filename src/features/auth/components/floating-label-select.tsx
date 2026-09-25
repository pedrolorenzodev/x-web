import { useId, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { DateChevronIcon } from "@/components/ui/icons";
import { FloatingLabelField } from "@/features/auth/components/floating-label-field";

type SelectOption = {
  value: string;
  label: string;
};

type FloatingLabelSelectProps = {
  label: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
};

export function FloatingLabelSelect({
  label,
  name,
  value,
  options,
  onChange,
  autoComplete,
  className,
}: FloatingLabelSelectProps) {
  const selectId = useId();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <FloatingLabelField
      label={label}
      htmlFor={selectId}
      hasValue={value !== ""}
      className={cn("cursor-pointer", className)}
    >
      <span aria-hidden className="h-5" />
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={handleChange}
        autoComplete={autoComplete}
        required
        className="absolute -inset-2 cursor-pointer appearance-none bg-transparent pt-[30px] ps-2 pe-8 pb-2 text-[17px] leading-5 text-white outline-none [color-scheme:dark]"
      >
        <option value="" disabled hidden />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <DateChevronIcon className="pointer-events-none absolute end-1 top-1/2 h-[9px] w-[15px] -translate-y-1/2 text-white" />
    </FloatingLabelField>
  );
}
