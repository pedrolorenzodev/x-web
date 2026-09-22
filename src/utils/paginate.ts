import type { Page } from "@/types/pagination";

export function paginate<T>(
  items: T[],
  cursor: string | null,
  size: number,
  getId: (item: T) => string,
): Page<T> {
  const start = cursor
    ? items.findIndex((item) => getId(item) === cursor) + 1
    : 0;
  const slice = items.slice(start, start + size);
  const last = slice.at(-1);
  const hasMore = start + slice.length < items.length;

  return {
    items: slice,
    nextCursor: hasMore && last ? getId(last) : null,
  };
}
