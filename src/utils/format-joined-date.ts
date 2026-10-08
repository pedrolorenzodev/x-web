import { formatMonthYear } from "@/utils/format-month-year";

export function formatJoinedDate(iso: string) {
  return `Joined ${formatMonthYear(iso)}`;
}
