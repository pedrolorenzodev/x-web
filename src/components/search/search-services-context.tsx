"use client";

import { createContext, use, type ReactNode } from "react";
import type { RecentSearch, TypeaheadResult } from "@/types/search";

type SearchServices = {
  getTypeahead: (query: string) => Promise<TypeaheadResult>;
  getRecentSearches: () => Promise<RecentSearch[]>;
  saveRecentQuery: (query: string) => Promise<void>;
  saveRecentUser: (handle: string) => Promise<void>;
  removeRecentSearch: (id: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
};

const SearchServicesContext = createContext<SearchServices | null>(null);

export function SearchServicesProvider({
  children,
  ...services
}: SearchServices & { children: ReactNode }) {
  return (
    <SearchServicesContext value={services}>{children}</SearchServicesContext>
  );
}

export function useSearchServices() {
  return use(SearchServicesContext);
}
