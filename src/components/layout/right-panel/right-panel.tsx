import type { ReactNode } from "react";
import { PanelFooter } from "@/components/layout/right-panel/panel-footer";
import { SearchBox } from "@/components/layout/right-panel/search-box";
import { StickyPanel } from "@/components/layout/right-panel/sticky-panel";

type RightPanelProps = {
  search?: boolean;
  children: ReactNode;
};

export function RightPanel({ search = true, children }: RightPanelProps) {
  return (
    <aside className="h-full w-[290px] shrink-0 min-[1078px]:w-panel">
      {search ? (
        <div className="fixed top-0 z-2 flex h-[53px] w-[290px] items-center bg-background pt-1 min-[1078px]:w-panel">
          <SearchBox />
        </div>
      ) : null}
      <StickyPanel>
        <div className="pt-3 pb-16">
          {search ? <div aria-hidden className="h-[53px]" /> : null}
          <div className="flex flex-col gap-4">
            {children}
            <PanelFooter />
          </div>
        </div>
      </StickyPanel>
    </aside>
  );
}
