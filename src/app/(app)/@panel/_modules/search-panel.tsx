import { Suspense } from "react";
import { PanelTrends } from "@/app/(app)/@panel/_modules/panel-trends";
import { PanelNews } from "@/app/(app)/@panel/_modules/panel-news";
import { PanelWhoToFollow } from "@/app/(app)/@panel/_modules/panel-who-to-follow";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { SearchFiltersCard } from "@/features/search/components/search-filters-card";
import type { SearchSource } from "@/features/search/types/search-tab";
import {
  parseSearchFilters,
  parseSearchTab,
  readSearchParam,
  searchFilterGroups,
} from "@/features/search/utils/search-tabs";

type SearchPanelProps = {
  source: SearchSource;
  params: Record<string, string | string[] | undefined>;
};

export function SearchPanel({ source, params }: SearchPanelProps) {
  const groups = searchFilterGroups(
    source,
    parseSearchTab(readSearchParam(params.f)),
    parseSearchFilters(params),
  );

  return (
    <RightPanel search={false}>
      <SearchFiltersCard groups={groups} advancedHref="/search-advanced" />
      <Suspense fallback={null}>
        <PanelNews />
      </Suspense>
      <Suspense fallback={null}>
        <PanelTrends />
      </Suspense>
      <Suspense fallback={null}>
        <PanelWhoToFollow />
      </Suspense>
    </RightPanel>
  );
}
