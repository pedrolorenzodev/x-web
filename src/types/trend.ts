export type TrendContext =
  | { kind: "location"; location: string }
  | { kind: "category"; category: string };

export type Trend = {
  id: string;
  name: string;
  query: string;
  context: TrendContext;
  postCount: number | null;
};

export type ExploreTabId =
  | "for_you"
  | "trending"
  | "news"
  | "sports"
  | "entertainment";
