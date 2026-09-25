import type { BirthDate } from "@/features/auth/types/onboarding";
import {
  MONTH_NAMES,
  birthYears,
  daysInMonth,
  withBirthDatePart,
} from "@/features/auth/utils/birth-date";
import { FloatingLabelSelect } from "@/features/auth/components/floating-label-select";

type BirthDateFieldProps = {
  value: BirthDate;
  onChange: (value: BirthDate) => void;
};

const monthOptions = MONTH_NAMES.map((label, index) => ({
  value: String(index + 1),
  label,
}));

export function BirthDateField({ value, onChange }: BirthDateFieldProps) {
  const yearOptions = birthYears(new Date().getFullYear()).map((year) => ({
    value: year,
    label: year,
  }));
  const dayOptions = Array.from(
    { length: daysInMonth(value.month, value.year) },
    (_, index) => ({ value: String(index + 1), label: String(index + 1) }),
  );

  function change(part: keyof BirthDate) {
    return (next: string) => onChange(withBirthDatePart(value, part, next));
  }

  return (
    <div className="flex flex-col">
      <p className="text-[15px] leading-5 font-bold text-white">Date of birth</p>
      <p className="mt-1 text-[14px] leading-5 font-normal text-auth-subtle">
        This will not be shown publicly. Confirm your own age, even if this account
        is for a business, a pet, or something else.
      </p>
      <div className="mt-4 flex gap-2">
        <FloatingLabelSelect
          label="Month"
          name="birth_month"
          value={value.month}
          options={monthOptions}
          onChange={change("month")}
          autoComplete="bday-month"
          className="flex-2"
        />
        <FloatingLabelSelect
          label="Day"
          name="birth_day"
          value={value.day}
          options={dayOptions}
          onChange={change("day")}
          autoComplete="bday-day"
          className="flex-1"
        />
        <FloatingLabelSelect
          label="Year"
          name="birth_year"
          value={value.year}
          options={yearOptions}
          onChange={change("year")}
          autoComplete="bday-year"
          className="flex-1"
        />
      </div>
    </div>
  );
}
