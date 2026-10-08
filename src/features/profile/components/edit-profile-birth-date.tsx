"use client";

import { useState } from "react";
import type { BirthDateVisibility, Visibility } from "@/types/user";
import { ChevronRightIcon } from "@/components/ui/icons";
import {
  FloatingLabelSelect,
  type FloatingLabelOption,
} from "@/components/ui/floating-label-field";

export type BirthDateParts = {
  month: string;
  day: string;
  year: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS_SHOWN = 121;
const PRIVACY_POLICY_URL = "https://x.com/en/privacy";
const BIRTHDAY_HELP_URL =
  "https://help.x.com/en/managing-your-account/how-to-customize-your-profile";

const monthOptions = MONTH_NAMES.map((label, index) => ({
  value: String(index + 1),
  label,
}));

const visibilityLabels: Record<Visibility, string> = {
  public: "Public",
  followers: "Your followers",
  following: "People you follow",
  mutual: "You follow each other",
  self: "Only you",
};

const visibilityOptions: FloatingLabelOption[] = Object.entries(
  visibilityLabels,
).map(([value, label]) => ({ value, label }));

function isVisibility(value: string): value is Visibility {
  return Object.hasOwn(visibilityLabels, value);
}

function daysInMonth(month: string, year: string) {
  if (month === "") return 31;
  const leapSafeYear = Number(year || 2000);
  return new Date(Date.UTC(leapSafeYear, Number(month), 0)).getUTCDate();
}

function numberOptions(values: number[]) {
  return values.map((value) => ({
    value: String(value),
    label: String(value),
  }));
}

export function formatBirthDate({ month, day, year }: BirthDateParts) {
  if (month === "" || day === "" || year === "") return null;
  return `${MONTH_NAMES[Number(month) - 1]} ${day}, ${year}`;
}

export function withBirthDatePart(
  value: BirthDateParts,
  part: keyof BirthDateParts,
  next: string,
): BirthDateParts {
  const updated = { ...value, [part]: next };
  const maxDay = daysInMonth(updated.month, updated.year);
  if (updated.day !== "" && Number(updated.day) > maxDay) {
    updated.day = String(maxDay);
  }
  return updated;
}

type BirthDateRowProps = {
  value: BirthDateParts;
  onEdit: () => void;
};

export function EditProfileBirthDateRow({ value, onEdit }: BirthDateRowProps) {
  const formatted = formatBirthDate(value);

  return (
    <button
      type="button"
      onClick={onEdit}
      className="mt-4 flex w-full items-center px-4 py-3 text-left transition-colors duration-200 ease-[ease] outline-none hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03]"
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-base">Birth date</span>
        <span className={formatted ? "text-base" : "text-base text-muted"}>
          {formatted ?? "Add your date of birth"}
        </span>
      </span>
      <ChevronRightIcon className="box-content size-[18.75px] shrink-0 pl-3 text-muted" />
    </button>
  );
}

type BirthDateEditorProps = {
  value: BirthDateParts;
  visibility: BirthDateVisibility;
  onChange: (value: BirthDateParts) => void;
  onVisibilityChange: (visibility: BirthDateVisibility) => void;
  onCancel: () => void;
  onRemove: () => void;
};

export function EditProfileBirthDateEditor({
  value,
  visibility,
  onChange,
  onVisibilityChange,
  onCancel,
  onRemove,
}: BirthDateEditorProps) {
  const [currentYear] = useState(() => new Date().getFullYear());
  const yearOptions = numberOptions(
    Array.from({ length: YEARS_SHOWN }, (_, index) => currentYear - index),
  );
  const dayOptions = numberOptions(
    Array.from(
      { length: daysInMonth(value.month, value.year) },
      (_, index) => index + 1,
    ),
  );

  function change(part: keyof BirthDateParts) {
    return (next: string) => onChange(withBirthDatePart(value, part, next));
  }

  function changeVisibility(part: keyof BirthDateVisibility) {
    return (next: string) => {
      if (isVisibility(next)) onVisibilityChange({ ...visibility, [part]: next });
    };
  }

  return (
    <div className="mt-4 px-4 py-3">
      <p className="text-base">
        <span className="font-bold">Birth date</span>
        {" · "}
        <button
          type="button"
          onClick={onCancel}
          className="text-accent hover:underline"
        >
          Cancel
        </button>
      </p>
      <p className="mt-1 text-base text-muted">
        This should be the date of birth of the person using the account. Even
        if you’re making an account for your business, event, or cat.
      </p>
      <p className="mt-2 text-base text-muted">
        X uses your age to customize your experience, including ads, as
        explained in our{" "}
        <a
          href={PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      <div className="mt-5 flex gap-3">
        <FloatingLabelSelect
          label="Month"
          value={value.month}
          options={monthOptions}
          onChange={change("month")}
          className="flex-[271]"
        />
        <FloatingLabelSelect
          label="Day"
          value={value.day}
          options={dayOptions}
          onChange={change("day")}
          className="flex-[122]"
        />
        <FloatingLabelSelect
          label="Year"
          value={value.year}
          options={yearOptions}
          onChange={change("year")}
          className="flex-[145]"
        />
      </div>

      <p className="mt-8 text-base font-bold">Who sees this?</p>
      <p className="text-base text-muted">
        You can control who sees your birthday on X.{" "}
        <a
          href={BIRTHDAY_HELP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Learn more
        </a>
      </p>
      <div className="mt-5 flex flex-col gap-8">
        <FloatingLabelSelect
          label="Month and day"
          value={visibility.monthDay}
          options={visibilityOptions}
          onChange={changeVisibility("monthDay")}
        />
        <FloatingLabelSelect
          label="Year"
          value={visibility.year}
          options={visibilityOptions}
          onChange={changeVisibility("year")}
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="mt-8 flex h-[52px] w-full items-center justify-center text-base text-danger transition-colors duration-200 ease-[ease] hover:bg-danger/10"
      >
        Remove birth date
      </button>
    </div>
  );
}
