import type { UserSummary } from "@/types/user";

export type RecentSearch =
  | { id: string; kind: "query"; query: string; searchedAt: string }
  | { id: string; kind: "user"; user: UserSummary; searchedAt: string };

export type TypeaheadResult = {
  query: string;
  suggestions: string[];
  users: UserSummary[];
  exactHandle: string | null;
};
