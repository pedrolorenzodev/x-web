import type { Page } from "@/types/pagination";

export type DatedEntry<T> = {
  item: T;
  id: string;
  at: string;
};

function entryKey(entry: { id: string; at: string }) {
  return `${entry.at}|${entry.id}`;
}

export function paginateByDate<T>(
  entries: DatedEntry<T>[],
  cursor: string | null,
  size: number,
): Page<T> {
  const sorted = entries
    .map((entry) => ({ ...entry, key: entryKey(entry) }))
    .sort((a, b) => b.key.localeCompare(a.key));
  const remaining = cursor
    ? sorted.filter((entry) => entry.key.localeCompare(cursor) < 0)
    : sorted;
  const slice = remaining.slice(0, size);
  const last = slice.at(-1);

  return {
    items: slice.map((entry) => entry.item),
    nextCursor: last && remaining.length > size ? last.key : null,
  };
}
