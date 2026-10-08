import { Suspense, type ReactNode } from "react";
import { TabBar } from "@/components/ui/tab-bar";
import { ExploreSearchRow } from "@/features/explore/components/explore-search-row";
import { ExploreTabs } from "@/features/explore/components/explore-tabs";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-3 bg-background">
        <ExploreSearchRow />
        <Suspense fallback={<TabBar label="Explore tabs">{null}</TabBar>}>
          <ExploreTabs />
        </Suspense>
      </div>
      <div className="pb-[200px]">{children}</div>
    </>
  );
}
