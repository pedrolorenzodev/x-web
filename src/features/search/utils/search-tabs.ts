import type {
  SearchFilters,
  SearchSource,
  SearchTab,
} from "@/features/search/types/search-tab";

export const defaultSearchFilters: SearchFilters = {
  peopleYouFollow: false,
  nearYou: false,
};

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

export function parseSearchFilters(params: {
  pf?: string | string[];
  lf?: string | string[];
}): SearchFilters {
  return {
    peopleYouFollow: readSearchParam(params.pf) === "on",
    nearYou: readSearchParam(params.lf) === "on",
  };
}

export function sourceQuery(source: SearchSource) {
  return source.kind === "hashtag" ? `#${source.tag}` : source.query;
}

export function searchTabHref(
  source: SearchSource,
  tab: SearchTab,
  filters: SearchFilters = defaultSearchFilters,
) {
  const params =
    source.kind === "hashtag"
      ? new URLSearchParams({ src: "hashtag_click" })
      : new URLSearchParams({ q: source.query, src: source.src });
  if (tab !== "top") params.set("f", tab);
  if (filters.peopleYouFollow) params.set("pf", "on");
  if (filters.nearYou) params.set("lf", "on");

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

export type SearchFilterOption = {
  label: string;
  href: string;
  checked: boolean;
};

export type SearchFilterGroup = {
  label: string;
  options: SearchFilterOption[];
};

export function searchFilterGroups(
  source: SearchSource,
  tab: SearchTab,
  filters: SearchFilters,
): SearchFilterGroup[] {
  const hrefWith = (change: Partial<SearchFilters>) =>
    searchTabHref(source, tab, { ...filters, ...change });

  return [
    {
      label: "People",
      options: [
        {
          label: "From anyone",
          href: hrefWith({ peopleYouFollow: false }),
          checked: !filters.peopleYouFollow,
        },
        {
          label: "People you follow",
          href: hrefWith({ peopleYouFollow: true }),
          checked: filters.peopleYouFollow,
        },
      ],
    },
    {
      label: "Location",
      options: [
        {
          label: "Anywhere",
          href: hrefWith({ nearYou: false }),
          checked: !filters.nearYou,
        },
        {
          label: "Near you",
          href: hrefWith({ nearYou: true }),
          checked: filters.nearYou,
        },
      ],
    },
  ];
}
