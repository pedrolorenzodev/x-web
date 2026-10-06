export type RecentSearchRecord = {
  id: string;
  viewerId: string;
  query: string | null;
  userId: string | null;
  searchedAt: string;
};

export const mockRecentSearches: RecentSearchRecord[] = [];
