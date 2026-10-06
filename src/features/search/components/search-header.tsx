import type { ReactNode } from "react";
import { BackButton } from "@/components/layout/back-button";
import { SearchCombobox } from "@/components/search/search-combobox";
import { SearchOverflowMenu } from "@/features/search/components/search-overflow-menu";

type SearchHeaderProps = {
  query: string;
  advancedHref: string;
  children: ReactNode;
};

export function SearchHeader({ query, advancedHref, children }: SearchHeaderProps) {
  return (
    <div className="sticky top-0 z-3 bg-background">
      <div className="flex h-[53px] items-start px-4 pt-2">
        <div className="min-w-14">
          <BackButton />
        </div>
        <SearchCombobox key={query} defaultValue={query} className="min-w-0 flex-1" />
        <div className="-mr-1 ml-6 flex shrink-0">
          <SearchOverflowMenu advancedHref={advancedHref} />
        </div>
      </div>
      {children}
    </div>
  );
}
