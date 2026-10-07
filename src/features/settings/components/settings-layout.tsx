import { Suspense, type ReactNode } from "react";
import { LayoutMode } from "@/components/layout/layout-mode";
import {
  SettingsNav,
  SettingsNavPanel,
} from "@/features/settings/components/settings-nav";

export function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <LayoutMode mode="no-panel" />
      <section
        aria-label="Section navigation"
        className="sticky top-0 h-screen w-[449px] shrink-0 overflow-y-auto border-r border-border"
      >
        <Suspense fallback={<SettingsNavPanel activeId={null} />}>
          <SettingsNav />
        </Suspense>
      </section>
      <section aria-label="Section details" className="min-h-screen w-[599px] shrink-0">
        {children}
      </section>
    </div>
  );
}
