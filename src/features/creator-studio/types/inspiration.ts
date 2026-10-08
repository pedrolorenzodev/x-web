export const inspirationWindows = ["24h", "7d", "30d"] as const;
export type InspirationWindow = (typeof inspirationWindows)[number];

export const inspirationSorts = [
  "likes",
  "replies",
  "quotes",
  "bookmarks",
] as const;
export type InspirationSort = (typeof inspirationSorts)[number];
