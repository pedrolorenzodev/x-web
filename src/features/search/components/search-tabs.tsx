import { Tab } from "@/components/ui/tab";
import type { SearchSource, SearchTab } from "@/features/search/types/search-tab";
import { searchTabHref, searchTabs } from "@/features/search/utils/search-tabs";

type SearchTabsProps = {
  source: SearchSource;
  active: SearchTab;
};

export function SearchTabs({ source, active }: SearchTabsProps) {
  return (
    <div role="tablist" className="flex overflow-x-auto border-b border-border">
      {searchTabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          href={searchTabHref(source, tab.id)}
          active={tab.id === active}
        />
      ))}
    </div>
  );
}
