import type { ReactNode } from "react";
import { PanelFooter } from "@/components/layout/right-panel/panel-footer";
import { SearchBox } from "@/components/layout/right-panel/search-box";
import { StickyPanel } from "@/components/layout/right-panel/sticky-panel";

export function RightPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="h-full w-panel shrink-0">
      <div className="fixed top-0 z-2 flex h-[53px] w-panel items-center bg-background pt-1">
        <SearchBox />
      </div>
      <StickyPanel>
        <div className="pt-3 pb-16">
          <div aria-hidden className="h-[53px]" />
          <div className="flex flex-col gap-4">
            {children}
            <PanelFooter />
          </div>
        </div>
      </StickyPanel>
    </aside>
  );
}
