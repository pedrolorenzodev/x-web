import type { ReactNode } from "react";
import { PanelFooter } from "@/components/layout/right-panel/panel-footer";
import { SearchBox } from "@/components/layout/right-panel/search-box";

export function RightPanel({ children }: { children: ReactNode }) {
  return (
    <aside className="w-panel shrink-0">
      <div className="sticky top-0 flex flex-col gap-4 pt-1.5">
        <SearchBox />
        {children}
        <PanelFooter />
      </div>
    </aside>
  );
}
