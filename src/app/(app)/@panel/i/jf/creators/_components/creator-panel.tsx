import { Suspense } from "react";
import { PanelWhoToFollow } from "@/app/(app)/@panel/_modules/panel-who-to-follow";
import { RightPanel } from "@/components/layout/right-panel/right-panel";

export function CreatorPanel() {
  return (
    <RightPanel>
      <Suspense fallback={null}>
        <PanelWhoToFollow />
      </Suspense>
    </RightPanel>
  );
}
