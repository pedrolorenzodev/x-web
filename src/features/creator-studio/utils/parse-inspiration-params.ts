import {
  inspirationSorts,
  inspirationWindows,
  type InspirationSort,
  type InspirationWindow,
} from "@/features/creator-studio/types/inspiration";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseInspirationParams(params: {
  window?: string | string[];
  sort?: string | string[];
}): { window: InspirationWindow; sort: InspirationSort } {
  const window = firstValue(params.window);
  const sort = firstValue(params.sort);
  return {
    window: inspirationWindows.find((item) => item === window) ?? "24h",
    sort: inspirationSorts.find((item) => item === sort) ?? "likes",
  };
}
