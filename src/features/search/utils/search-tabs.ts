import type { SearchSource, SearchTab } from "@/features/search/types/search-tab";

export const searchTabs: { id: SearchTab; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "live", label: "Latest" },
  { id: "user", label: "People" },
  { id: "media", label: "Media" },
  { id: "list", label: "Lists" },
];

export function parseSearchTab(value: string): SearchTab {
  return searchTabs.find((tab) => tab.id !== "top" && tab.id === value)?.id ?? "top";
}

export function readSearchParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export function sourceQuery(source: SearchSource) {
  return source.kind === "hashtag" ? `#${source.tag}` : source.query;
}

export function searchTabHref(source: SearchSource, tab: SearchTab) {
  const params =
    source.kind === "hashtag"
      ? new URLSearchParams({ src: "hashtag_click" })
      : new URLSearchParams({ q: source.query, src: source.src });
  if (tab !== "top") params.set("f", tab);

  const path =
    source.kind === "hashtag"
      ? `/hashtag/${encodeURIComponent(source.tag)}`
      : "/search";
  return `${path}?${params.toString()}`;
}

export function advancedSearchHref(source: SearchSource) {
  return source.kind === "hashtag"
    ? "/search-advanced"
    : `/search-advanced?${new URLSearchParams({ q: source.query }).toString()}`;
}
