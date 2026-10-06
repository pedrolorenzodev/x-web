import type { ProfileSort } from "@/features/profile/types/profile-tab";

export function parseSort(value: string | string[] | undefined): ProfileSort {
  return value === "popular" ? "popular" : "recent";
}
