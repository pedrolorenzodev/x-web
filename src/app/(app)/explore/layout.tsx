import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { SearchBox } from "@/components/layout/right-panel/search-box";
import { SettingsIcon } from "@/components/ui/icons";
import { TabBar } from "@/components/ui/tab-bar";
import { ExploreTabs } from "@/features/explore/components/explore-tabs";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-3 bg-background">
        <div className="flex h-[53px] items-center gap-3 pr-[7px] pl-4">
          <div className="min-w-0 flex-1">
            <SearchBox />
          </div>
          <Link
            href="/settings/explore"
            aria-label="Settings"
            className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
          >
            <SettingsIcon className="size-5" />
          </Link>
        </div>
        <Suspense fallback={<TabBar label="Explore tabs">{null}</TabBar>}>
          <ExploreTabs />
        </Suspense>
      </div>
      <div className="pb-[200px]">{children}</div>
    </>
  );
}
