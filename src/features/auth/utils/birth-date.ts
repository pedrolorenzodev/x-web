import type { BirthDate } from "@/features/auth/types/onboarding";
import { BIRTH_YEAR_RANGE } from "@/config/auth";

const LEAP_YEAR = 2000;

export const MONTH_NAMES = [
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

export function daysInMonth(month: string, year: string) {
  if (!month) return 31;
  return new Date(Number(year) || LEAP_YEAR, Number(month), 0).getDate();
}

export function birthYears(currentYear: number) {
  return Array.from({ length: BIRTH_YEAR_RANGE + 1 }, (_, index) =>
    String(currentYear - index),
  );
}

export function withBirthDatePart(
  birthDate: BirthDate,
  part: keyof BirthDate,
  value: string,
): BirthDate {
  const next = { ...birthDate, [part]: value };
  const lastDay = daysInMonth(next.month, next.year);
  return next.day && Number(next.day) > lastDay
    ? { ...next, day: String(lastDay) }
    : next;
}

export function isCompleteBirthDate({ month, day, year }: BirthDate) {
  return month !== "" && day !== "" && year !== "";
}
